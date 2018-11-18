import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

import { UserInfo } from './../models/UserInfo';

@Injectable()
export class UserProvider {

  private usersCol: AngularFirestoreCollection;

  constructor(
    private afStore: AngularFirestore
  ) {
    this.usersCol = this.afStore.collection("users");
  }

  setUser(userInfo: UserInfo): Promise<void> {
    return this.usersCol.doc(userInfo.uid)
      .set(Object.assign({}, userInfo));
  }

  updateUser(userInfo: UserInfo): Promise<void> {
    return this.usersCol.doc(userInfo.uid)
      .update(Object.assign({}, userInfo));
  }

  updateLastDateUser(uid: string): Promise<void> {
    return this.usersCol.doc(uid)
      .update({lastDate: new Date()});
  }

  getUserDoc(uid: string): AngularFirestoreDocument<UserInfo> {    
    return this.usersCol.doc<UserInfo>(uid);
  }

}
