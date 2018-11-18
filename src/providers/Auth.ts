import { UserInfo } from './../models/UserInfo';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from '@ionic/storage';

import { UserProvider } from './User';
import { RegCodeProvider } from './RegCode';

import { User } from 'firebase';
import { SignInfo } from './../models/SignInfo';

@Injectable()
export class AuthProvider {

  constructor(
    private storage: Storage,
    private afAuth: AngularFireAuth,
    private userService: UserProvider,
    private regCodeService: RegCodeProvider
  ) {
  }

  get uid() {
    return this.getCurrentUser().uid;
  }

  getCurrentUser(): User {
    return this.afAuth.auth.currentUser;
  }

  getIdToken(): Promise<any> {
    return this.getCurrentUser().getIdToken(true);
  }

  signUp(signInfo: SignInfo): Promise<User> {
    return new Promise<User>((resolve, reject) => {

      // check regCode
      return this.regCodeService.checkRegCode(signInfo.regCode).then(() => {

        // create account
        return this.afAuth.auth
          .createUserWithEmailAndPassword(signInfo.email, signInfo.pw).then(userCredential => {
          const user = userCredential.user;

          // send email
          return user.sendEmailVerification().then(() => {

            let userInfo = new UserInfo();
            userInfo.uid = user.uid;
            userInfo.email = user.email;
            userInfo.emailVerified = user.emailVerified
            userInfo.name = signInfo.name;
            userInfo.pw = signInfo.pw;
            userInfo.regCode = signInfo.regCode;
            userInfo.lastDate = new Date();

            this.storage.set('savedId', user.email);
            return this.userService.setUser(userInfo).then(() => {
              resolve(user);
            }).catch(err => reject("The database creation failed."))
          }).catch(err => reject("Failed to send email!"));
        }).catch(err => reject(err))
      }).catch(err => reject("Unavailable registration code!"));
    });
  }

  signIn(signInfo: SignInfo): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      return this.afAuth.auth.signInWithEmailAndPassword(signInfo.email, signInfo.pw)
      .then(userCredential => {

        const user = userCredential.user;

        if (user.emailVerified) {
          let userInfo = new UserInfo();
          userInfo.uid = user.uid;
          userInfo.email = user.email;
          userInfo.emailVerified = user.emailVerified
          userInfo.pw = signInfo.pw;
          userInfo.lastDate = new Date();
  
          this.storage.set('savedId', user.email);
          this.userService.updateUser(userInfo);
        }

        resolve(user);

      }).catch(error => reject("Login failed!"));
    });
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }

}
