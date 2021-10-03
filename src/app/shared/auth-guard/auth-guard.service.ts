import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { GlobalService } from '../global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private globalService: GlobalService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkedLoggedIn(state.url, route.data);
  }

  checkedLoggedIn(url: string, data: any): boolean {
    const user = this.globalService.getCurrentUser();
    if (user) {
      //  debugger;
      const roleId = user.roleId;
      if (url === '/core/login' || url === '/') {
        this.router.navigate(['/dashboard']);
        return false;
      }
      if (data.roleId.indexOf(roleId) >= 0) {
        return true;
      }
      this.globalService.showInfoMessage(`तँपाइलाइ याे URL: [${url}] चलाउने अधिकार दिएकाे छैन।`);
      this.router.navigate(['/dashboard']);
      return false;
    } else {
      this.router.navigate(['/brs/aps-details']);
      return false;
    }
  }
}
