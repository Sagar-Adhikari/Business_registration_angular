import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateCardComponent } from './components/rate/rate-card/rate-card.component';
import { RateTreeComponent } from './components/rate/rate-tree/rate-tree.component';
import { RateCreateComponent } from './components/rate/rate-create/rate-create.component';
import { RateSetupComponent } from './components/rate/rate-setup/rate-setup.component';
import { RateDetailsComponent } from './components/rate/rate-details/rate-details.component';
import { NgxPrintModule } from 'ngx-print';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { QuillModule } from 'ngx-quill';

import {
  MatInputModule, MatCheckboxModule,
  MatIconModule, MatCardModule, MatButtonModule, MatTreeModule, MatOptionModule,
  MatFormFieldModule, MatTooltipModule, MatMenuModule, MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule,
  MatDividerModule, MatStepperModule, MatExpansionModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SharedModule } from '../shared/shared.module';
import { BrsRoutingModule } from './brs-routing.module';

import { NepaliCalendarModule } from '../tools/nepali-calendar/nepali-calendar.module';
import { AddressComponent } from './components/business/address/address.component';
import { PrintTestComponent } from './components/business/print-test/print-test.component';
import { RegisterMainComponent } from './components/business/register-main/register-main.component';
import { RegisterListComponent } from './components/business/register-list/register-list.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { ChartsModule } from 'ng2-charts';
import { ProductWiseCountComponent } from './components/business/graph/product-wise-count/product-wise-count.component';
import { PendingDisplayComponent } from './components/business/pending-display/pending-display.component';
import { FiscalYearWiseCountComponent } from './components/business/graph/fiscal-year-wise-count/fiscal-year-wise-count.component';
import { FiscalYearWiseRevenueComponent } from './components/business/graph/fiscal-year-wise-revenue/fiscal-year-wise-revenue.component';
import { MonthWiseCountComponent } from './components/business/graph/month-wise-count/month-wise-count.component';
import { MonthWiseRevenueComponent } from './components/business/graph/month-wise-revenue/month-wise-revenue.component';
import { CompareFiscalYearComponent } from './components/business/graph/compare-fiscal-year/compare-fiscal-year.component';

import { NgxElectronModule } from 'ngx-electron';
import { RegisterComponent } from './components/register/register.component';
import { ApsMainComponent } from './components/aps/aps-main/aps-main.component';
import { ApsListComponent } from './components/aps/aps-list/aps-list.component';
import { ApsRegisterComponent } from './components/aps/aps-register/aps-register.component';
import { ApsComponent } from './components/aps/aps/aps.component';
import { OfficeLocationComponent } from './components/business/office-location/office-location.component';
import { MemberLocationComponent } from './components/business/member-location/member-location.component';
import { NormalFormatComponent } from './components/business/normal-format/normal-format.component';
import { CertificateWithTitleComponent } from './components/business/certificate-with-title/certificate-with-title.component';
import { CertificateWithoutTitleComponent } from './components/business/certificate-without-title/certificate-without-title.component';
import { CertificateComponent } from './components/business/certificate/certificate.component';
import { IdentityCardComponent } from './components/business/identity-card/identity-card.component';
import { SendSmsComponent } from './components/business/send-sms/send-sms.component';
import { SmsListComponent } from './components/business/sms-list/sms-list.component';
import { RigisterListFullComponent } from './components/business/rigister-list-full/rigister-list-full.component';
@NgModule({
  declarations: [RateCardComponent,
    RateTreeComponent,
    RateCreateComponent,
    RateSetupComponent,
    RateDetailsComponent,
    AddressComponent,
    PrintTestComponent,
    RegisterMainComponent,
    RegisterListComponent,
    ProductWiseCountComponent,
    PendingDisplayComponent,
    FiscalYearWiseCountComponent,
    FiscalYearWiseRevenueComponent,
    MonthWiseCountComponent,
    MonthWiseRevenueComponent,
    CompareFiscalYearComponent,
    RegisterComponent,
    ApsMainComponent,
    ApsListComponent,
    ApsRegisterComponent,
    ApsComponent,
    OfficeLocationComponent,
    MemberLocationComponent,
    NormalFormatComponent,
    CertificateWithTitleComponent,
    CertificateWithoutTitleComponent,
    CertificateComponent,
    IdentityCardComponent,
    SendSmsComponent,
    SmsListComponent,
    RigisterListFullComponent,
  ],
  imports: [
    NgxPrintModule,
    CommonModule,
    SharedModule,
    NepaliCalendarModule,
    MatInputModule, MatIconModule,
    MatCardModule, MatFormFieldModule,
    MatButtonModule, MatMenuModule, MatCheckboxModule,
    MatTooltipModule, MatTreeModule, MatOptionModule, MatSelectModule, ReactiveFormsModule,
    MatTableModule, MatSortModule, MatPaginatorModule, MatDividerModule,
    MatStepperModule, MatExpansionModule,
    FormsModule,
    FlexLayoutModule,
    BrsRoutingModule,
    GoogleChartsModule,
    ChartsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(255, 255, 255, 0.81)',
      backdropBorderRadius: '0px',
      primaryColour: 'Navy',
      secondaryColour: 'Navy',
      tertiaryColour: 'Navy',
      fullScreenBackdrop: true,
    }),
    NgxElectronModule,
    LeafletModule,
    QuillModule,
    QuillModule.forRoot()
  ],
  exports: [
    ProductWiseCountComponent,
    PendingDisplayComponent,
    FiscalYearWiseCountComponent,
    FiscalYearWiseRevenueComponent,
    MonthWiseCountComponent,
    MonthWiseRevenueComponent,
    CompareFiscalYearComponent
    ]
})
export class BrsModule { }
