import { Component, Input, ViewChild, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';


import { DateType, DateFormat } from '../../model/calendar.model';
import { ISelectedDate } from '../../model/calendar.option';
import { CalendarComponent } from '../calendar/calendar.component';


@Component({
  selector: 'app-calendar-popup',
  templateUrl: './calendar-popup.component.html',
  styleUrls: ['./calendar-popup.component.scss']
})
export class CalendarPopupComponent implements OnInit {
  @Output() DateTimeChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('cal1') private cal1: CalendarComponent;
  @ViewChild('cal2') private cal2: CalendarComponent;
  @ViewChild('card') private card: ElementRef;

  private fromToTitle = 'From Date';
  private selectedFromDate: ISelectedDate;
  private selectedToDate: ISelectedDate;
  isFront = true;
  className = '';
  withTime = false;

  private dateType: DateType = DateType.AD;
  private dateFormatAD: DateFormat = DateFormat.ddMMyyyy;
  private dateFormatBS: DateFormat = DateFormat.yyyyMMdd;

  private minDate = new Date(1913, 3, 13);
  private maxDate = new Date(new Date().getFullYear() + 100, new Date().getMonth(), new Date().getDate());
  private closeOnClick = true;
  private _dateRange = true;
  lang = 0;
  private currentDate = new Date();


  constructor() { }


  @Input()
  get dateRange() {
    return this._dateRange;
  }
  set dateRange(val: boolean) {
    this._dateRange = val;
  }


  showCalendar(dateType: DateType, dateFormatAD: DateFormat,
    dateFormatBS: DateFormat, withTime: boolean, minDate: Date, maxDate: Date,
    closeOnClick: boolean, currentDate: Date, lang: number
  ) {
    this.isFront = true;
    this.dateType = dateType;
    this.dateFormatAD = dateFormatAD;
    this.dateFormatBS = dateFormatBS;
    this.withTime = withTime;
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.closeOnClick = closeOnClick;
    this.currentDate = currentDate ? currentDate : new Date();
    this.lang = lang;
    if (this.lang === 0) {
      this.fromToTitle = 'From Date';
    } else {
      this.fromToTitle = 'देखि';
    }
    this.selectedToDate = null;

    this.cal1.showCalendar(
      this.dateType,
      this.dateFormatAD,
      this.dateFormatBS,
      this.withTime,
      this.minDate,
      this.maxDate,
      this.closeOnClick,
      this.currentDate, this.lang);
    if (this.withTime) {
      if (this.dateRange) {
        this.className = 'container with-range-with-time';
      } else {
        this.className = 'container without-range-with-time';
      }
    } else {
      if (this.dateRange) {
        this.className = 'container with-range';
      } else {
        this.className = 'container without-range';
      }
    }
  }

  ngOnInit() {
  }


  public revert() {
    this.DateTimeChanged.emit(undefined);
  }

  public submit() {
    let result: ISelectedDate[];
    if (this.dateRange === false) {
      result = [this.cal1.selectedDate];
      this.DateTimeChanged.emit(result);
    } else {
      if (this.isFront === true) {
        this.nextPanel();
      } else {
        result = [this.cal1.selectedDate, this.cal2.selectedDate];
        this.DateTimeChanged.emit(result);
      }
    }
  }

  datetimeChangedFrom(e) {
    this.selectedFromDate = {
      date: e.date,
      dateAD: e.dateAD,
      dateBS: e.dateBS,
      selectedDateType: e.selectedDateType
    };

    if (this.dateRange === false) {
      if (this.closeOnClick === true) {
        const result: ISelectedDate[] = [
          this.selectedFromDate
        ];
        this.DateTimeChanged.emit(result);
        return;
      }
    } else {
      if (this.closeOnClick === true) {
        this.nextPanel();
      }
    }
  }
  datetimeChangedTo(e) {
    this.selectedToDate = {
      date: e.date,
      dateAD: e.dateAD,
      dateBS: e.dateBS,
      selectedDateType: e.selectedDateType
    };
    if (this.closeOnClick === true) {
      const result = [this.selectedFromDate, this.selectedToDate];
      this.DateTimeChanged.emit(result);
    }
  }

  private nextPanel() {
    if (this.lang === 0) {
      this.fromToTitle = 'To Date';
    } else {
      this.fromToTitle = 'सम्म';
    }
    if (this.selectedFromDate == null) {
      this.selectedFromDate = this.cal1.selectedDate;
    }

    const minDate = new Date(this.selectedFromDate.date.toDateString());
    this.cal2.showCalendar(
      this.selectedFromDate.selectedDateType,
      this.dateFormatAD,
      this.dateFormatBS,
      this.withTime,
      minDate,
      this.maxDate,
      this.closeOnClick,
      minDate, this.lang);
    this.isFront = !this.isFront;
  }

  private previousPanel() {
    if (this.lang === 0) {
      this.fromToTitle = 'From Date';
    } else {
      this.fromToTitle = 'देखि';
    }
    this.selectedToDate = null;
    this.isFront = !this.isFront;
  }
}
