import { NgModule } from '@angular/core';
import { SubscriptionService } from './services/subscription.service';
import { LoginComponent } from './login/login.component';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { NepaliCalendarModule } from '../tools/nepali-calendar/nepali-calendar.module';

import {
    MatCheckboxModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatSnackBarModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonToggleModule, MatRadioModule, MatTooltipModule, MatTreeModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { AboutComponent } from './about/about.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthService } from './services/auth.service';
@NgModule({
    imports: [
        CommonModule,
        CoreRoutingModule,
        NepaliCalendarModule,
        MatCheckboxModule, MatInputModule, MatSelectModule, MatFormFieldModule,
        MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
        MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule,
        MatSortModule, MatButtonToggleModule, MatRadioModule, MatTooltipModule, MatTreeModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        NgxLoadingModule.forRoot({
            animationType: ngxLoadingAnimationTypes.threeBounce,
            backdropBackgroundColour: 'rgba(0,0,0,0.1)',
            backdropBorderRadius: '0px',
            primaryColour: 'Navy',
            secondaryColour: 'Navy',
            tertiaryColour: 'Navy',
            fullScreenBackdrop: true,
        }),
    ],
    providers: [
        AuthService,
        SubscriptionService,
        ],
    declarations: [
        LoginComponent,
        ChangePasswordComponent,
        AboutComponent,
        CreateUserComponent,
        UserListComponent,
        EditUserComponent],
    exports: [
    ]

})
export class CoreModule { }
