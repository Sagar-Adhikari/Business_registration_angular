export enum DateFormat {
    ddMMyyyy = 'ddMMyyyy',
    MMddyyyy = 'MMddyyyy',
    yyyyMMdd = 'yyyyMMdd',
    yyyyddMM = 'yyyyddMM'
}

export enum DateType {
    AD = 1,
    BS = 2
}

export enum Language {
    English = 0,
    Nepali = 1
}
export enum CalendarViewType {
    Both = 1,
    Year = 2,
    Month = 3
}
export interface IDateFormat {
    year: number;
    month: number;
    day: number;
    format: DateFormat;
}
export interface ITimeFormat {
    hour: number;
    minute: number;
}
export interface IDate {
    DateAD: IDateFormat;
    DateBS: IDateFormat;
    time: ITimeFormat;
    datetype: DateType;
    weekDayId: number;
    weekDayName: string;
    maxDate: Date;
    minDate: Date;
    today: Date;
    selectedDate: IDateFormat;
    selectedTime: ITimeFormat;
}

// export interface IDateVM {
//     currentDate: Date;
//     //  formatDateBS: DateFormat;
//     //  formatDateAD: DateFormat;
//     currentTime: ITimeFormat;
//     dateType: DateType;
//     minDate: Date;
//     maxDate: Date;
//     //  closeOnClick: boolean;
//     //  isRange: boolean;
// }

export class Month {
    id: number;
    month: string;
}
export class Day {
    id: number;
    day: string;
    nepaliDay: string;
}


export interface INDateD {
    M1: number;
    M2: number;
    M3: number;
    M4: number;
    M5: number;
    M6: number;
    M7: number;
    M8: number;
    M9: number;
    M10: number;
    M11: number;
    M12: number;
    NYear: number;
}

export interface IBSADCal {
    NYear: number;
    StartDate: any;
    EndDate: any;
}

export interface INMothCal {
    Month: number;
    Days: number;
}
