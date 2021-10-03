import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as G from './graph.gql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GraphService {
  constructor(private apollo: Apollo) { }
  // public getStatusWiseCount() {
  //   return this.apollo
  //     .query<any>({
  //       query: G.getStatusWiseCount,
  //       fetchPolicy: 'no-cache'
  //     }).pipe(
  //       map((res): any => {
  //         return res.data.result;
  //       })
  //     );
  // }

  public getProductWiseCount() {
    return this.apollo
      .query<any>({
        query: G.getProductWiseCount,
        fetchPolicy: 'no-cache'
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getFiscalYearWiseRevenue(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearWiseRevenue,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getFiscalYearWiseProductRevenueWithFYList(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearWiseProductRevenueWithFYList,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getFiscalYearWiseCount(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearWiseCount,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getFiscalYearWiseProductCountWithFYList(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearWiseProductCountWithFYList,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }


  public getMonthWiseRevenue(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getMonthWiseRevenue,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }


  public getFiscalYearCompareRevenue() {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearCompareRevenue,
        fetchPolicy: 'no-cache',
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getFiscalYearCompareCount() {
    return this.apollo
      .query<any>({
        query: G.getFiscalYearCompareCount,
        fetchPolicy: 'no-cache',
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }


  public getMonthWiseProductRevenueWithFYList(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getMonthWiseProductRevenueWithFYList,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }


  public getMonthWiseCount(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getMonthWiseCount,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public getMonthWiseProductCountWithFYList(fiscalYear: string) {
    return this.apollo
      .query<any>({
        query: G.getMonthWiseProductCountWithFYList,
        fetchPolicy: 'no-cache',
        variables: { fiscalYear: fiscalYear }
      }).pipe(
        map((res): any => {
          return res.data;
        })
      );
  }

  public filter(array: any[], text: string) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.fiscalYear.toLowerCase().includes(text)) {
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

  public filterClass(array: any[], text: string) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.procuctId.toLowerCase().includes(text)) {
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

  public filterMonth(array: any[], productId: string, month: number) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.productId.toLowerCase().includes(productId) && o.month  === month ) {
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

  public filterFiscalYear(array: any[], productId: string, fy: string) {
    return JSON.parse(JSON.stringify(array)).filter(function iter(o) {
      let temp: any;
      if (o.productId.toLowerCase().includes(productId) && o.fiscalYear  === fy ) {
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

  public monthListNepali() {
    const months = [
      { month: 4, monthName: 'श्रावण' },
      { month: 5, monthName: 'भाद्र' },
      { month: 6, monthName: 'आश्विन' },
      { month: 7, monthName: 'कार्तिक' },
      { month: 8, monthName: 'मंसीर' },
      { month: 9, monthName: 'पुष' },
      { month: 10, monthName: 'माघ' },
      { month: 11, monthName: 'फाल्गुन' },
      { month: 12, monthName: 'चैत्र' },
      { month: 1, monthName: 'बैशाख' },
      { month: 2, monthName: 'जेष्ठ' },
      { month: 3, monthName: 'असार' },
    ];

    return months;

  }
}
