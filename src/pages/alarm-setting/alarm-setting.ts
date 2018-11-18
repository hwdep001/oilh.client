import { Component } from '@angular/core';

import { CommonProvider } from './../../providers/Common';
import { AuthProvider } from './../../providers/Auth';
import { AlarmSettingProvider } from '../../providers/AlarmSetting';

import { AlarmSettingOption } from './../../models/AlarmSettingOption';
import { AlarmSettingOptionMap } from './../../models/AlarmSettingOptionMap';
import { AlarmSettingOptionSelected } from './../../models/AlarmSettingOptionSelected';
import { AlarmSettingInfo } from './../../models/AlarmSettingInfo';

@Component({
  selector: 'page-alarm-setting',
  templateUrl: 'alarm-setting.html',
})
export class AlarmSettingPage {

  public aso: AlarmSettingOption = new AlarmSettingOption();
  private asoMap: AlarmSettingOptionMap;
  public asos: AlarmSettingOptionSelected = new AlarmSettingOptionSelected();
  public asosChanged: boolean = false;

  private as: AlarmSettingInfo = new AlarmSettingInfo();

  constructor(
    private cmnService: CommonProvider,
    private authService: AuthProvider,
    private asService: AlarmSettingProvider
  ) {
  }

  ionViewDidLoad() {
    const loader = this.cmnService.getLoader();
    loader.present();

    this.getAlarmSettingOption().then(() => {
      this.setAlarmSettingOptionMap();
      this.getAlarmSettingInfo().then(() => {
        loader.dismiss();
      }).catch(err => loader.dismiss());
    }).catch(err => loader.dismiss());
  }

  getAlarmSettingOption(): Promise<void> {
    return this.asService.getAlarmSettingOption().then(aso => {
      this.aso = aso;
    }).catch(err => {
      console.log(err);
      alert("Failed to query alarm option!");
    });
  }

  setAlarmSettingOptionMap(): void {
    let asoMap = new AlarmSettingOptionMap();
    this.aso.detailCodeList.forEach(kv => {
      asoMap.detailCodeMap.set(kv.key, kv);
    });
    this.aso.locationList.forEach(kv => {
      asoMap.locationMap.set(kv.key, kv);
    });
    this.aso.workTypeList.forEach(kv => {
      asoMap.workTypeMap.set(kv.key, kv);
    });
    this.aso.careerList.forEach(kv => {
      asoMap.careerMap.set(kv.key, kv);
    });
    this.aso.replacementList.forEach(kv => {
      asoMap.replacementMap.set(kv.key, kv);
    });
    this.aso.orgNameList.forEach(kv => {
      asoMap.orgNameMap.set(kv.key, kv);
    });
    this.asoMap = asoMap;
  }

  getAlarmSettingInfo(): Promise<void> {
    let asDocRef = this.asService.getAlarmSettingDocRef(this.authService.uid);
    return asDocRef.get().then(doc => {
      if (doc.exists) {
        this.as = doc.data() as AlarmSettingInfo;
        this.as2Asos();
      } else {
        if (this.aso.replacementList.length > 0) {
          this.asos.replacement = this.aso.replacementList[0].key;
        }
        if (this.aso.orgNameList.length > 0) {
          this.asos.orgName = this.aso.orgNameList[0].key;
        }
      }
    }).catch(err => {
      console.log(err);
      alert("Failed to query alarm setting!");
    });
  }

  changeAsos(): void {
    this.asosChanged = true;
  }

  save(): void {
    const loader = this.cmnService.getLoader();
    loader.present();

    this.asos2As();
    this.as.uid = this.authService.uid;

    this.asService.setAlarmSetting(this.as).then(() => {
      this.asosChanged = false;
      loader.dismiss();
      this.cmnService.Toast.present("bottom", "Setting saved.", "toast-success");
    }).catch(err => {
      loader.dismiss();
      console.log(err);
      alert("Failed to save alarm setting!");
    })
  }

  asos2As() {
    let as_ = new AlarmSettingInfo();

    as_.isAlarm = this.asos.isAlarm;
    this.asos.detailCodeList.forEach(key => {
      as_.detailCodeList.push(this.asoMap.detailCodeMap.get(key));
    });
    this.asos.locationList.forEach(key => {
      as_.locationList.push(this.asoMap.locationMap.get(key));
    });
    this.asos.workTypeList.forEach(key => {
      as_.workTypeList.push(this.asoMap.workTypeMap.get(key));
    });
    this.asos.careerList.forEach(key => {
      as_.careerList.push(this.asoMap.careerMap.get(key));
    });
    const replacementKv = this.asoMap.replacementMap.get(this.asos.replacement);
    as_.replacement = replacementKv;
    const orgNameKv = this.asoMap.orgNameMap.get(this.asos.orgName);
    as_.orgName = orgNameKv;

    this.as = as_;
  }

  as2Asos() {
    let asos_ = new AlarmSettingOptionSelected();

    asos_.isAlarm = this.as.isAlarm;
    let tempArr = [];
    this.as.detailCodeList.forEach(kv => {
      tempArr.push(kv.key);
    });
    asos_.detailCodeList = tempArr;

    tempArr = [];
    this.as.locationList.forEach(kv => {
      tempArr.push(kv.key);
    });
    asos_.locationList = tempArr;

    tempArr = [];
    this.as.workTypeList.forEach(kv => {
      tempArr.push(kv.key);
    });
    asos_.workTypeList = tempArr;

    tempArr = [];
    this.as.careerList.forEach(kv => {
      tempArr.push(kv.key);
    });
    asos_.careerList = tempArr;

    asos_.replacement = this.as.replacement.key;
    asos_.orgName = this.as.orgName.key;

    this.asos = asos_;
  }



}
