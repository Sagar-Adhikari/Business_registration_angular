import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../shared';
import { CalendarService } from '../../../../../tools/nepali-calendar';
import { GraphService } from '../graph.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'app-fiscal-year-wise-revenue',
  templateUrl: './fiscal-year-wise-revenue.component.html',
  styleUrls: ['./fiscal-year-wise-revenue.component.scss'],
  providers: [GraphService]
})
export class FiscalYearWiseRevenueComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [{ data: [], label: 'संख्या' }];


  fiscalYearList: any[];
  currentIndex = 0;
  title = '';
  leftButtonCaption = '<';
  rightButtonCaption = '>';
  constructor(private globalService: GlobalService,
    private calendarService: CalendarService,
    private graphService: GraphService) {
    const currentFY = this.calendarService.getFiscalYear(new Date());
    this.title = `आर्थिक बर्ष ${currentFY} मा ब्यवसायकाे प्रकृति अनुसार दर्ता तथा नबिकरणबाट राजस्व संकलन`;

    this.graphService.getFiscalYearWiseProductRevenueWithFYList(currentFY).subscribe(x => {
      this.fiscalYearList = x.fyList;
      const checkCurrent = this.graphService.filter(this.fiscalYearList, currentFY);
      if (checkCurrent.length === 0) {
        this.fiscalYearList.unshift({ fiscalYear: currentFY });
      }

      if (this.fiscalYearList) {
        if (this.fiscalYearList[1]) {
          this.leftButtonCaption = this.fiscalYearList[1].fiscalYear;
        }
      }
      this.loadGraph(x);
      this.globalService.setLoading(false);
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  private loadGraph(x: any) {
    const label = [];
    const dataTax = [];
    const dataBoard = [];
    this.barChartData = [];

    for (let i = 0; i < x.graph.length; i++) {
      label.push(x.graph[i].productName);
      dataTax.push(x.graph[i].taxRevenue);
     // dataBoard.push(x.graph[i].boardRevenue);
    }

    this.barChartLabels = label;
    this.barChartData.push({ data: dataTax, label: 'ब्षवसाय दर्ता' });
 //   this.barChartData.push({ data: dataBoard, label: 'परिचय पाटी दर्ता' });
  }

  ngOnInit() {
  }

  buttonClick(flag: string) {
    if (flag === '+') {
      if (this.leftButtonCaption !== '<') {
        this.currentIndex = this.currentIndex + 1;
      } else {
        return;
      }
    } else {
      if (this.rightButtonCaption !== '>') {
        this.currentIndex = this.currentIndex - 1;
      } else {
        return;
      }
    }
    this.globalService.setLoading(true);
    if (this.fiscalYearList.length > this.currentIndex + 1) {
      this.leftButtonCaption = this.fiscalYearList[this.currentIndex + 1].fiscalYear;
    } else {
      this.leftButtonCaption = '<';
    }

    if (this.currentIndex - 1 >= 0) {
      this.rightButtonCaption = this.fiscalYearList[this.currentIndex - 1].fiscalYear;
    } else {
      this.rightButtonCaption = '>';
    }

    const thisFy = this.fiscalYearList[this.currentIndex].fiscalYear;
    this.title = `आर्थिक बर्ष ${thisFy} मा ब्यवसायकाे प्रकृति अनुसार दर्ता तथा नबिकरणबाट राजस्व संकलन`;
    this.graphService.getFiscalYearWiseRevenue(this.fiscalYearList[this.currentIndex].fiscalYear).subscribe(x => {
      this.loadGraph(x);
      this.globalService.setLoading(false);
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }
}
