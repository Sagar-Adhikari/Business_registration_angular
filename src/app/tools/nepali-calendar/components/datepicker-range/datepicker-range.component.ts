import {
  Component, ElementRef, Input,
  OnDestroy, forwardRef, OnChanges,
  SimpleChange, Output, EventEmitter, ViewChild, AfterViewInit
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  Validator, FormControl, NG_VALIDATORS
} from '@angular/forms';
import * as language from '../../language';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatMenuTrigger } from '@angular/material';

import { DateFormat, DateType } from '../../model/calendar.model';
import { ITimeFormat } from '../../model/calendar.model';
import { ISelectedDate, IDatePickerOption } from '../../model/calendar.option';
import { CalendarService } from '../../services/calendar.service';
import { DateInputRangeComponent } from '../date-input-range/date-input-range.component';
import { CalendarPopupComponent } from '../calendar-popup/calendar-popup.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'datepicker-range',
  templateUrl: 'datepicker-range.component.html',
  styleUrls: ['datepicker-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerRangeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerRangeComponent),
      multi: true,
    }]
})

export class DatepickerRangeComponent implements Validator, OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('dateinput') private dateinput: DateInputRangeComponent;
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  @ViewChild('calPopUp') private calPopUp: CalendarPopupComponent;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDateChanged = new EventEmitter<any>();

  private clearTooltip = '';
  private isPickerVisible = false; errorMessage = '';
  private currentDate: any;
  private currentTime: any;

  private _dateType: DateType = DateType.AD;
  private _placeHolder = 'Date';
  private _closeOnClick = true;
  private _required = true;
  private _disabled = false;
  private _minimumDate: Date = new Date(1913, 3, 13);
  private _maximumDate = new Date(new Date().getFullYear() + 100, new Date().getMonth(), new Date().getDate());
  private _language = 0;
  private _dateFormatAD: DateFormat = DateFormat.ddMMyyyy;
  private _dateFormatBS: DateFormat = DateFormat.yyyyMMdd;
  private _withTime = false;
  private _showCalendarOnFocus = false;
  private _afterButtonClick = false;
  private _showHint = false;

  private _dateBS = undefined; // '2031-12-23   09:32 / 2031-12-23   09:32';
  private _dateAD = undefined; // '03-17-2018   09:32 / 2031-12-23   09:32';
  private _fromDate: ISelectedDate;
  private _toDate: ISelectedDate;
  private isValid = true;

  caption: any;
  changeDateTooltip = ''; // this.caption.switchToBS[this.lang];
  showCalendarTooltip = '';
  myValue = '';
  errorState = false;
  dateFormat: DateFormat = DateFormat.MMddyyyy;
  stateChanges = new Subject<void>();
  dateRange = true;


  @Input() set showCalendarOnFocus(val: boolean) {
    this._showCalendarOnFocus = coerceBooleanProperty(val);
  } get showCalendarOnFocus(): boolean {
    return this._showCalendarOnFocus;
  }

  @Input() set showHint(val: boolean) {
    this._showHint = coerceBooleanProperty(val);
  } get showHint(): boolean {
    return this._showHint;
  }


  @Input() set closeOnClick(val: boolean) {
    this._closeOnClick = coerceBooleanProperty(val);
  } get closeOnClick(): boolean {
    return this._closeOnClick;
  }

  @Input() set placeHolder(val: string) {
    this._placeHolder = val;
  } get placeHolder(): string {
    return this._placeHolder;
  }

  @Input() set withTime(val: boolean) {
    this._withTime = coerceBooleanProperty(val);
  } get withTime(): boolean {
    return this._withTime;
  }

  @Input() set disabled(val: boolean) {
    this._disabled = coerceBooleanProperty(val);
    this.stateChanges.next();
  } get disabled(): boolean {
    return this._disabled;
  }

  @Input() set required(val: boolean) {
    this._required = coerceBooleanProperty(val);
    this.stateChanges.next();
  } get required(): boolean {
    return this._required;
  }

  @Input() set dateType(val: DateType) {
    this._dateType = val;
    if (val === DateType.AD) {
      this.dateFormat = this.dateFormatAD;
    } else {
      this.dateFormat = this.dateFormatBS;
    }
    this.stateChanges.next();
  } get dateType(): DateType {
    return this._dateType;
  }
  @Input() set minimumDate(val: Date) {
    this._minimumDate = val;
  } get minimumDate(): Date {
    return this._minimumDate;
  }

  @Input() set maximumDate(val: Date) {
    this._maximumDate = val;
  } get maximumDate(): Date {
    return this._maximumDate;
  }

  @Input() set language(val: number) {
    this._language = val;
    this.changeDateTooltip = val === 0 ? this.caption.switchToAD[val] : this.caption.switchToBS[val];
    this.showCalendarTooltip = this.dateType === DateType.AD ? this.caption.showADCalendar[val]
      : this.caption.showBSCalendar[val];
    this.clearTooltip = this.caption.clearTooltip[val];
    this.errorMessage = this.caption.invalidMessage[val];
  } get language(): number {
    return this._language;
  }

  @Input() set dateFormatAD(val: DateFormat) {
    this._dateFormatAD = val;
  } get dateFormatAD(): DateFormat {
    return this._dateFormatAD;
  }

  @Input() set dateFormatBS(val: DateFormat) {
    this._dateFormatBS = val;
  } get dateFormatBS(): DateFormat {
    return this._dateFormatBS;
  }

  @Input() set option(val: IDatePickerOption) {
    this._showCalendarOnFocus = val.showCalendarOnFocus;
    this._dateFormatAD = val.dateFormatAD;
    this._dateFormatBS = val.dateFormatBS;
    this._withTime = val.withTime;
    this._minimumDate = val.minDate;
    this._maximumDate = val.maxDate;
    this._dateType = val.dateType;
    this._language = val.language;

    if (this._dateType === DateType.AD) {
      this.dateFormat = this.dateFormatAD;
    } else {
      this.dateFormat = this.dateFormatBS;
    }
    this.dateinput.dateFormat = this.dateFormat;
    this._closeOnClick = val.closeOnClick;
    this._required = val.required;
    this._disabled = val.disabled;
    this._placeHolder = val.placeholder;
    this.changeDateTooltip = this.language === 0 ? this.caption.switchToAD[this.language] : this.caption.switchToBS[this.language];
    this.showCalendarTooltip = this.dateType === DateType.AD ? this.caption.showADCalendar[this.language]
      : this.caption.showBSCalendar[this.language];
    this.clearTooltip = this.caption.clearTooltip[this.language];
    this.errorMessage = this.caption.invalidMessage[this.language];

    if (val.fromDate !== undefined) {
      // val.fromDate = new Date();
      this._startingDate = val.fromDate;
    }
    if (val.toDate !== undefined) {
      // val.toDate = new Date();
      this._endingDate = val.toDate;
    }
    this.setDate(this._startingDate, this._endingDate);
    this.stateChanges.next();
  }

  private _startingDate = new Date();
  private _endingDate = new Date();

  @Input() set startingDate(val: Date) {
    this._startingDate = val;
    this.setDate(this._startingDate, this._endingDate);
  }

  @Input() set endingDate(val: Date) {
    this._endingDate = val;
    this.setDate(this._startingDate, this._endingDate);
  }

  get fromDate() {
    return this._fromDate;
  }
  get toDate() {
    return this._toDate;
  }

  get dateAD() {
    return this._dateAD;
  }

  get dateBS() {
    return this._dateBS;
  }

  constructor(
    private fm: FocusMonitor,
    private elRef: ElementRef,
    private dpService: CalendarService,
  ) {
    this.caption = language.label;

    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.stateChanges.next();
    });
  }

  ngAfterViewInit(): void {
    this.dateRange = true;
    if (this.dateType === DateType.AD) {
      this.myValue = this._dateAD;
    } else {
      this.myValue = this._dateBS;
    }
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched() { }

  private propagateChange = (_: any) => {

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) { }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  public validate(c: FormControl) {
    return (this.isValid === true) ? null : {
      jsonParseError: {
        valid: false,
      },
    };
  }



  private setDate(dateFrom: Date, dateTo?: Date) {
    let dtAD = this.dpService.GetFormatedDateAD(dateFrom, this.dateFormatAD);
    let dtBS = this.dpService.GetDateBS(dateFrom, this.dateFormatBS);
    let hr: string | number; let min: string | number;
    if (!!this.withTime) {
      hr = (+dateFrom.getHours() < 10) ? '0' + dateFrom.getHours() : dateFrom.getHours();
      min = (+dateFrom.getMinutes() < 10) ? '0' + dateFrom.getMinutes() : dateFrom.getMinutes();
      dtAD = dtAD + '   ' + hr.toString() + ':' + min.toString();
      dtBS = dtBS + '   ' + hr.toString() + ':' + min.toString();
    }
    this._fromDate = { date: dateFrom, dateAD: dtAD, dateBS: dtBS, selectedDateType: this.dateType };


    dtAD = this.dpService.GetFormatedDateAD(dateTo, this.dateFormatAD);
    dtBS = this.dpService.GetDateBS(dateTo, this.dateFormatBS);

    if (!!this.withTime) {
      hr = (+dateTo.getHours() < 10) ? '0' + dateTo.getHours() : dateTo.getHours();
      min = (+dateTo.getMinutes() < 10) ? '0' + dateTo.getMinutes() : dateTo.getMinutes();

      dtAD = dtAD + '   ' + hr.toString() + ':' + min.toString();
      dtBS = dtBS + '   ' + hr.toString() + ':' + min.toString();
    }

    this._toDate = { date: dateFrom, dateAD: dtAD, dateBS: dtBS, selectedDateType: this.dateType };

    this._dateAD = this._fromDate.dateAD + ' / ' + this._toDate.dateAD;
    this._dateBS = this._fromDate.dateBS + ' / ' + this._toDate.dateBS;

    if (this.dateType === DateType.AD) {
      this.myValue = this._dateAD;
    } else {
      this.myValue = this._dateBS;
    }
  }


  dateChange(newDate: string) {
    this.isValid = false;
    let isError = true;
    this.myValue = newDate;
    this.errorMessage = this.caption.invalidMessage[this.language];

    if (!!this.required) {
      if (this.withTime === true) {
        if (this.myValue.length !== 39) {
          isError = true;
        } else {
          isError = false;
        }
      } else {
        if (this.myValue.length === 23) {
          isError = false;
        } else {
          isError = true;
        }
      }
    } else {
      if (this.myValue.length === 0) {

        this._dateAD = null;
        this._dateBS = null;
        this._fromDate = this.getEmptyObject();
        this._toDate = this.getEmptyObject();

        isError = false;
      } else {
        if (this.withTime === true) {
          if (this.myValue.length !== 39) {
            isError = true;
          } else {
            isError = false;
          }
        } else {
          if (this.myValue.length === 23) {
            isError = false;
          } else {
            isError = true;
          }
        }
      }
    }
    if (isError === false) {
      if (!!this.required) {
        isError = !this.setDateValue(this.myValue, this.dateFormat, this.dateType);
      } else {
        if (this.myValue.length === 0) {
          isError = false;
        } else {
          isError = !this.setDateValue(this.myValue, this.dateFormat, this.dateType);
        }
      }
    }

    if (isError === true) {
      if (this.errorState === false) {
        this.errorState = true;
        this.isValid = false;
        this._dateAD = '';
        this._dateBS = '';
        this._fromDate = this.getEmptyObject();
        this._toDate = this.getEmptyObject();
        this.onDateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
      }
    } else {
      this.isValid = true;
      this.errorState = false;

      this.onDateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
    }
  }

  private getEmptyObject(): any {
    const ob: ISelectedDate = { date: null, dateAD: '', dateBS: '', selectedDateType: null };
    return ob;
  }

  getITimeFormat() {
    let _time: ITimeFormat;
    if (this.withTime === true) {
      let tm: any;

      if (this.fromDate === null) {
        _time = { hour: 0, minute: 0 };
      } else {
        tm = this.fromDate.dateAD.split('   ');

        if (tm.length > 1) {
          tm = tm[1].split(':');
          _time = { hour: +tm[0], minute: + tm[1] };
        } else {
          _time = { hour: 0, minute: 0 };
        }
      }
    }
    return _time;
  }

  private setDateValue(dtValue: string, dtFormat: DateFormat, dtType: DateType): boolean {
    this._dateAD = '';
    this._dateBS = '';
    this._fromDate = this.getEmptyObject();
    this._toDate = this.getEmptyObject();
    let lError = false;
    let i = 0;
    let adDate = '';
    let bsDate = '';
    let dateArray: any;
    let dateValue: string;
    let timeValue: string;
    let newDate: Date; let newTime = '';
    let dArray: any;

    const fromTo = dtValue.split('/');

    if (fromTo.length === 2) {
      for (let itm of fromTo) {
        itm = itm.trim();
        if (this.withTime === true) {
          dateArray = itm.trim().split('   ');
          dateValue = dateArray[0].trim();
          timeValue = dateArray[1].trim();
        } else {
          dateValue = itm.trim().substr(0, 10);
        }
        dArray = dateValue.split('-');

        let yr = 0; let mn = 0; let dy = 0; let hr = 0; let mu = 0;
        if (dtFormat === DateFormat.MMddyyyy) {
          yr = +dArray[2]; mn = +dArray[0]; dy = +dArray[1];
        } else if (dtFormat === DateFormat.ddMMyyyy) {
          yr = +dArray[2]; mn = +dArray[1]; dy = +dArray[0];
        } else if (dtFormat === DateFormat.yyyyddMM) {
          yr = +dArray[0]; mn = +dArray[2]; dy = +dArray[1];
        } else if (dtFormat === DateFormat.yyyyMMdd) {
          yr = +dArray[0]; mn = +dArray[1]; dy = +dArray[2];
        }

        if (timeValue) {
          dArray = timeValue.split(':');
          hr = +dArray[0];
          mu = +dArray[1];
          const strHr = (hr < 10) ? '0' + hr : hr.toString();
          const strMn = (mu < 10) ? '0' + mu : mu.toString();
          newTime = '   ' + strHr + ':' + strMn;
        }

        try {
          if (dtType === DateType.AD) {
            newDate = new Date(yr, mn - 1, dy, hr, mu);
            adDate = this.dpService.GetFormatedDateAD(newDate, this.dateFormatAD) + newTime;
            bsDate = this.dpService.GetDateBS(newDate, this.dateFormatBS);
            if (bsDate != null) {
              bsDate = bsDate + newTime;
            }
          } else {
            newDate = this.dpService.GetDateAD(yr, mn, dy);
            if (newDate === null) {
              if (i === 0) {
                this.errorMessage = this.caption.startingBSDateError[this.language];
              } else {
                this.errorMessage = this.caption.endingBSDateError[this.language];
              }

              return false;
            }
            adDate = this.dpService.GetFormatedDateAD(newDate, this.dateFormatAD) + newTime;
            bsDate = this.dpService.GetDateBS(newDate, this.dateFormatBS) + newTime;

            newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hr, mu);
          }
          if (i === 0) {
            this._fromDate.date = newDate;
            this._fromDate.dateAD = adDate;
            this._fromDate.dateBS = bsDate;
            this._fromDate.selectedDateType = this.dateType;
          } else {
            this._toDate.date = newDate;
            this._toDate.dateAD = adDate;
            this._toDate.dateBS = bsDate;
            this._toDate.selectedDateType = this.dateType;
          }

          if (newDate < this.minimumDate || newDate > this.maximumDate) {

            if (this.language === 0) {
              this.errorMessage = `Date not in range  ${this.dpService.GetFormatedDateAD(this.minimumDate,
                this.dateFormatAD)}  to ${this.dpService.GetFormatedDateAD(this.maximumDate, this.dateFormatAD)}`;
            } else {
              this.errorMessage = `गतेकाे सिमा  ${this.dpService.GetFormatedDateAD(this.minimumDate,
                this.dateFormatAD)}  देखि ${this.dpService.GetFormatedDateAD(this.maximumDate, this.dateFormatAD)} सम्म हुनु पर्नेछ।`;
            }
            lError = true;
            return false;
          }
        } catch (e) {
          lError = true;
          return false;
        }
        i++;
      }

      if (this._fromDate.date > this._toDate.date) {
        this.errorMessage = this.caption.fromDateToDateNotMatch[this.language];
        return false;
      }
      if (lError === false) {
        this.isValid = true;
        this._dateAD = this._fromDate.dateAD + ' / ' + this._toDate.dateAD;
        this._dateBS = this._fromDate.dateBS + ' / ' + this._toDate.dateBS;
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }



  public showPicker() {
    if (this.isPickerVisible) {
      return;
    }
    this.isPickerVisible = true;
    this._afterButtonClick = true;
    this.currentDate = this._fromDate === undefined ? new Date() : this._fromDate.date ? this._fromDate.date : new Date();
    if (this.withTime) {
      this.closeOnClick = false;
    }
    this.dateRange = true;
    this.calPopUp.showCalendar(
      this.dateType,
      this.dateFormatAD,
      this.dateFormatBS,
      this.withTime,
      this.minimumDate,
      this.maximumDate, this.closeOnClick,
      this.currentDate,
      this.language);
    // if (this.isShowCalendarClicked === true) {
    this.menuTrigger.openMenu();
    // }
    // if (this.isShowCalendarClicked === false) {
    //   this.menuTrigger.openMenu();

    //   this.isShowCalendarClicked = true;
    //   this.menuTrigger.closeMenu();
    // }
  }

  onMenuClosed(): void {
    setTimeout(() => {
      this.currentDate = null;
      this.currentTime = null;
    }, 1000);
    this.dateinput.focus(0);
    this.isPickerVisible = false;
  }

  focus() {
    if (this.showCalendarOnFocus === true && this._afterButtonClick === false) {
      this.showPicker();
    }
    setTimeout(() => {
      this._afterButtonClick = false;
    });
  }

  dateChangedFromPopUp(result: any) {
    this.menuTrigger.closeMenu();
    if (!!this.disabled) {
      return;
    }
    // result will be update userTime object or -1 or undefined (closed dialog w/o clicking cancel)
    if (result === undefined) {
      return;
    } else if (result !== -1) {
      if (result.length === 2) {
        this.dateType = result[0].selectedDateType;
        if (this.dateType === DateType.AD) {
          this.dateFormat = this.dateFormatAD;
          this.dateinput.dateFormat = this.dateFormat;
        } else {
          this.dateFormat = this.dateFormatBS;
          this.dateinput.dateFormat = this.dateFormat;
        }
        this._fromDate = {
          date: result[0].date,
          dateAD: result[0].dateAD,
          dateBS: result[0].dateBS,
          selectedDateType: result[0].selectedDateType
        };
        this._toDate = {
          date: result[1].date,
          dateAD: result[1].dateAD,
          dateBS: result[1].dateBS,
          selectedDateType: result[1].selectedDateType
        };
        this._dateAD = result[0].dateAD + ' / ' + result[1].dateAD;
        if (result[0].dateBS === undefined || result[1].dateBS === undefined) {
          this._dateBS = '';
        } else {
          this._dateBS = result[0].dateBS + ' / ' + result[1].dateBS;
        }


        if (this.dateType === DateType.AD) {
          this.myValue = this._dateAD;
        } else {
          this.myValue = this._dateBS;
        }
        this.isValid = true;
        this.errorState = false;

        this.onDateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
        this.stateChanges.next();
      }
    }
  }
  changeDateType() {
    this._afterButtonClick = true;
    if (this.errorState) {
      return;
    }
    if (this.dateBS === '' || this.dateAD === '') {
      return;
    }
    if (this.fromDate.dateBS === null || this.toDate.dateBS === null) {
      return;
    }

    if (this.dateType === DateType.AD) {
      this.dateType = DateType.BS;
      this.dateFormat = this.dateFormatBS;
      this.dateinput.dateFormat = this.dateFormat;
      this.myValue = this.dateBS;
      this.changeDateTooltip = this.caption.switchToAD[this.language];
      this.showCalendarTooltip = this.caption.showBSCalendar[this.language];
    } else {
      this.dateType = DateType.AD;
      this.dateFormat = this.dateFormatAD;
      this.dateinput.dateFormat = this.dateFormat;
      this.myValue = this.dateAD;
      this.changeDateTooltip = this.caption.switchToBS[this.language];
      this.showCalendarTooltip = this.caption.showADCalendar[this.language];
    }
    if (this.errorState) {
      this.clearText();
      return;
    }
    this.stateChanges.next();
  }


  private clearText() {
    this._afterButtonClick = true;
    if (this.myValue !== '') {
      this.myValue = '';
      this._dateAD = '';
      this._dateBS = '';
      this._fromDate = this.getEmptyObject();
      this._toDate = this.getEmptyObject();
      this.isValid = false;
      this.onDateChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
    }
    if (!!this.required) {
      this.errorMessage = this.placeHolder + this.caption.dateRequiredLabel[this.language];
      this.errorState = true;
    } else {
      this.errorState = false;
    }
    this.stateChanges.next();
  }
}
