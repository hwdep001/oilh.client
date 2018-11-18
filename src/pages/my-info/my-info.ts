import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { CommonProvider } from './../../providers/Common';
import { AuthProvider } from './../../providers/Auth';
import { UserProvider } from './../../providers/User';

import { UserInfo } from './../../models/UserInfo';

@Component({
  selector: 'page-my-info',
  templateUrl: 'my-info.html',
})
export class MyInfoPage {

  public userInfo$: Observable<UserInfo>;
  public userInfoSub: Subscription;

  constructor(
    private cmnService: CommonProvider,
    private authService: AuthProvider,
    private userService: UserProvider
  ) {
    
  }

  ionViewDidLoad() { 
    const loader = this.cmnService.getLoader();
    loader.present();

    let docRef = this.userService.getUserDoc(this.authService.uid);
    this.userInfo$ = docRef.valueChanges();
    this.userInfoSub = this.userInfo$.subscribe(() => {
      loader.dismiss();
    });
  }

  ionViewDidLeave() {
    this.userInfoSub.unsubscribe();
  }

  signOut(): void {
    const loader = this.cmnService.getLoader();
    loader.present();

    this.authService.signOut();
    loader.dismiss();
  }
}
