import { Injectable } from '@angular/core';
import { Month, Day, INMothCal, INDateD, DateFormat } from '../model/calendar.model';
import { NDateD, BSADCal } from '../data/calendar.data';

@Injectable()
export class CalendarService {

    constructor() { }

    public GetBSMonthList() {
        const monthList: Month[] = [
            { 'month': 'बैशाख', 'id': 1 },
            { 'month': 'जेष्ठ', 'id': 2 },
            { 'month': 'असार', 'id': 3 },
            { 'month': 'श्रावण', 'id': 4 },
            { 'month': 'भाद्र', 'id': 5 },
            { 'month': 'आश्विन', 'id': 6 },
            { 'month': 'कार्तिक', 'id': 7 },
            { 'month': 'मंसीर', 'id': 8 },
            { 'month': 'पुष', 'id': 9 },
            { 'month': 'माघ', 'id': 10 },
            { 'month': 'फाल्गुन', 'id': 11 },
            { 'month': 'चैत्र', 'id': 12 }
        ];
        return monthList;
    }


    public getFiscalYear(date: Date) {
        const bsDate = this.GetDateBS(date, DateFormat.MMddyyyy);
        const bsMonth = this.GetBSMonth(bsDate, DateFormat.MMddyyyy);
        const bsYear = this.GetBSYear(bsDate, DateFormat.MMddyyyy);
        let result: string;
        if (bsMonth <= 3) {
            result = (bsYear - 1).toString().substring(2) + '।' + bsYear.toString().substring(2);
        } else {
            result = bsYear.toString().substring(2) + '।' + (bsYear + 1).toString().substring(2);
        }
        return result;
    }
    public GetADMonthList() {
        const monthList: Month[] = [
            { 'month': 'January', 'id': 1 },
            { 'month': 'February', 'id': 2 },
            { 'month': 'March', 'id': 3 },
            { 'month': 'April', 'id': 4 },
            { 'month': 'May', 'id': 5 },
            { 'month': 'June', 'id': 6 },
            { 'month': 'July', 'id': 7 },
            { 'month': 'August', 'id': 8 },
            { 'month': 'September', 'id': 9 },
            { 'month': 'October', 'id': 10 },
            { 'month': 'November', 'id': 11 },
            { 'month': 'December', 'id': 12 }
        ];
        return monthList;
    }

    public GetBSMonthName(monthId: number) {
        const monthname: Month[] = this.GetBSMonthList().filter(x => x.id === monthId);
        if (monthname.length > 0) {
            return monthname[0].month;
        } else {
            return null;
        }

    }

    public GetADMonthName(monthId: number) {

        const monthname: Month[] = this.GetADMonthList().filter(x => x.id === monthId);
        if (monthname.length > 0) {
            return monthname[0].month;
        } else {
            return null;
        }

    }

    public GetWeekDayName(dayId: number) {

        const weekDay: Day[] = this.GetWeekDayNameList().filter(x => x.id === dayId);
        if (weekDay.length > 0) {
            return weekDay[0].day;
        } else {
            return null;
        }


    }

    public GetWeekDayNameList() {
        const dayList: Day[] = [
            { 'day': 'Sunday', 'nepaliDay': 'आइतबार', 'id': 1 },
            { 'day': 'Monday', 'nepaliDay': 'साेमबार', 'id': 2 },
            { 'day': 'Tuesday', 'nepaliDay': 'मंगलबार', 'id': 3 },
            { 'day': 'Wednesday', 'nepaliDay': 'बुधबार', 'id': 4 },
            { 'day': 'Thursday', 'nepaliDay': 'बिहिबार', 'id': 5 },
            { 'day': 'Friday', 'nepaliDay': 'शुक्रबार', 'id': 6 },
            { 'day': 'Saturday', 'nepaliDay': 'शनिबार', 'id': 7 },
        ];
        return dayList;
    }

    public GetWeekDayPrefixList() {
        const dayList: Day[] = [
            { 'day': 'Su', 'nepaliDay': 'आ.', 'id': 1 },
            { 'day': 'Mo', 'nepaliDay': 'साे.', 'id': 2 },
            { 'day': 'Tu', 'nepaliDay': 'मं.', 'id': 3 },
            { 'day': 'We', 'nepaliDay': 'बु.', 'id': 4 },
            { 'day': 'Th', 'nepaliDay': 'बि.', 'id': 5 },
            { 'day': 'Fr', 'nepaliDay': 'शु.', 'id': 6 },
            { 'day': 'Sa', 'nepaliDay': 'श.', 'id': 7 },
        ];
        return dayList;
    }

