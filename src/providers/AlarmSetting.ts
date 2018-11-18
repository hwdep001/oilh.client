import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CollectionReference, DocumentReference } from '@angular/fire/firestore';
import firebase from 'firebase/app'

import { environment } from './../environments/environment';
import { AuthProvider } from './Auth';

import { AlarmSettingInfo } from './../models/AlarmSettingInfo';
import { AlarmSettingOption } from './../models/AlarmSettingOption';

@Injectable()
export class AlarmSettingProvider {

  private apiUrl: String;
  private asCol: CollectionReference;

  constructor(
    private http: HttpClient,
    private authService: AuthProvider
  ) {
    this.apiUrl = environment.apiUrl;
    this.asCol = firebase.firestore().collection("alarmSettings");
  }

  getAlarmSettingOption(): Promise<AlarmSettingOption> {
    return this.authService.getIdToken().then(idToken => {

      return new Promise<AlarmSettingOption>((resolve, reject) => {
  
        this.http.post(`${this.apiUrl}/alarm_setting/option`, null, {
          headers: new HttpHeaders().set('Authorization', idToken)
        }).subscribe(data => {
          resolve(data as AlarmSettingOption);
        }, error => {
          reject(error);
        });
      });
    });
  }

  getAlarmSettingDocRef(uid: string): DocumentReference {
    return this.asCol.doc(uid);
  }

  setAlarmSetting(as: AlarmSettingInfo): Promise<void> {
    return this.asCol.doc(as.uid).set(Object.assign({}, as));
  }

}
