import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
// material
import {
  MatInputModule, MatDialogModule, MatToolbarModule,
  MatIconModule, MatCardModule, MatButtonModule,
  MatGridListModule, MatFormFieldModule, MatTooltipModule, MatSliderModule, MatMenuModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from '../../shared/shared.module';
import { CalendarService } from './services/calendar.service';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DatepickerRangeComponent } from './components/datepicker-range/datepicker-range.component';
import { DateInputComponent } from './components/date-input/date-input.component';
import { DateInputRangeComponent } from './components/date-input-range/date-input-range.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarPopupComponent } from './components/calendar-popup/calendar-popup.component';

@NgModule({
  declarations: [
    DatepickerComponent,
    DatepickerRangeComponent,
    DateInputComponent,
    DateInputRangeComponent,
    CalendarComponent,
    CalendarPopupComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatInputModule, MatDialogModule, MatToolbarModule, MatIconModule,
    MatCardModule, MatGridListModule, MatFormFieldModule,
    MatButtonModule, MatSliderModule, MatMenuModule,
    MatTooltipModule,
    FlexLayoutModule,
    NgxMaskModule.forRoot(),
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    DatepickerComponent,
    DatepickerRangeComponent,
  ],
  providers: [CalendarService],
  exports: [
    DatepickerComponent,
    DatepickerRangeComponent,
    CalendarComponent
  ]
})
export class NepaliCalendarModule { }
