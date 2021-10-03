import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NepaliCalendarModule } from './tools/nepali-calendar/nepali-calendar.module';
import { NgxPrintModule } from 'ngx-print';
import { NgxElectronModule } from 'ngx-electron';

import { } from 'leaflet/';

import {
  MatCheckboxModule, MatInputModule, MatSelectModule, MatFormFieldModule,
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule,
  MatSortModule, MatButtonToggleModule, MatRadioModule, MatTooltipModule, MatDividerModule

} from '@angular/material';


import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { GraphQLModule } from './graphql/graphql.module';
import { BrsModule } from './brs/brs.module';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
  ],
  imports: [
    NgxElectronModule,
    NgxPrintModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    SharedModule,
    NepaliCalendarModule,
    CoreModule,
    BrsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    FlexLayoutModule,
    FormsModule,
    MatCheckboxModule, MatInputModule, MatSelectModule, MatFormFieldModule,
    MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
    MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonToggleModule, MatRadioModule, MatTooltipModule, MatDividerModule,
    // GoogleChartsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.threeBounce,
      backdropBackgroundColour: 'rgba(255, 255, 255, 0.81)',
      backdropBorderRadius: '0px',
      primaryColour: 'Navy',
      secondaryColour: 'Navy',
      tertiaryColour: 'Navy',
      fullScreenBackdrop: true,
    }),
    LeafletModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
