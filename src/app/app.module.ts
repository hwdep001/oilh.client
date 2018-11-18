import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule} from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RecruitProvider } from './../providers/Recruit';
import { environment } from './../environments/environment';

import { CommonProvider } from './../providers/Common';
import { FcmProvider } from './../providers/Fcm';
import { AuthProvider } from './../providers/Auth';
import { UserProvider } from './../providers/User';
import { RegCodeProvider } from './../providers/RegCode';
import { AlarmSettingProvider } from './../providers/AlarmSetting';

import { MyApp } from './app.component';
import { SignInPage } from './../pages/sign-in/sign-in';
import { SignUpPage } from './../pages/sign-up/sign-up';
import { RecruitListPage } from './../pages/recruit-list/recruit-list';
import { AlarmSettingPage } from './../pages/alarm-setting/alarm-setting';
import { MyInfoPage } from './../pages/my-info/my-info';

@NgModule({
  declarations: [
    MyApp,
    SignInPage,
    SignUpPage,
    RecruitListPage,
    AlarmSettingPage,
    MyInfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { tabsPlacement: 'top', scrollAssist: false, autoFocusAssist: false } ),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignInPage,
    SignUpPage,
    RecruitListPage,
    AlarmSettingPage,
    MyInfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CommonProvider,
    FcmProvider,
    AuthProvider,
    UserProvider,
    RegCodeProvider,
    RecruitProvider,
    AlarmSettingProvider
  ]
})
export class AppModule {}
