import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CommonProvider } from '../../providers/Common';
import { AuthProvider } from './../../providers/Auth';

import { SignInfo } from './../../models/SignInfo';
import { SignUpPage } from './../sign-up/sign-up';

@Component({
  selector: 'page-sign-in',
  templateUrl: 'sign-in.html',
})
export class SignInPage {

  public signInfo = new SignInfo();

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private cmnService: CommonProvider,
    private authService: AuthProvider
  ) {
  }

  ionViewDidLoad() {
    this.storage.get('savedId').then(data => this.signInfo.email = data);
  }

  private checkInput(): string {
    let result: string = null;

    const email = this.signInfo.email;
    const pw = this.signInfo.pw;

    if (email == null || email.trim() == '') {
      return 'The email is badly formatted.';
    }

    if (pw == null || pw == '') {
      return 'The password is badly formatted.';
    }

    return result;
  }

  signIn(): void {

    const checkInputVal = this.checkInput();
    if(checkInputVal != null) {
      this.cmnService.Alert.alert(checkInputVal);
      return null;
    }

    const loader = this.cmnService.getLoader();
    loader.present();

    this.authService.signIn(this.signInfo).then(user => {
      loader.dismiss();

      if (user.emailVerified == false) {
        this.alertSendEmail().then(() => {

          user.sendEmailVerification().then(() => {
            this.cmnService.Toast.present("bottom", "We sent you a email.", "toast-success");
          }).catch(err => {
            this.cmnService.Alert.alert(err);
          }).then(() => {
            this.authService.signOut();
          })

        }).catch(() => {});
      }

    }).catch(err => {
      loader.dismiss();
      this.cmnService.Alert.alert(err);
    });
  }

  moveToSignUp(): void {
    this.navCtrl.push(SignUpPage);
  }

  signOut(): void {
    this.authService.signOut();
  }

  private alertSendEmail(): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create({
        title: 'Alert',
        message: `Didn't get the email? Try checking your spam folder or click send button to resend it.`,
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              reject(false);
            }
          },
          {
            text: 'Send',
            handler: () => {
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

}
