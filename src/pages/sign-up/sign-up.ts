import { Component } from '@angular/core';

import { CommonProvider } from '../../providers/Common';
import { AuthProvider } from './../../providers/Auth';

import { SignInfo } from './../../models/SignInfo';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  public signInfo = new SignInfo();

  constructor(
    private cmnService: CommonProvider,
    private authService: AuthProvider
  ) {
  }

  private checkInput(): string {
    let result: string = null;

    const name = this.signInfo.name;
    const pw = this.signInfo.pw;
    const pwCf = this.signInfo.pwCf;

    if (name == null || name.trim() == '') {
      return 'The name is badly formatted.';
    }

    if (pw != pwCf) {
      return 'New password and Confirm password do not match.';
    }

    return result;
  }

  signUp(): void {

    const checkInputVal = this.checkInput();
    if(checkInputVal != null) {
      this.cmnService.Alert.alert(checkInputVal);
      return null;
    }

    const loader = this.cmnService.getLoader();
    loader.present();

    this.authService.signUp(this.signInfo).then(user => {
      loader.dismiss();

      const alertTitle = 'THANKS FOR SIGNING UP';
      const alertMsg = `Check your email(${user.email}) to complete registration.`;
      this.cmnService.Alert.alert(alertMsg, alertTitle);
      this.authService.signOut();

    }).catch(err => {
      loader.dismiss();
      this.cmnService.Alert.alert(err);
    });
  }

}
