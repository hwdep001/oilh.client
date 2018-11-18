import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthProvider } from './Auth';
import { environment } from '../environments/environment';

import { RecruitSummary } from './../models/RecruitSummary';
import { RecruitSearchOption } from './../models/RecruitSearchOption';

@Injectable()
export class RecruitProvider {
  
  private apiUrl: String;

  constructor(
    private http: HttpClient,
    private authService: AuthProvider
  ) {
    this.apiUrl = environment.apiUrl;
  }

  getRecruitSummary(rso: RecruitSearchOption): Promise<Array<RecruitSummary>> {
    return this.authService.getIdToken().then(idToken => {

      return new Promise<Array<RecruitSummary>>((resolve, reject) => {
  
        this.http.post(`${this.apiUrl}/recruit/summary`, rso, {
          headers: new HttpHeaders().set('Authorization', idToken)
        }).subscribe(data => {
          resolve(data as Array<RecruitSummary>);
        }, error => {
          reject(error);
        });
      });
    });
  }

}
