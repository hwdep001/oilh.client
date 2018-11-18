import { Injectable } from '@angular/core';
import { ToastOptions, Loading, ToastController, AlertController, LoadingController } from 'ionic-angular';

@Injectable()
export class CommonProvider {

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    
  }

  public getLoader(): Loading;
  public getLoader(content: string): Loading;
  public getLoader(content: string, duration: number): Loading;
  public getLoader(content: string, duration: number, dismissOnPageChange: boolean): Loading;

  /**
   * 
   * @param content default 'Loading...'
   * @param duration default 20000 ms
   * @param dismissOnPageChange default false
   */
  public getLoader(content?: string, duration?: number, dismissOnPageChange?: boolean): Loading {
    content = content ? content : "Loading...";
    duration = duration ? duration : 20000;
    dismissOnPageChange = dismissOnPageChange == true ? true : false;
    
    return this.loadingCtrl.create({
      spinner: "bubbles",
      content: content,
      duration: duration,
      dismissOnPageChange: dismissOnPageChange
    });
  }

  public Alert = {
    confirm: (msg?, title?) => {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: title || 'Confirm',
          message: msg || 'Do you want continue?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                reject(false);
              }
            },
            {
              text: 'Ok',
              handler: () => {
                resolve(true);
              }
            }
          ]
        });
        alert.present();
      });
    },
    alert: (msg, title?) => {
      let alert = this.alertCtrl.create({
        title: title || 'Alert',
        subTitle: msg,
        buttons: ['Close']
      });
      alert.present();
    }
  }

  public Toast = {
    present: (
      position: string, 
      message: string, 
      cssClass: string, 
      duration?: number) => {

      let options: ToastOptions = {
        message: message,
        position: position,
        duration: (duration == null) ? 3000 : duration
      }
      if(cssClass != null) {
        options.cssClass = cssClass;
      }

      this.toastCtrl.create(options).present();
    }
  }

}
