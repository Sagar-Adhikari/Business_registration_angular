import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../shared';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AboutComponent } from './about/about.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardService],
    data: { roleId: '1.2.3.4.5.' }
  },
  {
    path: 'user-list',
    component: UserListComponent,
    canActivate: [AuthGuardService],
    data: { roleId: '1.4.' }
  },
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
