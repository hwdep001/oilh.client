import { Injectable } from '@angular/core';
import { CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase/app'

@Injectable()
export class RegCodeProvider {

  private regCodeCol: CollectionReference;

  constructor(
  ) {
    this.regCodeCol = firebase.firestore().collection("regCodes");
  }

  checkRegCode(id): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.regCodeCol.doc(id).get().then(doc => {

        if(doc.exists) {
          resolve();
        } else {
          reject();
        }

      }).catch(err => reject(err));
    });
  }

}
