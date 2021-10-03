import {
    Component, ElementRef, Input, OnDestroy, forwardRef,
    OnChanges, SimpleChange, Output, EventEmitter,
    ViewChild,
    AfterViewInit,
    Injector,
    OnInit,
} from '@angular/core';
import * as language from '../../language';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, Validator, FormControl, NG_VALIDATORS, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatMenuTrigger } from '@angular/material';

import { DateFormat, DateType } from '../../model/calendar.model';
import { IDateFormat, ITimeFormat } from '../../model/calendar.model';
import { ISelectedDate, IDatePickerOption } from '../../model/calendar.option';
import { CalendarService } from '../../services/calendar.service';
import { DateInputComponent } from '../date-input/date-input.component';
import { CalendarPopupComponent } from '../calendar-popup/calendar-popup.component';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true,
        }]
})

export class DatepickerComponent implements OnInit, ControlValueAccessor, Validator, OnChanges, OnDestroy, AfterViewInit {
    @ViewChild('dateinput') private dateinput: DateInputComponent;
    @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
    @ViewChild('calPopUp') private calPopUp: CalendarPopupComponent;
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onDateChanged = new EventEmitter<any>();
    ngControl: NgControl;

    private clearTooltip = '';
    private isPickerVisible = false;
    errorMessage = '';
    caption: any;
    changeDateTooltip = ''; // this.caption.switchToBS[this.lang];
    showCalendarTooltip = '';
    myValue = '';
    errorState = false;
    dateFormat: DateFormat = DateFormat.MMddyyyy;


    private currentDate: any;
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

    @Input() set showCalendarOnFocus(val: boolean) {
        this._showCalendarOnFocus = val;
        console.log(this._showCalendarOnFocus);
    } get showCalendarOnFocus(): boolean {
        return this._showCalendarOnFocus;
    }

    @Input() set closeOnClick(val: boolean) {
        this._closeOnClick = val;
    } get closeOnClick(): boolean {
        return this._closeOnClick;
    }
    @Input() set placeHolder(val: string) {
        this._placeHolder = val;
    } get placeHolder(): string {
        return this._placeHolder;
    }

    @Input() set withTime(val: boolean) {
        this._withTime = val;
    } get withTime(): boolean {
        return this._withTime;
    }

    @Input() set disabled(val: boolean) {
        this._disabled = val;
        this.stateChanges.next();
    } get disabled(): boolean {
        return this._disabled;
    }

    @Input() set required(val: boolean) {
        this._required = val;
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
        this._language = val.language;
        this._dateFormatAD = val.dateFormatAD;
        this._dateFormatBS = val.dateFormatBS;
        this._withTime = val.withTime;
        this._minimumDate = val.minDate;
        this._maximumDate = val.maxDate;
        this._dateType = val.dateType;

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
        this.stateChanges.next();
    }

    private _dateBS = ''; // '2031/12/23   00:00';
    private _dateAD = ''; // '03/17/2018   00:00';

    private data: any;

