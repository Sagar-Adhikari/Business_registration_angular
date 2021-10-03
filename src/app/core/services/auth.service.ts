import { Injectable } from '@angular/core';
import { GlobalService } from '../../shared';

@Injectable()
export class AuthService {
  constructor(private globalService: GlobalService) { }
  public getToken() {
    const jwt: string = localStorage.getItem('ni-token') || '';
    const rjwt: string = localStorage.getItem('ni-refresh-token') || '';
    return { token: jwt, refreshToken: rjwt };
  }

  // public getUser() {
  //   const user: any = JSON.parse(localStorage.getItem('ni-user')) || null;
  //   return user;
  // }

  public setToken(jwt: string, refreshJwt: string, user: any) {
    // tslint:disable-next-line:no-debugger
    // debugger;
    // const userObj = { user: user };
    localStorage.setItem('ni-token', jwt);
    localStorage.setItem('ni-refresh-token', refreshJwt);
    localStorage.setItem('ni-user', JSON.stringify(user));
    this.globalService.changeUser();
  }

  public clear() {
    localStorage.removeItem('ni-token');
    localStorage.removeItem('ni-refresh-token');
    localStorage.removeItem('ni-user');
    // this.globalService.userMenus = null;
    //  localStorage.removeItem('ni-menus');
    this.globalService.changeUser();
  }
}
