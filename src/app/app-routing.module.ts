import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './shared';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: { roleId: '1.2.3.4.' }
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: { roleId: '1.2.3.4.' }
  },
  {
    path: 'dashboard/:id', component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: { roleId: '1.2.3.4.' }
  },
  {
    path: 'parameter',
    loadChildren: './tools/parameter/parameter.module#ParameterModule'
  },
  {
    path: 'brs',
    loadChildren: './brs/brs.module#BrsModule'
  },
  {
    path: 'core',
    loadChildren: './core/core.module#CoreModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