    stateChanges = new Subject<void>();

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
        private inj: Injector
    ) {
        this.caption = language.label;
        fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
            this.stateChanges.next();
        });
    }

    ngAfterViewInit(): void {

    }

    ngOnInit() {
        this.ngControl = this.inj.get(NgControl);
    }

    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    // not used, used for touch input
    public registerOnTouched() { }

    private propagateChange = (_: any) => { };

    public validateFn: any = () => { };


    ngOnChanges(changes: { [propKey: string]: SimpleChange }) { }

    ngOnDestroy() {
        this.stateChanges.complete();
        this.fm.stopMonitoring(this.elRef.nativeElement);
    }


    public validate(c: FormControl) {

        return this.validateFn(c);
    }

    private setInitialDate() {
        const obj: Date = new Date();
        let dtAD = this.dpService.GetFormatedDateAD(obj, this.dateFormatAD);
        let dtBS = this.dpService.GetDateBS(obj, this.dateFormatBS);

        if (this.withTime === true) {
            const hr = (+obj.getHours() < 10) ? '0' + obj.getHours() : obj.getHours();
            const min = (+obj.getMinutes() < 10) ? '0' + obj.getMinutes() : obj.getMinutes();

            dtAD = dtAD + '   ' + hr.toString() + ':' + min.toString();
            dtBS = dtBS + '   ' + hr.toString() + ':' + min.toString();
        }
        this._dateAD = dtAD;
        this._dateBS = dtBS;
    }

    // this is the initial value set to the component
    public writeValue(obj: Date | null) {
        if (obj) {
            this.data = obj;
            let dtAD = this.dpService.GetFormatedDateAD(obj, this.dateFormatAD);
            let dtBS = this.dpService.GetDateBS(obj, this.dateFormatBS);

            if (!!this.withTime) {
                const hr = (+obj.getHours() < 10) ? '0' + obj.getHours() : obj.getHours();
                const min = (+obj.getMinutes() < 10) ? '0' + obj.getMinutes() : obj.getMinutes();

                dtAD = dtAD + '   ' + hr.toString() + ':' + min.toString();
                dtBS = dtBS + '   ' + hr.toString() + ':' + min.toString();
            }
            if (this.dateType === DateType.BS) {
                this.myValue = dtBS;
            } else {
                this.myValue = dtAD;
            }
            this._dateAD = dtAD;
            this._dateBS = dtBS;

            if (!!this.required) {
                this.errorState = false;
            }
        }
    }
    dateChangedFromPopUp(result: any) {
        this.menuTrigger.closeMenu();
        if (!!this.disabled) {
            return;
        }
        if (result === undefined) {
            return;
        } else if (result !== -1) {
            if (result.length === 1) {
                if (this.dateType !== result[0].selectedDateType) {
                    this.dateType = result[0].selectedDateType;
                }

                if (this.dateType === DateType.AD) {
                    this.dateFormat = this.dateFormatAD;
                    this.dateinput.dateFormat = this.dateFormat;
                    this.myValue = result[0].dateAD;
                } else {
                    this.dateFormat = this.dateFormatBS;
                    this.dateinput.dateFormat = this.dateFormat;
                    this.myValue = result[0].dateBS;
                }
                this._dateAD = result[0].dateAD;
                this._dateBS = result[0].dateBS;
                this.data = result[0].date;
                this.errorState = false;
                this.dateinput.errorState = false;
                this.propagateChange(this.data);
                this.onDateChanged.emit({ selectedDate: this.getFullObject() });
                this.stateChanges.next();
            }
        }
    }
    dateChange(newDate: string) {

        let isError = true;
        this.myValue = newDate;
        this.errorMessage = this.caption.invalidMessage[this.language];
        if (!!this.required) {
            if (!!this.withTime) {
                if (this.myValue.length !== 18) {
                    isError = true;
                } else {
                    isError = false;
                }
            } else {
                if (this.myValue.length === 10) {
                    isError = false;
                } else {
                    isError = true;
                }
            }
        } else {
            if (this.myValue.length === 0) {
                this._dateBS = '';
                this._dateAD = '';
                this.data = null;
                isError = false;
            } else {
                if (!!this.withTime) {
                    if (this.myValue.length !== 18) {
                        isError = true;
                    } else {
                        isError = false;
                    }
                } else {
                    if (this.myValue.length === 10) {
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
            if (!this.errorState) {
                this.data = null;
                this._dateAD = '';
                this._dateBS = '';
                this.errorState = true;
                this.propagateChange(this.data);
                this.ngControl.control.setErrors({ 'incorrect': true });
                this.onDateChanged.emit({ selectedDate: this.getEmptyObject() });

            }
        } else {
            this.errorState = false;
            this.propagateChange(this.data);
            this.onDateChanged.emit({ selectedDate: this.getFullObject() });
        }
    }

    private getFullObject(): any {
        const ob: ISelectedDate = {
            date: this.data,
            dateAD: this.dateAD,
            dateBS: this.dateBS, selectedDateType: this.dateType
        };
        return ob;
    }

    private getEmptyObject(): any {
        const ob: ISelectedDate = { date: null, dateAD: '', dateBS: '', selectedDateType: null };
        return ob;
    }
    getITimeFormat() {
        let _time: ITimeFormat;
        if (!!this.withTime) {
            let tm = this.dateAD.split('   ');
            if (tm.length > 1) {
                tm = tm[1].split(':');
                _time = { hour: +tm[0], minute: + tm[1] };
            } else {
                _time = { hour: 0, minute: 0 };
            }
        }
        return _time;
    }

    private setDateValue(dtValue: string, dtFormat: DateFormat, dtType: DateType): boolean {
        this._dateAD = '';
        this._dateBS = '';
        let dateArray: string[];
        let dateValue: string;
        let timeValue: string;
        let newDate: Date;
        let newTime = '';
        let dArray: string[] | (string | number)[];
        if (!!this.withTime) {
            dateArray = dtValue.split('   ');
            dateValue = dateArray[0];
            timeValue = dateArray[1];
        } else {
            dateValue = dtValue.substr(0, 10);
        }
        dArray = dateValue.split('-');

        let yr: number; let mn: number; let dy: number; let hr = 0; let mu = 0;
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
                this._dateAD = this.dpService.GetFormatedDateAD(newDate, this.dateFormatAD) + newTime;
                this._dateBS = this.dpService.GetDateBS(newDate, this.dateFormatBS);
                if (this._dateBS != null) {
                    this._dateBS = this._dateBS + newTime;
                }
                this.myValue = this.dateAD;
            } else {
                newDate = this.dpService.GetDateAD(yr, mn, dy);
                if (newDate === null) {
                    this.errorMessage = this.language === 0 ? 'BS Calendar not match!' : 'नेपाली क्यालेन्डर अनुसार गते मिलेन।';
                    return false;
                }
                this._dateAD = this.dpService.GetFormatedDateAD(newDate, this.dateFormatAD) + newTime;
                this._dateBS = this.dpService.GetDateBS(newDate, this.dateFormatBS) + newTime;
                newDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hr, mu);
                this.myValue = this.dateBS;
            }
            this.data = newDate;
            if (newDate < this.minimumDate || newDate > this.maximumDate) {
                if (this.language === 0) {
                    this.errorMessage = `Date not in range  ${this.dpService.GetFormatedDateAD(this.minimumDate,
                        this.dateFormatAD)}  to ${this.dpService.GetFormatedDateAD(this.maximumDate, this.dateFormatAD)}`;
                } else {
                    this.errorMessage = `गतेकाे सिमा  ${this.dpService.GetFormatedDateAD(this.minimumDate,
                        this.dateFormatAD)}  देखि ${
                        this.dpService.GetFormatedDateAD(this.maximumDate, this.dateFormatAD)
                        } सम्म हुनु पर्नेछ।`;
                }
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    private getIDateFormat(dtype: DateType) {
        let dformat: DateFormat;
        let date: string;
        if (this.data == null) {
            this.setInitialDate();
        }
        if (dtype === DateType.AD) {
            dformat = this.dateFormatAD;
            date = this.dateAD;
        } else {
            dformat = this.dateFormatBS;
            date = this.dateBS;
        }
        let datearray: string[];
        let datevalue: string;
        let timevalue: string;
        let darray: any[] | string[];
        if (!!this.withTime) {
            datearray = date.split('   ');
            datevalue = datearray[0];
            timevalue = datearray[1];
        } else {
            datevalue = date.substr(0, 10);
        }
        darray = datevalue.split('-');
        let yr: number; let mn: number; let dy: number;
        if (dformat === DateFormat.MMddyyyy) {
            yr = darray[2]; mn = darray[0]; dy = darray[1];
        } else if (dformat === DateFormat.ddMMyyyy) {
            yr = darray[2]; mn = darray[1]; dy = darray[0];
        } else if (dformat === DateFormat.yyyyddMM) {
            yr = darray[0]; mn = darray[2]; dy = darray[1];
        } else if (dformat === DateFormat.yyyyMMdd) {
            yr = darray[0]; mn = darray[1]; dy = darray[2];
        }

        const spliteddate: IDateFormat = { year: yr, month: mn, day: dy, format: dformat };

        return spliteddate;


    }



    onMenuClosed(): void {
        setTimeout(() => {
            this.currentDate = null;
        });
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

    public showPicker() {
        if (this.isPickerVisible) {
            return;
        }
        this.isPickerVisible = true;
        this._afterButtonClick = true;
        this.currentDate = this.data ? this.data : new Date();
        if (this.withTime) {
            this.closeOnClick = false;
        }
        this.calPopUp.showCalendar(
            this.dateType,
            this.dateFormatAD,
            this.dateFormatBS,
            this.withTime,
            this.minimumDate,
            this.maximumDate,
            this.closeOnClick,
            this.currentDate,
            this.language);
        this.menuTrigger.openMenu();
    }

    changeDateType() {
        this._afterButtonClick = true;
        if (this.dateBS === null) {
            return;
        }
        if (this.dateType === DateType.AD) {
            this.dateType = DateType.BS;
            this.dateFormat = this.dateFormatBS;
            this.dateinput.dateFormat = this.dateFormat;
            // setTimeout(() => {
            this.myValue = this.dateBS;
            // }, 5);
            this.changeDateTooltip = this.caption.switchToAD[this.language];
            this.showCalendarTooltip = this.caption.showBSCalendar[this.language];

        } else {
            this.dateType = DateType.AD;
            this.dateFormat = this.dateFormatAD;
            this.dateinput.dateFormat = this.dateFormat;
            // setTimeout(() => {
            this.myValue = this.dateAD;
            // }, 5);
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
            this.data = null;
            this.propagateChange(this.data);
            this.onDateChanged.emit({ selectedDate: this.getEmptyObject() });
        }

        if (!!this.required) {
            this.errorMessage = this.placeHolder + this.caption.dateRequiredLabel[this.language];
            this.errorState = true;
            this.ngControl.control.setErrors({ 'incorrect': true });
        } else {
            this.errorState = false;
        }
        this.stateChanges.next();
    }
}
