import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from 'firebase';

@Injectable()
export class FcmProvider {

  constructor(
    private platform: Platform,
    private firebaseNative: Firebase,
    private afs: AngularFirestore
  ) {}

  // Get permission from the user
  async getToken(user: User) {

    if(this.platform.is('core')) {
      return;
    }

    let token;
  
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    } 
  
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    } 
    
    return this.saveTokenToFirestore(user, token)
  }

  // Save the token to firestore
  private saveTokenToFirestore(user: User, token) {
    if (!token) return;
  
    const devicesRef = this.afs.collection('devices')
  
    const docData = { 
      token,
      uid: user.uid,
      email: user.email
    }
  
    return devicesRef.doc(token).set(docData);
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
