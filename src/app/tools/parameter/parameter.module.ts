import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatInputModule, MatCheckboxModule,
  MatIconModule, MatCardModule, MatButtonModule, MatTreeModule, MatOptionModule,
  MatFormFieldModule, MatTooltipModule, MatMenuModule, MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule,
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SharedModule } from '../../shared/shared.module';
import { ParameterRoutingModule } from './parameter-routing.module';

import { ParamUserTreeComponent } from './param-user/components/param-user-tree/param-user-tree.component';
import { ParamUserSetupComponent } from './param-user/components/param-user-setup/param-user-setup.component';
import { ParamCardComponent } from './param-user/components/param-card/param-card.component';
import { ParamUserDetailsComponent } from './param-user/components/param-user-details/param-user-details.component';
import { ParamUserCreateComponent } from './param-user/components/param-user-create/param-user-create.component';
import { ParamValueComponent } from './param-both/components/param-value/param-value.component';
import { ParamUserValueComponent } from './param-user/components/param-user-value/param-user-value.component';
import { NepaliCalendarModule } from '../nepali-calendar/nepali-calendar.module';

@NgModule({
  declarations: [ParamUserTreeComponent,
    ParamUserSetupComponent,
    ParamCardComponent,
    ParamUserDetailsComponent,
    ParamUserCreateComponent,
    ParamValueComponent,
    ParamUserValueComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NepaliCalendarModule,
    MatInputModule, MatIconModule,
    MatCardModule, MatFormFieldModule,
    MatButtonModule, MatMenuModule, MatCheckboxModule,
    MatTooltipModule, MatTreeModule, MatOptionModule, MatSelectModule, ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    FormsModule,
    FlexLayoutModule,
    ParameterRoutingModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(255, 255, 255, 0.81)',
      backdropBorderRadius: '0px',
      primaryColour: 'Navy',
      secondaryColour: 'Navy',
      tertiaryColour: 'Navy',
      fullScreenBackdrop: true,
    }),
  ],
})
export class ParameterModule { }
