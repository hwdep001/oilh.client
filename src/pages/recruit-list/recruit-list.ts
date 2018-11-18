import { AlarmSettingInfo } from './../../models/AlarmSettingInfo';
import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

import { environment } from './../../environments/environment';
import { CommonProvider } from './../../providers/Common';
import { AuthProvider } from './../../providers/Auth';
import { RecruitProvider } from './../../providers/Recruit';
import { AlarmSettingProvider } from './../../providers/AlarmSetting';

import { RecruitSummary } from './../../models/RecruitSummary';
import { RecruitSearchOption } from './../../models/RecruitSearchOption';

@Component({
  selector: 'page-recruit-list',
  templateUrl: 'recruit-list.html',
})
export class RecruitListPage {

  private recruitDetailUrl: string;

  public rsArr: Array<RecruitSummary> = new Array<RecruitSummary>();
  public isInfinitable = true;

  private rso: RecruitSearchOption;
  public pageNo: number = 1;
  public ingKey: string = '';

  constructor(
    private inAppBrowser: InAppBrowser,
    private alertCtrl: AlertController,
    private cmnService: CommonProvider,
    private authService: AuthProvider,
    private recruitService: RecruitProvider,
    private asService: AlarmSettingProvider
  ) {
  }

  ionViewDidLoad() {
    const loader = this.cmnService.getLoader();
    loader.present();

    this.recruitDetailUrl = environment.alioDetailUrl;

    this.getAlarmSetting().then(alarmSetting => {
      this.rso = this.asToRso(alarmSetting);

      this.getRecruitSummary().then(arr => {
        this.pageNo++;
        this.rsArr = arr;
        loader.dismiss();

      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  getAlarmSetting(): Promise<AlarmSettingInfo> {
    return new Promise<AlarmSettingInfo>((resolve, reject) => {

      let asDocRef = this.asService.getAlarmSettingDocRef(this.authService.uid);
      return asDocRef.get().then(doc => {
        if (doc.exists) {
          resolve(doc.data() as AlarmSettingInfo);
        } else {
          resolve(new AlarmSettingInfo());
        }
      }).catch(err => {
        console.log(err);
        alert(JSON.stringify(err));
        reject(err);
      });
    });
  }

  getRecruitSummary(): Promise<Array<RecruitSummary>> {
    return new Promise<Array<RecruitSummary>>((resolve, reject) => {

      this.rso.ing = this.ingKey;
      this.rso.pageNo = this.pageNo;
      return this.recruitService.getRecruitSummary(this.rso)
      .then(data => {
        resolve(data as Array<RecruitSummary>);

      }).catch(err => {
        reject(err);
        console.log(err);
        alert(JSON.stringify(err));
      });
    });
  }

  asToRso(as: AlarmSettingInfo): RecruitSearchOption {
    let rso = new RecruitSearchOption();

    rso.pageNo = this.pageNo;
    as.detailCodeList.forEach(kv => {
      rso.detailCode.push(kv.key);
    });
    as.careerList.forEach(kv => {
      rso.career.push(kv.key);
    });
    as.locationList.forEach(kv => {
      rso.location.push(kv.key);
    });
    rso.orgName = as.orgName.key;
    rso.replacement = as.replacement.key;
    as.workTypeList.forEach(kv => {
      rso.workType.push(kv.key);
    });

    return rso;
  }

  getICardBoardClass(rs: RecruitSummary): string {
    if(rs.ing == "진행중") {
      return "icard-border-y";
    } else if(rs.ing == "마감") {
      return "icard-border-n";
    } else {
      return "icard-border";
    }
  }

  settingIng(): void {
    this.settingingAlert(null, "채용 상태", this.ingKey).then(data => {
      const loader = this.cmnService.getLoader();
      loader.present();

      this.ingKey = data;
      this.pageNo = 1;

      this.getRecruitSummary().then(arr => {
        this.pageNo++;
        this.isInfinitable = true;
        this.rsArr = arr;
        loader.dismiss();
        
      }).catch(err => {
        loader.dismiss();
        console.log(err);
        alert(JSON.stringify(err));
      });
    });
  }

  doRefresh(refresher) {
    this.pageNo = 1;

    this.getRecruitSummary().then(arr => {
      this.pageNo++;
      this.isInfinitable = true;
      this.rsArr = arr;
      refresher.complete();

    }).catch(err => {
      refresher.complete();
      console.log(err);
      alert(JSON.stringify(err));
    });
  }

  doInfinite(infiniteScroll) {
    this.getRecruitSummary().then(arr => {

      if(arr.length < 1) {
        this.isInfinitable = false;
      } else {
        this.rsArr = this.rsArr.concat(arr);
        this.pageNo++;
      }

      infiniteScroll.complete();

    }).catch(err => {
      infiniteScroll.complete();
      console.log(err);
      alert(JSON.stringify(err));
    });
  }

  openAlio() {
    const option: InAppBrowserOptions = {
      location : 'yes',
      clearcache : 'yes',
      clearsessioncache : 'yes',
      hardwareback : 'yes'
    }

    this.inAppBrowser.create(environment.alioUrl, '_system', option);
  }

  openAlioDetail(idx: string) {

    const url = `${this.recruitDetailUrl}?idx=${idx}`;
    const option: InAppBrowserOptions = {
      location : 'yes',
      clearcache : 'yes',
      clearsessioncache : 'yes',
      hardwareback : 'yes'
    }

    this.inAppBrowser.create(url, '_system', option);
  }

  private settingingAlert(message: string, title: string, defaultValue: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      let radio = this.alertCtrl.create({
        title: title,
        message: message,
        inputs: [
          {
            type: 'radio',
            label: '전체',
            value: '',
            checked: (defaultValue == '' ? true : false)
          },
          {
            type: 'radio',
            label: '진행중',
            value: '2',
            checked: (defaultValue == '2' ? true : false)
          },
          {
            type: 'radio',
            label: '마감',
            value: '3',
            checked: (defaultValue == '3' ? true : false)
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              reject();
            }
          },
          {
            text: 'Search',
            handler: data => {
              resolve(data);
            }
          }
        ]
      });
      radio.present();
    });
  }
}
