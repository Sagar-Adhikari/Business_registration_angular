import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import {
  DateType, DateFormat, CalendarViewType, Day, Month
} from '../../model/calendar.model';
import { ISelectedDate } from '../../model/calendar.option';
import { CalendarService } from '../../services/calendar.service';
import { MatButton } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'dp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {

  private yearMonth: MatButton;
  @ViewChild('yearmonth') set content(content: MatButton) {
    this.yearMonth = content;
  }

  @Output() DateTimeChanged: EventEmitter<any> = new EventEmitter();
  private day = 1;

  currentView: CalendarViewType = CalendarViewType.Both;
  title: string;
  errorInBS: any = false;
  lang = 0;
  dateTypeTitle = '';
  withTime = false;

  private year: number;
  private fromYear: number;
  private toYear: number;
  private month: number;
  private monthName: string;
  private todayColor = 'cornflowerblue';
  private selectedColor = 'rgb(239, 175, 175)';
  private backgroundColor = '#efebeb';
  private dayNameBackgroundColor = 'indianred';
  private hourMax = 23;
  private hourMin = 0;
  private showTicks = true;
  private hourStep = 1;
  private thumbLabel = true;
  private hourValue = 0;
  private minuteMax = 59;
  private minuteMin = 0;
  private minuteStep = 1;
  private minuteValue = 0;
  private displayDate: string;
  private datas: any[];
  private titles: any[];
  private cols = 7;
  private rowHeight = '35px';
  private _selectedDate: ISelectedDate = null;
  private dateType: DateType = DateType.AD;
  private dateFormatAD: DateFormat = DateFormat.ddMMyyyy;
  private dateFormatBS: DateFormat = DateFormat.yyyyMMdd;
  private minDate = new Date(1913, 3, 13);
  private maxDate = new Date(new Date().getFullYear() + 100, new Date().getMonth(), new Date().getDate());
  private closeOnClick = true;
  private _dateRange = true;
  private currentDate = new Date();

  @Input()
  get dateRange() {
    return this._dateRange;
  }
  set dateRange(val: boolean) {
    this._dateRange = val;
  }

  public showCalendar(dateType: DateType, dateFormatAD: DateFormat,
    dateFormatBS: DateFormat, withTime: boolean, minDate: Date, maxDate: Date,
    closeOnClick: boolean, currentDate: Date, lang: number
  ) {
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
      if (this.dateType === 1) {
        this.dateTypeTitle = 'AD';
      } else {
        this.dateTypeTitle = 'BS';
      }
    } else {
      if (this.dateType === 1) {
        this.dateTypeTitle = 'मिति';
      } else {
        this.dateTypeTitle = 'गते';
      }
    }
    this.setInitialCalendar(this.currentDate);
    setTimeout(() => {
      this.yearMonth.focus();
    }, 100);

  }


  setInitialCalendar(val: Date) {
    if (this.dateType === DateType.AD) {
      this.year = val.getFullYear();
      this.month = val.getMonth() + 1;
      this.day = val.getDate();

      this.title = this.dpService.GetADMonthName(+this.month) + ', ' + this.year.toString();
      this.setCalendarDay(+this.year, +this.month, +this.day,
        this.dateType, this.maxDate, this.minDate);

    } else {
      const bsDate = this.dpService.GetDateBS(val, this.dateFormatBS);
      this.year = this.dpService.GetBSYear(bsDate, this.dateFormatBS);
      this.month = this.dpService.GetBSMonth(bsDate, this.dateFormatBS);
      this.day = this.dpService.GetBSDay(bsDate, this.dateFormatBS);

      this.title = this.dpService.GetBSMonthName(+this.month) + ', ' + this.year;
      this.setCalendarDay(+this.year, +this.month, +this.day,
        this.dateType, this.maxDate, this.minDate);
    }

    if (!!this.withTime) {
      this.hourValue = val.getHours();
      this.minuteValue = val.getMinutes();
    }
  }


  constructor(private dpService: CalendarService
  ) { }


  dateTypeToggle() {

    if (this.dateType === DateType.AD) {
      this.dateType = DateType.BS;
    } else {
      this.dateType = DateType.AD;
    }
    if (this.lang === 0) {
      if (this.dateType === 1) {
        this.dateTypeTitle = 'AD';
      } else {
        this.dateTypeTitle = 'BS';
      }
    } else {
      if (this.dateType === 1) {
        this.dateTypeTitle = 'मिति';
      } else {
        this.dateTypeTitle = 'गते';
      }
    }
    this.setCalender();
  }

  get selectedDate(): ISelectedDate {
    if (this._selectedDate === null) {
      this.setDate();
    }
    return this._selectedDate;
  }

  private setCalender() {
    if (this.dateType === DateType.AD) {
      this.year = this.currentDate.getFullYear();
      this.month = this.currentDate.getMonth() + 1;
      this.day = this.currentDate.getDate();
      this.setCalendarDay(this.year, this.month, this.day, DateType.AD, this.maxDate, this.minDate);
    } else {
      const bsDate = this.dpService.GetDateBS(this.currentDate, this.dateFormatBS);
      this.year = this.dpService.GetBSYear(bsDate, this.dateFormatBS);
      this.month = this.dpService.GetBSMonth(bsDate, this.dateFormatBS);
      this.day = this.dpService.GetBSDay(bsDate, this.dateFormatBS);
      this.setCalendarDay(this.year, this.month, this.day, DateType.BS, this.maxDate, this.minDate);
    }

    this.setDate();
    this.settime();
  }

  private setCalendarDay(year: number, month: number, day: number, dType: DateType, maxDate: Date, minDate: Date) {
    const today: Date = new Date(new Date().toDateString());
    const dayList: Day[] = this.dpService.GetWeekDayPrefixList();
    this.cols = 7;
    this.rowHeight = '35px';
    this.currentView = CalendarViewType.Both;
    this.datas = [];
    this.titles = [];
    this.month = month;
    this.year = year;

    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < dayList.length; i++) {
      if (this.lang === 0) {
        this.titles.push({ text: dayList[i].day, rows: 1, cols: 1, color: this.dayNameBackgroundColor });
      } else {
        this.titles.push({ text: dayList[i].nepaliDay, rows: 1, cols: 1, color: this.dayNameBackgroundColor });
      }

    }

    if (dType === DateType.AD) {
      //  this.dateType = 'AD';
      this.title = this.dpService.GetADMonthName(month) + ', ' + year;
      const d = new Date(year, month - 1, 1).getDay();
      const dInm = new Date(year, month, 0).getDate();
      if (d > 0) {
        // tslint:disable-next-line:no-shadowed-variable
        for (let i = 0; i < d; i++) {
          this.datas.push({ text: '', id: 0, rows: 1, cols: 1, color: this.backgroundColor });
        }
      }
      let curDate: Date;
      let disable = 'false';
      const selDate: Date = new Date(this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate());
      for (let i = 1; i <= dInm; i++) {
        curDate = new Date(year, month - 1, i);

        if (curDate < minDate || curDate > maxDate) {
          disable = 'true';
        } else {
          disable = 'false';
        }

        if (curDate.getTime() === today.getTime()) {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.todayColor, disable: disable });

        } else if (curDate.getTime() === selDate.getTime()) {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.selectedColor, disable: disable });
        } else {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.backgroundColor, disable: disable });
        }

      }

      for (let i = this.datas.length; i <= 41; i++) {
        this.datas.push({ text: '', id: 0, rows: 1, cols: 1, color: this.backgroundColor });
      }
    } else {
      let d = new Date(year, month - 1, 1).getDay();
      // this.dateType = 'BS';
      this.title = this.dpService.GetBSMonthName(month) + ', ' + year;
      try {
        d = this.dpService.GetDateAD(+year, +month, 1).getDay();
      } catch (e) {
        this.errorInBS = true;
        return;
      }

      const dInm = this.dpService.GetDaysInMonthBS(+year, +month);
      let disable = 'false';
      // var selDate: Date = this.dpService.GetDateAD(+year, +month, +day)
      const selDate: Date = new Date(this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        this.currentDate.getDate());

      if (d > 0) {
        for (let i = 0; i < d; i++) {
          this.datas.push({ text: '', id: 0, rows: 1, cols: 1, color: this.backgroundColor });
        }
      }

      for (let i = 1; i <= dInm; i++) {
        const curDate = this.dpService.GetDateAD(+year, +month, i);
        if (curDate < minDate || curDate > maxDate) {
          disable = 'true';
        } else {
          disable = 'false';
        }
        if (curDate.getTime() === today.getTime()) {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.todayColor, disable: disable });
        } else if (curDate.getTime() === selDate.getTime()) {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.selectedColor, disable: disable });
        } else {
          this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.backgroundColor, disable: disable });
        }
      }
      for (let i = this.datas.length; i <= 41; i++) {
        this.datas.push({ text: '', id: 0, rows: 1, cols: 1, color: this.backgroundColor });
      }
    }
    this.setDisplayDate();

  }

  private setDisplayDate() {
    const ad = new Date(this.selectedDate.date.getFullYear(), this.selectedDate.date.getMonth(), this.selectedDate.date.getDate());

    let yr = this.selectedDate.date.getFullYear();
    let mn = this.selectedDate.date.getMonth() + 1;
    let dy = this.selectedDate.date.getDate();
    let mnName = '';

    if (this.dateType === DateType.AD) {
      const bsDate = this.dpService.GetDateBS(ad, this.dateFormatBS);
      if (bsDate === null) {
        this.errorInBS = true;
        this.displayDate = 'BS Calendar Not Found!';
        return;
      }
      yr = this.dpService.GetBSYear(bsDate, this.dateFormatBS);
      mn = this.dpService.GetBSMonth(bsDate, this.dateFormatBS);
      dy = this.dpService.GetBSDay(bsDate, this.dateFormatBS);

      mnName = this.dpService.GetBSMonthName(mn);
    } else {
      mnName = this.dpService.GetADMonthName(mn);
    }

    this.displayDate = (this.dateType === DateType.AD) ? 'BS: ' : 'AD:  ';
    this.displayDate = this.displayDate + dy + ' ' + mnName + ' ' + yr;

  }
  private setCalendarMonth(year: number, dType: DateType) {
    // debugger;
    let disable = 'false';
    this.cols = 3;
    this.rowHeight = '60px';
    this.datas = [];
    this.currentView = CalendarViewType.Month;

    let minYearMnth = this.minDate.getFullYear().toString();
    let maxYearMnth = this.maxDate.getFullYear().toString();

    minYearMnth = minYearMnth + (this.minDate.getMonth() < 10 ? '0' +
      this.minDate.getMonth().toString() : this.minDate.getMonth().toString());
    maxYearMnth = maxYearMnth + (this.maxDate.getMonth() < 10 ? '0' +
      this.maxDate.getMonth().toString() : this.maxDate.getMonth().toString());

    if (this.dateType === DateType.BS) {
      let bs = this.dpService.GetDateBS(this.minDate, this.dateFormatBS);
      if (bs === null) {
        minYearMnth = this.dpService.GetMinYear().toString() + '00';
      } else {
        minYearMnth = this.dpService.GetBSYear(bs, this.dateFormatBS).toString();
        const mnth = (this.dpService.GetBSMonth(bs, this.dateFormatBS) - 1).toString();
        minYearMnth = minYearMnth + (+mnth < 10 ? '0' + mnth.toString() : mnth.toString());
      }
      bs = this.dpService.GetDateBS(this.maxDate, this.dateFormatBS);
      if (bs === null) {
        maxYearMnth = this.dpService.GetMaxYear().toString() + '11';
      } else {
        maxYearMnth = this.dpService.GetBSYear(bs, this.dateFormatBS).toString();
        const mnth = (this.dpService.GetBSMonth(bs, this.dateFormatBS) - 1).toString();
        maxYearMnth = maxYearMnth + (+mnth < 10 ? '0' + mnth.toString() : mnth.toString());
      }
    }


    let monthList: Month[];
    if (dType === DateType.AD) {
      monthList = this.dpService.GetADMonthList();
    } else {
      monthList = this.dpService.GetBSMonthList();
    }

    let curYearMnth = '';
    for (let i = 0; i < monthList.length; i++) {
      curYearMnth = year.toString() + (i < 10 ? '0' + i.toString() : i.toString());

      if (curYearMnth < minYearMnth || curYearMnth > maxYearMnth) {
        disable = 'true';
      } else {
        disable = 'false';
      }
      // console.log(minYearMnth, curYearMnth, maxYearMnth);
      this.datas.push({ text: monthList[i].month, id: i + 1, rows: 1, cols: 1, color: this.backgroundColor, disable: disable });
    }
    this.settime();
  }
  private setCalendarYear(fromYear: number, toYear: number) {
    let disable = 'false';
    this.cols = 3;
    this.rowHeight = '60px';
    this.datas = [];
    this.currentView = CalendarViewType.Year;

    let minYearMnth = this.minDate.getFullYear();
    let maxYearMnth = this.maxDate.getFullYear();

    if (this.dateType === DateType.BS) {
      let bs = this.dpService.GetDateBS(this.minDate, this.dateFormatBS);
      if (bs === null) {
        minYearMnth = this.dpService.GetMinYear();
      } else {
        minYearMnth = this.dpService.GetBSYear(bs, this.dateFormatBS);
      }
      bs = this.dpService.GetDateBS(this.maxDate, this.dateFormatBS);
      if (bs === null) {
        maxYearMnth = this.dpService.GetMaxYear();
      } else {
        maxYearMnth = this.dpService.GetBSYear(bs, this.dateFormatBS);
      }
    }
    for (let i = fromYear - 1; i <= toYear + 1; i++) {
      if (i < minYearMnth || i > maxYearMnth) {
        disable = 'true';
      } else {
        disable = 'false';
      }

      this.datas.push({ text: i, id: i, rows: 1, cols: 1, color: this.backgroundColor, disable: disable });
    }
    this.settime();

  }

  private settime() {
    if (this.withTime) {
      if (this.currentDate) {
        this.hourValue = this.currentDate.getHours();
        this.minuteValue = this.currentDate.getMinutes();
      } else {
        this.hourValue = 0;
        this.minuteValue = 0;
      }
    }
  }

  titleClick() {
    if (this.currentView === CalendarViewType.Both) {
      this.currentView = CalendarViewType.Month;
      this.title = this.year.toString();
      this.setCalendarMonth(this.year, this.dateType);
    } else if (this.currentView === CalendarViewType.Month) {
      this.currentView = CalendarViewType.Year;
      let datePart = this.year.toString().substring(0, 3) + '0';
      this.fromYear = +datePart;
      datePart = this.year.toString().substring(0, 3) + '9';
      this.toYear = +datePart;
      this.title = this.fromYear.toString() + '-' + this.toYear.toString();
      this.setCalendarYear(this.fromYear, this.toYear);
    }
  }

  upDown(ev: any) {
    if (ev === '+') {
      if (this.currentView === CalendarViewType.Month) {
        this.year = this.year - 1;
        this.title = this.year.toString();
        this.setCalendarMonth(this.year, this.dateType);
      } else if (this.currentView === CalendarViewType.Year) {
        this.fromYear = this.fromYear - 10;
        this.toYear = this.toYear - 10;
        this.title = this.fromYear.toString() + '-' + this.toYear.toString();
        this.setCalendarYear(this.fromYear, this.toYear);
      } else if (this.currentView === CalendarViewType.Both) {
        if (this.month === 1) {
          this.month = 12;
          this.year = this.year - 1;
        } else {
          this.month = this.month - 1;
        }
        if (this.dateType === DateType.BS) {
          this.monthName = this.dpService.GetBSMonthName(this.month);
        } else {
          this.monthName = this.dpService.GetADMonthName(this.month);
        }
        this.title = this.monthName + ', ' + this.year;

        this.setCalendarDay(this.year, this.month, this.day, this.dateType, this.maxDate, this.minDate);
      }
    } else {
      if (this.currentView === CalendarViewType.Month) {
        this.year = this.year + 1;
        this.title = this.year.toString();
        this.setCalendarMonth(this.year, this.dateType);

      } else if (this.currentView === CalendarViewType.Year) {

        this.fromYear = this.fromYear + 10;
        this.toYear = this.toYear + 10;
        this.title = this.fromYear.toString() + '-' + this.toYear.toString();

        this.setCalendarYear(this.fromYear, this.toYear);
      } else if (this.currentView === CalendarViewType.Both) {
        if (this.month === 12) {
          this.month = 1;
          this.year = this.year + 1;
        } else {
          this.month = this.month + 1;
        }
        // this.month = this.month + 1;
        if (this.dateType === DateType.BS) {
          this.monthName = this.dpService.GetBSMonthName(this.month);
        } else {
          this.monthName = this.dpService.GetADMonthName(this.month);
        }
        this.title = this.monthName + ', ' + this.year;
        this.setCalendarDay(this.year, this.month, this.day, this.dateType, this.maxDate, this.minDate);
      }
    }
  }

  private ItemClicked(ev: any) {

    if (this.currentView === CalendarViewType.Both) {
      this.day = +ev;

      const today = new Date(new Date().toDateString());
      let curDate = new Date(this.year, this.month, 1);

      const index: number = this.datas.findIndex(img => img.id === ev);

      if (this.dateType === DateType.AD) {
        for (let i = 0; i < this.datas.length; i++) {

          curDate = new Date(this.year, this.month - 1, +this.datas[i].text);

          if (today.getTime() === curDate.getTime()) {
            this.datas[i]['color'] = this.todayColor;
          } else {
            if (i !== index) {
              this.datas[i]['color'] = this.backgroundColor;
            } else {
              this.datas[i]['color'] = this.selectedColor;
            }
          }
        }
      } else {
        for (let i = 0; i < this.datas.length; i++) {

          curDate = this.dpService.GetDateAD(this.year, this.month, +this.datas[i].text);

          if (today.getTime() === curDate.getTime()) {
            this.datas[i]['color'] = this.todayColor;
          } else {
            if (i !== index) {
              this.datas[i]['color'] = this.backgroundColor;
            } else {
              this.datas[i]['color'] = this.selectedColor;
            }
          }
        }
      }
      this.returnDate();

    } else if (this.currentView === CalendarViewType.Year) {
      this.currentView = CalendarViewType.Month;
      this.year = ev;
      if (this.dateType === DateType.AD) {
        this.monthName = this.dpService.GetADMonthName(this.month);
      } else {
        this.monthName = this.dpService.GetBSMonthName(this.month);
      }
      this.title = this.year.toString();
      this.setCalendarMonth(this.year, this.dateType);
    } else if (this.currentView === CalendarViewType.Month) {
      this.month = ev;
      if (this.dateType === DateType.AD) {
        this.monthName = this.dpService.GetADMonthName(this.month);
      } else {
        this.monthName = this.dpService.GetBSMonthName(this.month);
      }
      this.title = this.monthName + ', ' + this.year;
      this.currentView = CalendarViewType.Both;
      this.setCalendarDay(this.year, this.month, 1, this.dateType, this.maxDate, this.minDate);
    }


  }
  private setDate() {
    let dt: Date;
    if (this.dateType === DateType.AD) {
      dt = new Date(+this.year, +this.month - 1, +this.day);
    } else {
      dt = this.dpService.GetDateAD(+this.year, +this.month, +this.day);
    }
    let dtAD = this.dpService.GetFormatedDateAD(dt, this.dateFormatAD);
    let dtBS = null;
    try {
      dtBS = this.dpService.GetDateBS(dt, this.dateFormatBS);
    } catch (e) {
      dtBS = '';
    }


    if (!!this.withTime) {
      const hr = (+this.hourValue < 10) ? '0' + this.hourValue.toString() : this.hourValue.toString();
      const min = (+this.minuteValue < 10) ? '0' + this.minuteValue.toString() : this.minuteValue.toString();
      dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), +this.hourValue, +this.minuteValue);
      dtAD = dtAD + '   ' + hr.toString() + ':' + min.toString();
      if (dtBS) {
        dtBS = dtBS + '   ' + hr.toString() + ':' + min.toString();
      } else {
        dtBS = '';
      }
      // this.hourValue = this.hourValue;
      // this.minDate = this.minuteValue;
    }
    this._selectedDate = {
      dateAD: dtAD,
      dateBS: dtBS,
      date: dt,
      selectedDateType: this.dateType
    };
    this.currentDate = dt;
  }
  private returnDate() {
    this.setDate();
    this.setDisplayDate();
    // if (this.closeOnClick) {
    //   if (!this.dateRange) {
    //     if (!this.withTime) {
    this.DateTimeChanged.emit(this._selectedDate);
    //     }
    //   }
    // }
  }

  onInputChange(ev: any, flag: any) {
    if (flag === 'm') {
      this.minuteValue = ev.value;
    } else {
      this.hourValue = ev.value;
    }
    this.returnDate();
  }
}


