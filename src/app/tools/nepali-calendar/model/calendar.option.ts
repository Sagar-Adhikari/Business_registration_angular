
import { DateFormat, DateType, Language } from './calendar.model';

export interface ISelectedDate {
    dateAD: string;
    dateBS: string;
    date: Date;
    selectedDateType: DateType;
}

export interface IDatePickerOption {
    language: Language;
    dateType: DateType;
    dateFormatAD: DateFormat;
    dateFormatBS: DateFormat;
    maxDate: Date;
    minDate: Date;
    withTime: boolean;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    closeOnClick: boolean;
    showCalendarOnFocus: boolean;
    fromDate?: Date;
    toDate?: Date;
}

// export interface IDatePIckerRangeOption {
//     dateType: DateType;
//     withTime: boolean;
//     dateFormatAD: DateFormat;
//     dateFormatBS: DateFormat;
//     maxDate: Date;
//     minDate: Date;
//     placeholder: string;
//     disabled: boolean;
//     required: boolean;
//     fromDate: Date;
//     toDate: Date;
//     closeOnClick: boolean;
// }

