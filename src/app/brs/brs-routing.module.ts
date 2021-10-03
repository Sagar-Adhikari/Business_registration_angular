import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RateSetupComponent } from './components/rate/rate-setup/rate-setup.component';
// import { BusinessRegisterComponent } from './components/business/business-register/business-register.component';
import { PrintTestComponent } from './components/business/print-test/print-test.component';
import { RegisterMainComponent } from './components/business/register-main/register-main.component';
import { AuthGuardService } from '../shared';
import { ApsMainComponent } from './components/aps/aps-main/aps-main.component';
import { ApsComponent } from './components/aps/aps/aps.component';
import { OfficeLocationComponent } from './components/business/office-location/office-location.component';
import { MemberLocationComponent } from './components/business/member-location/member-location.component';
import { SendSmsComponent } from './components/business/send-sms/send-sms.component';
import { SmsListComponent } from './components/business/sms-list/sms-list.component';
import { RigisterListFullComponent } from './components/business/rigister-list-full/rigister-list-full.component';
const routes: Routes = [
    {
        path: 'annex-setup',
        component: RateSetupComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.4.' }
    },
    {
        path: 'list-business', component: RegisterMainComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.3.4.' }
    },
    {
        path: 'list-business/:id', component: RegisterMainComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.3.4.' }
    },
    {
        path: 'list-ape',
        component: ApsMainComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.3.4.5.' }
    },
    // {
    //     path: 'list-ape/:id',
    //     component: ApsMainComponent,
    //     canActivate: [AuthGuardService],
    //     data: { roleId: '1.2.3' }
    // },
    {
        path: 'aps-details',
        component: ApsComponent,
        //     canActivate: [AuthGuardService],
        //  data: { roleId: '1.2.3' }
    },
    {
        path: 'office-location',
        component: OfficeLocationComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.4.' }
    },
    {
        path: 'business-location',
        component: MemberLocationComponent,
        // canActivate: [AuthGuardService],
        // data: { roleId: '1.2.4' }
    },
    {
        path: 'send-sms',
        component: SendSmsComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.4.' }
    },
    {
        path: 'sms-list',
        component: SmsListComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.4.' }
    },
    {
        path: 'all-business',
        component: RigisterListFullComponent,
        canActivate: [AuthGuardService],
        data: { roleId: '1.2.4.' }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BrsRoutingModule { }