    public GetBSYearCal(NYear: number): INMothCal[] {
        const bsMonthList: INMothCal[] = [];
        const selectedNDateD: INDateD = NDateD.filter(x => x.NYear === NYear)[0];
        let days = 0;

        days = days + selectedNDateD.M1;
        bsMonthList.push({ Month: 1, Days: days });
        days = days + selectedNDateD.M2;
        bsMonthList.push({ Month: 2, Days: days });
        days = days + selectedNDateD.M3;
        bsMonthList.push({ Month: 3, Days: days });
        days = days + selectedNDateD.M4;
        bsMonthList.push({ Month: 4, Days: days });
        days = days + selectedNDateD.M5;
        bsMonthList.push({ Month: 5, Days: days });
        days = days + selectedNDateD.M6;
        bsMonthList.push({ Month: 6, Days: days });
        days = days + selectedNDateD.M7;
        bsMonthList.push({ Month: 7, Days: days });
        days = days + selectedNDateD.M8;
        bsMonthList.push({ Month: 8, Days: days });
        days = days + selectedNDateD.M9;
        bsMonthList.push({ Month: 9, Days: days });
        days = days + selectedNDateD.M10;
        bsMonthList.push({ Month: 10, Days: days });
        days = days + selectedNDateD.M11;
        bsMonthList.push({ Month: 11, Days: days });
        days = days + selectedNDateD.M12;
        bsMonthList.push({ Month: 12, Days: days });

        return bsMonthList;
    }

    public GetBSDay(bsDate: string, df: DateFormat) {
        let result: number;

        const bsDateArray: string[] = bsDate.split('-');

        switch (df) {
            case 'ddMMyyyy': // ddmmyyyy
                result = Number(bsDateArray[0]);
                break;
            case 'MMddyyyy': // mmddyyyy
                result = Number(bsDateArray[1]);
                break;
            case 'yyyyddMM': // yyyyddmm
                result = Number(bsDateArray[1]);
                break;
            case 'yyyyMMdd': // yyyymmdd
                result = Number(bsDateArray[2]);
                break;
        }
        return result;
    }

    public GetBSMonth(bsDate: string, df: DateFormat) {
        let result: number;

        const bsDateArray: string[] = bsDate.split('-');

        switch (df) {
            case 'ddMMyyyy': // ddmmyyyy
                result = Number(bsDateArray[1]);
                break;
            case 'MMddyyyy': // mmddyyyy
                result = Number(bsDateArray[0]);
                break;
            case 'yyyyddMM': // yyyyddmm
                result = Number(bsDateArray[2]);
                break;
            case 'yyyyMMdd': // yyyymmdd
                result = Number(bsDateArray[1]);
                break;
        }
        return result;
    }

    public GetBSYear(bsDate: string, df: DateFormat) {
        let result: number;

        const NDateArray: string[] = bsDate.split('-');

        switch (df) {
            case 'ddMMyyyy': // ddmmyyyy
                result = Number(NDateArray[2]);
                break;
            case 'MMddyyyy': // mmddyyyy
                result = Number(NDateArray[2]);
                break;
            case 'yyyyddMM': // yyyyddmm
                result = Number(NDateArray[0]);
                break;
            case 'yyyyMMdd': // yyyymmdd
                result = Number(NDateArray[0]);
                break;
        }
        return result;
    }

    public GetMaxYear(): number {
        return Math.max.apply(Math, BSADCal.map(function (o) { return o.NYear; }));
    }
    public GetMinYear(): number {
        return Math.min.apply(Math, BSADCal.map(function (o) { return o.NYear; }));
    }

    public GetDateBS(adDate: Date, df: DateFormat): any {
        let startDate: Date;
        let bsYear: number;
        let bsMonth: number;
        let bsDay: number;
        adDate = new Date(adDate.getFullYear(), adDate.getMonth(), adDate.getDate());
        try {
            startDate = new Date(BSADCal.filter(x => new Date(x.EndDate) >= adDate && new Date(x.StartDate) <= adDate)[0].StartDate);
            bsYear = BSADCal.filter(x => new Date(x.EndDate) >= adDate && new Date(x.StartDate) <= adDate)[0].NYear;
            const totalDays: number = this.GetDateDiff(adDate, startDate) + 1;
            bsMonth = this.GetBSYearCal(bsYear).filter(x => x.Days >= totalDays)[0].Month;
            const dyList = this.GetBSYearCal(bsYear).filter(x => x.Days < totalDays).reverse()[0];
            if (dyList) {
                bsDay = dyList.Days;
            }
            bsDay = totalDays - (bsDay === undefined ? 0 : bsDay);
        } catch (e) {
            return null;

        }

        return this.GetFormatedDateBS(bsYear, bsMonth, bsDay, df);
    }

    public GetDateAD(bsYear: number, bsMonth: number, bsDay: number): Date {
        let adDate: Date = new Date();
        let totalDays = 0;
        const ndateD = NDateD.filter(x => x.NYear === bsYear);
        if (ndateD.length === 0) {
            return null;
        }
        if (bsMonth < 1 || bsMonth > 12) {
            return null;
        }

        if (this.GetDaysInMonthBS(bsYear, bsMonth) < bsDay) {
            return null;
        }

        adDate = new Date(BSADCal.filter(x => x.NYear === bsYear)[0].StartDate);
        const listMonth: INMothCal[] = this.GetBSYearCal(bsYear).filter(x => x.Month < bsMonth);
        totalDays = listMonth.length > 0 ? listMonth.reverse()[0].Days : 0;
        totalDays = totalDays ? totalDays : 0;
        totalDays = totalDays + bsDay - 1;
        totalDays = (totalDays * 24 * 3600 * 1000);
        totalDays += adDate.getTime();

        adDate.setTime(totalDays);
        return adDate;
    }

    public GetDateADByDateBS(bsDate: string, df: DateFormat): Date {
        let adDate: Date;
        let totalDays = 0;
        const bsYear: number = this.GetBSYear(bsDate, df);
        const bsMonth: number = this.GetBSYear(bsDate, df);
        const bsDay: number = this.GetBSYear(bsDate, df);

        if (
            NDateD.filter(x => x.NYear).length === 0 &&
            bsMonth < 1 && bsMonth > 12 &&
            this.GetDaysInMonthBS(bsYear, bsMonth) < bsDay
        ) {
            return null;
        }

        adDate = new Date(BSADCal.filter(x => x.NYear === bsYear)[0].StartDate);
        totalDays = this.GetBSYearCal(bsYear).filter(x => x.Month === bsMonth)[0].Days;
        totalDays = totalDays + bsDay - 1;
        totalDays = (totalDays * 24 * 3600 * 1000);
        totalDays += adDate.getTime();

        adDate.setTime(totalDays);
        return adDate;
    }

    public GetDateADOfMonthStartEnd(bsDate: string, isStart: boolean, df: DateFormat) {
        const bsYear: number = this.GetBSYear(bsDate, df);
        const bsMonth: number = this.GetBSMonth(bsDate, df);
        const bsDay: number = this.GetBSDay(bsDate, df);

        let daysInMonth = 0;
        let adDate: Date = new Date();

        if (isStart) {
            adDate = this.GetDateAD(bsDay, bsMonth, 1);
        } else {
            daysInMonth = this.GetDaysInMonthBS(bsYear, bsMonth);
            adDate = this.GetDateAD(bsYear, bsMonth, daysInMonth);
        }

        return adDate;
    }

    public GetDaysInMonthBS(bsYear: number, bsMonth: number): number {
        switch (bsMonth) {
            case 1:
                return NDateD.filter(x => x.NYear === bsYear)[0].M1;
            case 2:
                return NDateD.filter(x => x.NYear === bsYear)[0].M2;
            case 3:
                return NDateD.filter(x => x.NYear === bsYear)[0].M3;
            case 4:
                return NDateD.filter(x => x.NYear === bsYear)[0].M4;
            case 5:
                return NDateD.filter(x => x.NYear === bsYear)[0].M5;
            case 6:
                return NDateD.filter(x => x.NYear === bsYear)[0].M6;
            case 7:
                return NDateD.filter(x => x.NYear === bsYear)[0].M7;
            case 8:
                return NDateD.filter(x => x.NYear === bsYear)[0].M8;
            case 9:
                return NDateD.filter(x => x.NYear === bsYear)[0].M9;
            case 10:
                return NDateD.filter(x => x.NYear === bsYear)[0].M10;
            case 11:
                return NDateD.filter(x => x.NYear === bsYear)[0].M11;
            case 12:
                return NDateD.filter(x => x.NYear === bsYear)[0].M12;
            default:
                return 0;
        }
    }

    public GetDaysInMonthAD(adYear: number, adMonth: number): number {
        let daysInMonth: number;
        const adDate: Date = new Date(adYear, adMonth, 1);

        const date1: Date = adDate;
        date1.setDate(1 - date1.getDate());

        const date2: Date = adDate;
        date2.setDate(1 - date2.getDate());

        daysInMonth = (1 + this.GetDateAdd(date2, adDate)) - this.GetDateAdd(date1, adDate);

        return daysInMonth;
    }

    public GetFormatedDateAD(adDate: Date, dtFormat: DateFormat) {
        const yy: string = adDate.getFullYear().toString();
        const mm: string = (adDate.getMonth() + 1 < 10) ? '0' + (adDate.getMonth() + 1).toString() : (adDate.getMonth() + 1).toString();
        const dd: string = (adDate.getDate() < 10) ? '0' + (adDate.getDate()).toString() : (adDate.getDate()).toString();
        switch (dtFormat) {
            case 'ddMMyyyy':
                return dd + '-' + mm + '-' + yy;
            case 'MMddyyyy':
                return mm + '-' + dd + '-' + yy;
            case 'yyyyddMM': // yyyyddmm
                return yy + '-' + dd + '-' + mm;
            case 'yyyyMMdd': // yyyymmdd
                return yy + '-' + mm + '-' + dd;
            default: // ddmmyyyy
                return dd + '-' + mm + '-' + yy;
        }
    }
    public GetFormatedDateBS(bsYear: number, bsMonth: number, bsDay: number, dtFormat: DateFormat): string {
        const yy: string = bsYear.toString();
        const mm: string = (bsMonth < 10) ? '0' + bsMonth : bsMonth.toString();
        const dd: string = (bsDay < 10) ? '0' + bsDay : bsDay.toString();

        switch (dtFormat) {
            case 'ddMMyyyy':
                return dd + '-' + mm + '-' + yy;
            case 'MMddyyyy':
                return mm + '-' + dd + '-' + yy;
            case 'yyyyddMM': // yyyyddmm
                return yy + '-' + dd + '-' + mm;
            case 'yyyyMMdd': // yyyymmdd
                return yy + '-' + mm + '-' + dd;
            default: // ddmmyyyy
                return dd + '-' + mm + '-' + yy;
        }
    }

    private GetDaysInYear(bsYear: number) {
        let totalDays = 0;
        NDateD.filter(x => x.NYear < bsYear).forEach(item => {
            totalDays += item.M1 + item.M2 + item.M3 + item.M4 + item.M5 + item.M6;
            totalDays += item.M7 + item.M8 + item.M9 + item.M10 + item.M11 + item.M12;
        });

        return totalDays;
    }

    private GetDateAdd(date1: Date, date2: Date): number {
        const timeAdd = date2.getTime() + date1.getTime();
        return Math.ceil(Math.abs(timeAdd / (1000 * 3600 * 24)));
    }

    private GetDateDiff(date1: Date, date2: Date): number {
        const timeDiff = date2.getTime() - date1.getTime();
        return Math.ceil(Math.abs(timeDiff / (1000 * 3600 * 24)));
    }

    public addYearInBS(bsDate: string, addYear: number, df: DateFormat) {
        let year = this.GetBSYear(bsDate, df);
        let month = this.GetBSMonth(bsDate, df);
        let day = this.GetBSDay(bsDate, df);
        const oldDaysInMonth = this.GetDaysInMonthBS(year, month);
        year = year + addYear;

        if (day === 1) {
            if (month === 1) {
                month = 12;
                year = year - 1;
            } else {
                month = month - 1;
            }
            day = this.GetDaysInMonthBS(year, month);

        } else {
            if (oldDaysInMonth === day) {
                day = this.GetDaysInMonthBS(year, month) - 1;
            } else {
                day = day - 1;
                if (day >= this.GetDaysInMonthBS(year, month)) {
                    day = this.GetDaysInMonthBS(year, month) - 1;
                }
            }
        }
        return this.GetDateAD(year, month, day);
    }
}
