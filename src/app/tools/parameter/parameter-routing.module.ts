import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParamUserSetupComponent } from './param-user/components/param-user-setup/param-user-setup.component';
import { ParamUserValueComponent } from './param-user/components/param-user-value/param-user-value.component';
import { AuthGuardService } from 'src/app/shared';


const routes: Routes = [
    {
        path: 'param-setup',
        component: ParamUserSetupComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.' } // only super admin
    },
    {
        path: 'param-value',
        component: ParamUserValueComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.4.' } // only super admin and admin
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParameterRoutingModule { }
