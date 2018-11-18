import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';

import { CommonProvider } from './../providers/Common';
import { FcmProvider } from '../providers/Fcm';
import { UserProvider } from './../providers/User';

import { PageInterface } from './../models/page/PageInterface';
import { SignInPage } from './../pages/sign-in/sign-in';
import { RecruitListPage } from './../pages/recruit-list/recruit-list';
import { AlarmSettingPage } from './../pages/alarm-setting/alarm-setting';
import { MyInfoPage } from './../pages/my-info/my-info';

import { User } from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private lastBack: any;  // for backbutton

  public rootPage: any = null;
  public isSignedIn: boolean = false;
  public pages: Array<{title: string, component: any}>;

  public alioPages: PageInterface[];
  public settingPages: PageInterface[];

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,

    private app: App,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    
    private afAuth: AngularFireAuth,
    private cmnService: CommonProvider,
    private fcmService: FcmProvider,
    private userService: UserProvider
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged(user => {
      this.initializePage(user);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("#323435");
      this.platform.registerBackButtonAction(() => this.exitApp());

      // Listen to incoming messages - foreground
      if(!this.platform.is('core')) {
        this.fcmService.listenToNotifications().pipe(
          tap(msg => {
            this.cmnService.Toast.present("top", msg.body, "toast-success");
          })
        )
        .subscribe();
      }
    });
  }

  initializePage(user: User): void {

    if(user != null && user.emailVerified) {

      // 새로 고침 마다 토큰, lastDate 업데이트
      this.userService.updateLastDateUser(user.uid);
      this.fcmService.getToken(user);
      
      // 페이지 설정
      this.isSignedIn = true;
      
      const recruitListPage: PageInterface = {
        title: 'List', 
        name: 'recruitListPage', 
        component: RecruitListPage, 
        param: {activeName: "recruitListPage"}, icon: 'list'
      };
      const alarmSettingPage: PageInterface = {
        title: 'Alarm', 
        name: 'alarmSettingPage', 
        component: AlarmSettingPage, 
        param: {activeName: "alarmSettingPage"}, icon: 'notifications'
      };
      const myInfoPage: PageInterface = {
        title: 'My Info', 
        name: 'myInfoPage', 
        component: MyInfoPage, 
        param: {activeName: "myInfoPage"}, icon: 'person'
      };

      this.alioPages = [];
      this.alioPages.push(recruitListPage);

      this.settingPages = [];
      this.settingPages.push(alarmSettingPage);
      this.settingPages.push(myInfoPage);

      this.splashScreen.hide();
      this.nav.setRoot(RecruitListPage);

    } else {
      this.isSignedIn = false;

      this.splashScreen.hide();
      this.nav.setRoot(SignInPage);
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component, page.param);
  }

  isActive(page: PageInterface) {
    if (this.nav.getActive()) {
      if(this.nav.getActive().name === page.name) {
        return 'primary';
      } else if(this.nav.getActive().getNavParams().get("activeName") == page.name) {
        return 'primary';
      }
    }
    return;
  }

  private exitApp() {
    
    const overlay = this.app._appRoot._overlayPortal.getActive();
    const nav = this.app.getActiveNavs()[0];

    if(this.menuCtrl.isOpen()) {
      this.menuCtrl.close();
    } else if(overlay && overlay.dismiss) {
      overlay.dismiss();
    } else if(nav.canGoBack()){
      nav.pop();
    } else if(Date.now() - this.lastBack < 500) {
      this.showConfirmAlert("EXIT?", () => {
        this.platform.exitApp();
      });
    }
    this.lastBack = Date.now();
  }

  showConfirmAlert(message: string, yesHandler) {
    let confirm = this.alertCtrl.create({
      message: message,
      buttons: [
        { text: 'No' },
        {
          text: 'Yes',
          handler: () => {
            yesHandler();
          }
        }
      ]
    });
    confirm.present();
  }
}
