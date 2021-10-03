import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  EventEmitter,
  Output,
  HostBinding,
  forwardRef,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { Subject } from 'rxjs';
import { DateFormat } from '../../model/calendar.model';
import { NG_VALIDATORS } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'date-input-range',
  templateUrl: './date-input-range.component.html',
  styleUrls: ['./date-input-range.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => DateInputRangeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateInputRangeComponent),
      multi: true,
    }],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
    '[attr.aria-label]': 'label',
  }
})


export class DateInputRangeComponent implements MatFormFieldControl<string>, OnDestroy {
  static nextId = 0;
  @HostBinding() id = `date-input-range-${DateInputRangeComponent.nextId++}`;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDateChanged = new EventEmitter<any>();
  @Output() controlGotFocus = new EventEmitter<any>();


  myValue = '';
  private _errorState = false;

  private _placeholder: string;
  private _required = false;
  private _disabled = false;
  private _dateFormat: DateFormat = DateFormat.ddMMyyyy;
  private _withTime = true;

  stateChanges = new Subject<void>();
  controlType = 'date-input-range';
  focused = false;
  ngControl = null;
  maxLength = 21;
  mask = '39-09-2999 / 39-09-2999';
  contronPlaceHolder = 'dd-MM-yyyy / dd-MM-yyyy';
  describedBy = '';

  patterns = {
    '9': { pattern: new RegExp(/[0-9]/) },   // all d2 M2 h2 h3 h4 H2 m2
    '3': { pattern: new RegExp(/[0-3]/) },    // d1
    '0': { pattern: new RegExp(/[0-1]/) },    // M1
    '1': { pattern: new RegExp(/[0-2]/) },   // H1
    '2': { pattern: new RegExp(/[1-2]/) },   // y1
    '5': { pattern: new RegExp(/[0-5]/) },   // m1
  };


  constructor(
    private fm: FocusMonitor,
    private elRef: ElementRef) {
    fm.monitor(elRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }


  focus(type: number) {
    this.elRef.nativeElement.querySelector('input').focus();
    if (+type === 1) {
      this.controlGotFocus.emit();
    }
  }

  onChange(event: any) {

    let newValue: string;
    if (event.type === 'change' || event.type === 'paste') {
      if (event.type === 'change') {
        newValue = event.target.value;
      } else {
        newValue = event.clipboardData.getData('Text');
      }
      if (newValue !== this.myValue) {
        this.myValue = newValue;
        this.onDateChanged.emit(this.myValue);

      }
    } else if (event.type === 'keyup') {
      if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        event.keyCode === 8 ||
        event.keyCode === 46 ||
        event.keyCode === 32) {
        newValue = event.target.value;
        if (newValue !== this.myValue) {
          this.myValue = newValue;
          this.onDateChanged.emit(this.myValue);

        }
      }
    }
  }



  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }


  get empty() {
    return !this.myValue;
  }

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }


  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @Input()
  get errorState() {
    return this._errorState;
  }
  set errorState(state: boolean) {
    this._errorState = state;
    this.stateChanges.next();
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();

  }

  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  @Input()
  get dateFormat() {
    return this._dateFormat;
  }
  set dateFormat(df: DateFormat) {
    this._dateFormat = df;
    this.setLenthAndMask();
    this.stateChanges.next();
  }

  @Input()
  get withTime() {
    return this._withTime;
  }
  set withTime(isWithTime: boolean) {
    this._withTime = isWithTime;
    this.setLenthAndMask();
    this.stateChanges.next();
  }

  @Input()
  get value(): string | null {
    return this.myValue;
  }
  set value(val: string | null) {
    this.setLenthAndMask();
    setTimeout(() => {
      this.myValue = val;
    }, 10);
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
      this.focus(1);
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }


  // '10/20/4000   30:50' dd/mm/yyyy hh:mm
  // '90': { pattern: new RegExp(/[0-9]/) },   //all d2 M2 h2 h3 h4 H2 m2
  // '31': { pattern: new RegExp(/[0-3]/)},    //d1
  // '02': { pattern: new RegExp(/[0-1]/)},    //M1
  // '13': { pattern: new RegExp(/[0-2]/)},   //H1
  // '24': { pattern: new RegExp(/[1-2]/)},   //y1
  // '5': { pattern: new RegExp(/[0-5]/)},   //m1
  setLenthAndMask() {
    let dateMask = '';
    let maxLn = 23;
    let ph = '';
    if (this._dateFormat === DateFormat.ddMMyyyy) {
      dateMask = '39-09-2999';
      ph = 'dd-MM-yyyy';
    } else if (this._dateFormat === DateFormat.MMddyyyy) {
      dateMask = '09-39-2999';
      ph = 'MM-dd-yyyy';
    } else if (this._dateFormat === DateFormat.yyyyddMM) {
      dateMask = '2999-39-09';
      ph = 'yyyy-dd-MM';
    } else if (this._dateFormat === DateFormat.yyyyMMdd) {
      dateMask = '2999-09-39';
      ph = 'yyyy-MM-dd';
    }

    if (this._withTime) {
      maxLn = maxLn + 16;
      ph = ph + '   hh:mm';
      dateMask = dateMask + '   19:59';
    }
    this.contronPlaceHolder = ph + ' / ' + ph;
    this.maxLength = maxLn;
    dateMask = dateMask + ' / ' + dateMask;
    this.mask = dateMask;
  }

}
