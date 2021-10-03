import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { IDatePickerOption, DateFormat, DateType, Language } from '../tools/nepali-calendar';
import { environment } from 'src/environments/environment';
import { ParamValue } from './data-model';


export interface Parameter {
  CompanyName: string;
  WardNo: number;
  perSquareFeetRate: number;
  AllowApplicationFee: boolean;
  ApplicationFeeValue: number;
  AllowRegistrationFee: boolean;
  RegistrationFeeValue: number;
  IsFiscalYearRenew: boolean;
  AllowAccessToVerifyToUser: boolean;
  AllowAccessToEditVerifiedDataToUser: boolean;
  IsCertificateNoFromSystemGenerated: boolean;
  ResetBillNoAfterFYChange: boolean;
  PrefixOfCertificateNo: string;
  AllowPenalty: boolean;
  PenaltyValue: number;
  ImagePath: string;
  DefaultState: number;
  DefaultDistrict: number;
  DefaultCity: number;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) {
    this.getGreetings();
  }
  private _paramValue: Parameter = {
    AllowAccessToEditVerifiedDataToUser: false,
    AllowAccessToVerifyToUser: false,
    AllowApplicationFee: false,
    AllowPenalty: false,
    AllowRegistrationFee: false,
    ApplicationFeeValue: 0,
    CompanyName: 'राेशी गाँउपालिका',
    DefaultCity: 0,
    DefaultDistrict: 0,
    DefaultState: 0,
    ImagePath: '',
    IsCertificateNoFromSystemGenerated: true,
    IsFiscalYearRenew: true,
    PenaltyValue: 0,
    PrefixOfCertificateNo: '',
    RegistrationFeeValue: 0,
    ResetBillNoAfterFYChange: true,
    WardNo: 0,
    perSquareFeetRate: 0
  };
  private _loading = false;
  private _pageTitle: string;
  private pageTitleSource = new BehaviorSubject<any>('');
  private loadingSource = new BehaviorSubject<boolean>(false);
  private greetingTitle = new BehaviorSubject<any>('');
  private currentUser = new BehaviorSubject<any>('');
  private parameter = new BehaviorSubject<any>('');

  roleId = 0;


  pageTitle$ = this.pageTitleSource.asObservable();
  loading$ = this.loadingSource.asObservable();
  greetingsTitle$ = this.greetingTitle.asObservable();
  currentUser$ = this.currentUser.asObservable();
  parameter$ = this.parameter.asObservable();

  private _datepickerOption: IDatePickerOption = {
    language: Language.Nepali,
    showCalendarOnFocus: true,
    required: true,
    placeholder: 'Date',
    dateType: DateType.BS,
    dateFormatAD: DateFormat.ddMMyyyy,
    dateFormatBS: DateFormat.yyyyMMdd,
    withTime: false,
    disabled: false,
    minDate: new Date(1913, 3, 13),
    maxDate: new Date(new Date().getFullYear() + 100, new Date().getMonth(), new Date().getDate()),
    closeOnClick: true,
  };



  get getDatePickerOption() {
    const dpOption = Object.assign({}, this._datepickerOption);
    return dpOption;
  }

  get ParameterValue(): Parameter {
    return this._paramValue;
  }
  // private _companyName = 'निजगढkjskdl नगरपालिका';
  // get CompanyName() {
  //   return this._companyName;
  // }

  // private _wardNo = 0;
  // get WardNo() {
  //   return this._wardNo;
  // }

  // private _perSquareFeetRate = 0;
  // get perSquareFeetRate() {
  //   return this._perSquareFeetRate;
  // }

  // private _allowApplicationFee = false;
  // get AllowApplicationFee() {
  //   return this._allowApplicationFee;
  // }

  // private _applicationFeeValue = 0;
  // get ApplicationFeeValue() {
  //   return this._applicationFeeValue;
  // }

  // private _allowRegistrationFee = false;
  // get AllowRegistrationFee() {
  //   return this._allowRegistrationFee;
  // }

  // private _registrationFeeValue = 0;
  // get RegistrationFeeValue() {
  //   return this._registrationFeeValue;
  // }

  // private _isFiscalYearRenew = false;
  // get IsFiscalYearRenew() {
  //   return this._isFiscalYearRenew;
  // }

  // private _allowAccessToVerifyToUser = false;
  // get AllowAccessToVerifyToUser() {
  //   return this._allowAccessToVerifyToUser;
  // }

  // private _allowAccessToEditVerifiedDataToUser = false;
  // get AllowAccessToEditVerifiedDataToUser() {
  //   return this._allowAccessToEditVerifiedDataToUser;
  // }

  // private _isCertificateNoFromSystemGenerated = false;
  // get IsCertificateNoFromSystemGenerated() {
  //   return this._isCertificateNoFromSystemGenerated;
  // }

  // private _resetBillNoAfterFYChange = false;
  // get ResetBillNoAfterFYChange() {
  //   return this._resetBillNoAfterFYChange;
  // }

  // private _prefixOfCertificateNo = '';
  // get PrefixOfCertificateNo() {
  //   return this._prefixOfCertificateNo;
  // }

  // private _AllowPenalty = false;
  // get AllowPenalty() {
  //   return this._AllowPenalty;
  // }

  // private _penaltyValue = 0;
  // get PenaltyValue() {
  //   return this._penaltyValue;
  // }

  // private _imagePath = '';
  // get ImagePath() {
  //   return this._imagePath;
  // }

  // private _defaultState = 0;
  // get DefaultState() {
  //   return this._defaultState;
  // }

  // private _defaultDistrict = 0;
  // get DefaultDistrict() {
  //   return this._defaultDistrict;
  // }

  // private _defaultCity = 0;
  // get DefaultCity() {
  //   return this._defaultCity;
  // }

  refreshParameter() {
    this.parameter.next(this._paramValue);
  }
  loadProperties(data: ParamValue[]) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].paramCode === '00001') {
        this._paramValue.perSquareFeetRate = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00002') {
        this._paramValue.AllowApplicationFee = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00003') {
        this._paramValue.ApplicationFeeValue = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00004') {
        this._paramValue.AllowRegistrationFee = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00005') {
        this._paramValue.RegistrationFeeValue = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00006') {
        this._paramValue.IsFiscalYearRenew = data[i].defaultValue === null ? false : data[i].defaultValue.toString() === '1' ? true : false;
      } else if (data[i].paramCode === '00007') {
        this._paramValue.AllowAccessToVerifyToUser = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00008') {
        this._paramValue.AllowAccessToEditVerifiedDataToUser = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00009') {
        this._paramValue.IsCertificateNoFromSystemGenerated = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00010') {
        this._paramValue.ResetBillNoAfterFYChange = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00011') {
        this._paramValue.PrefixOfCertificateNo = data[i].defaultValue === null ? '' : data[i].defaultValue.toString();
      } else if (data[i].paramCode === '00013') {
        this._paramValue.CompanyName = data[i].defaultValue === null ? '' : data[i].defaultValue.toString();
      } else if (data[i].paramCode === '00014') {
        this._paramValue.WardNo = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00015') {
        this._paramValue.ImagePath = data[i].defaultValue === null ? '' : data[i].defaultValue;
      } else if (data[i].paramCode === '00016') {
        this._paramValue.AllowPenalty = data[i].defaultValue === 'Yes' ? true : false;
      } else if (data[i].paramCode === '00017') {
        this._paramValue.PenaltyValue = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00018') {
        this._paramValue.DefaultState = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00019') {
        this._paramValue.DefaultDistrict = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      } else if (data[i].paramCode === '00020') {
        this._paramValue.DefaultCity = data[i].defaultValue === null ? 0 : +data[i].defaultValue;
      }
    }
    this.parameter.next(this._paramValue);

    // data.forEach(e => {
    //   if (e.paramCode === '00001') {
    //     this._perSquareFeetRate = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00002') {
    //     this._allowApplicationFee = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00003') {
    //     this._applicationFeeValue = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00004') {
    //     this._allowRegistrationFee = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00005') {
    //     this._registrationFeeValue = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00006') {
    //     this._isFiscalYearRenew = e.defaultValue === null ? false : e.defaultValue.toString() === '1' ? true : false;
    //   } else if (e.paramCode === '00007') {
    //     this._allowAccessToVerifyToUser = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00008') {
    //     this._allowAccessToEditVerifiedDataToUser = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00009') {
    //     this._isCertificateNoFromSystemGenerated = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00010') {
    //     this._resetBillNoAfterFYChange = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00011') {
    //     this._prefixOfCertificateNo = e.defaultValue === null ? '' : e.defaultValue.toString();
    //   } else if (e.paramCode === '00013') {
    //     this._companyName = e.defaultValue === null ? '' : e.defaultValue.toString();
    //   } else if (e.paramCode === '00014') {
    //     this._wardNo = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00015') {
    //     this._imagePath = e.defaultValue === null ? '' : e.defaultValue;
    //   } else if (e.paramCode === '00016') {
    //     this._AllowPenalty = e.defaultValue === 'Yes' ? true : false;
    //   } else if (e.paramCode === '00017') {
    //     this._penaltyValue = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00018') {
    //     this._defaultState = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00019') {
    //     this._defaultDistrict = e.defaultValue === null ? 0 : +e.defaultValue;
    //   } else if (e.paramCode === '00020') {
    //     this._defaultCity = e.defaultValue === null ? 0 : +e.defaultValue;
    //   }
    // });
  }

  setPageTitle(title: string) {
    this.pageTitleSource.next(title);
  }

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // tslint:disable-next-line:no-string-throw
        throw 'Illegal base64url string!';
    }
    return decodeURIComponent((<any>window).escape(window.atob(output)));
  }

  setLoading(loading: boolean) {
    if (this._loading === loading) { return; }

    this._loading = loading;
    setTimeout(() => {
      this.loadingSource.next(loading);
    }, 5);

    this.getGreetings();
  }

  showSuccessMessage(message: string, duration?: number) {
    this.snackBar.open(message, 'Success', {
      duration: duration ? duration : 10000,
      panelClass: ['success-snackbar']
    });
    this.setLoading(false);
  }

  showErrorMessage(message: string, duration?: number) {
    message = message.toString().replace('Error: GraphQL error:', '').replace('GraphQL error:', '');
    this.snackBar.open(message, 'Error', {
      duration: duration ? duration : 10000,
      panelClass: ['error-snackbar']
    });
    this.setLoading(false);
  }

  showInfoMessage(message: string, duration?: number) {
    this.snackBar.open(message, 'Info', {
      duration: duration ? duration : 10000,
    });
    this.setLoading(false);
  }

  showWarningMessage(message: string, duration?: number) {
    this.snackBar.open(message, 'Warning', {
      duration: duration ? duration : 10000,
      panelClass: ['warning-snackbar']
    });
    this.setLoading(false);
  }

  public getGreetings() {
    const dt = new Date();
    const timeZoneOffset = dt.getTimezoneOffset();
    const utc = dt.getTime() + (timeZoneOffset * 60000);
    const timeZone = timeZoneOffset / -60;
    const currentDate = new Date(utc + (3600000 * timeZone));
    const hour = currentDate.getHours();
    let greetings = '';

    if (hour < 3) {
      greetings = 'स्वागतम';
    } else if (hour < 12) {
      greetings = 'शुभ बिहानी';
    } else if (hour < 18) {
      greetings = 'शुभ दिन';
    } else if (hour < 22) {
      greetings = 'शुभ दिन'; // 'शुभ सन्ध्या';
    } else {
      greetings = 'स्वागतम';
    }
    this.greetingTitle.next(greetings);
    return greetings;
  }

  getDate(x: any) {
    const d = new Date(x);
    return d;
  }

  getShortDateWithTime(x: any) {
    const d = new Date(x).toLocaleDateString();
    const t = new Date(x).toLocaleTimeString();
    return d + '  ' + t;
  }

  getShortDateWithoutTime(x: any) {
    const d = new Date(x).toLocaleDateString();
    return d;
  }

  public filter(array: any[], text: string) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.caption.toLowerCase().includes(text)) {
        return true;
      }
      if (!Array.isArray(o.children)) {
        return false;
      }
      temp = o.children.filter(iter);
      if (temp.length) {
        o.children = temp;
        return true;
      }
    });
  }

  /// transfer from authservice
  public getToken() {
    const jwt: string = localStorage.getItem('ni-token') || '';
    const rjwt: string = localStorage.getItem('ni-refresh-token') || '';
    return { token: jwt, refreshToken: rjwt };
  }

  public setToken(jwt: string, refreshJwt: string, user: any) {
    this.roleId = + user.roleId;
    localStorage.setItem('ni-token', jwt);
    localStorage.setItem('ni-refresh-token', refreshJwt);
    localStorage.setItem('ni-user', JSON.stringify(user));
    this.changeUser();
  }

  public clearUser() {
    this.roleId = 0;
    localStorage.removeItem('ni-token');
    localStorage.removeItem('ni-refresh-token');
    localStorage.removeItem('ni-user');
    this.changeUser();
  }

  isLoggedIn() {
    let result = false;
    const token: any = localStorage.getItem('ni-refresh-token') || null;
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        const decoded = JSON.parse(this.urlBase64Decode(parts[1]));
        const current_time = new Date().getTime() / 1000;
        if (current_time < decoded.exp) {
          result = true;
        } else {
          this.clearUser();
        }
      }
    }
    return result;
  }


  getCurrentUser() {
    if (this.isLoggedIn()) {
      const storedUser = localStorage.getItem('ni-user') || null;
      const user: any = JSON.parse(storedUser) || null;
      return user;
    } else {
      return null;
    }
  }
  changeUser() {
    if (this.isLoggedIn()) {
      const storedUser = localStorage.getItem('ni-user') || null;
      const user: any = JSON.parse(storedUser) || null;
      this.currentUser.next(user);
    } else {
      this.roleId = 0;
      this.currentUser.next(null);
    }
  }
}
