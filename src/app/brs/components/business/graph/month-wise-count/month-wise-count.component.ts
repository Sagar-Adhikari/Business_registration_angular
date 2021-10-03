import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../shared';
import { CalendarService } from '../../../../../tools/nepali-calendar';
import { GraphService } from '../graph.service';


import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';


@Component({
  selector: 'app-month-wise-count',
  templateUrl: './month-wise-count.component.html',
  styleUrls: ['./month-wise-count.component.scss'],
  providers: [GraphService]
})
export class MonthWiseCountComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [], label: '' }
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
        },
      ],
    },
  };
  public lineChartLegend = true;
  public lineChartType = 'line';

  fiscalYearList: any[];
  currentIndex = 0;
  title = 'ब्यवसायकाे प्रकृति अनुसार जम्मा ब्यवसाय संख्या';
  leftButtonCaption = '';
  rightButtonCaption = '';

  constructor(private globalService: GlobalService,
    private calendarService: CalendarService,
    private graphService: GraphService) {
    const currentFY = this.calendarService.getFiscalYear(new Date());
    this.title = `आर्थिक बर्ष ${currentFY} मा ब्यवसायकाे प्रकृति अनुसार मासिक रूपमा दर्ता तथा नबिकरण भएका ब्यवसायकाे संख्या`;

    this.graphService.getMonthWiseProductCountWithFYList(currentFY).subscribe(x => {
      this.fiscalYearList = x.fyList;
      const checkCurrent = this.graphService.filter(this.fiscalYearList, currentFY);
      if (checkCurrent.length === 0) {
        this.fiscalYearList.unshift({ fiscalYear: currentFY });
      }

      if (this.fiscalYearList) {
        if (this.fiscalYearList[1]) {
          this.leftButtonCaption = this.fiscalYearList[1].fiscalYear + ' <';
        }
      }
      this.loadGraph(x);
      this.globalService.setLoading(false);
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  private loadGraph(x: any) {
    const distinctClass = x.graph.filter((
      thing: { productName: string; },
      i: any,
      arr: {
        indexOf: (arg0: any) => void;
        find: (arg0: (t: any) => boolean) => void;
      }) => {
      return arr.indexOf(arr.find(t => t.productName === thing.productName)) === i;
    });

    this.lineChartLabels = [];
    const monthList = this.graphService.monthListNepali();

    for (let i = 0; i < monthList.length; i++) {
      this.lineChartLabels.push(monthList[i].monthName);
    }

    this.lineChartData = [];
    for (let i = 0; i < distinctClass.length; i++) {
      const series = distinctClass[i].productName;
      const data = [];
      for (let j = 0; j < monthList.length; j++) {
        const monthArray = this.graphService.filterMonth(x.graph, distinctClass[i].productId, monthList[j].month);
        if (monthArray.length > 0) {
          data.push(monthArray[0].count);
        } else {
          data.push(0);
        }
      }
      this.lineChartData.push({ data: data, label: series });
    }
  }

  ngOnInit() {
  }
  buttonClick(flag: string) {
    if (flag === '+') {
      if (this.leftButtonCaption !== '') {
        this.currentIndex = this.currentIndex + 1;
      } else {
        return;
      }
    } else {
      if (this.rightButtonCaption !== '') {
        this.currentIndex = this.currentIndex - 1;
      } else {
        return;
      }
    }
    this.globalService.setLoading(true);
    if (this.fiscalYearList.length > this.currentIndex + 1) {
      this.leftButtonCaption = this.fiscalYearList[this.currentIndex + 1].fiscalYear + ' <';
    } else {
      this.leftButtonCaption = '';
    }

    if (this.currentIndex - 1 >= 0) {
      this.rightButtonCaption = '> ' + this.fiscalYearList[this.currentIndex - 1].fiscalYear;
    } else {
      this.rightButtonCaption = '';
    }
    const thisFy = this.fiscalYearList[this.currentIndex].fiscalYear;
    this.title = `आर्थिक बर्ष ${thisFy} मा ब्यवसायकाे प्रकृति अनुसार मासिक रूपमा दर्ता तथा नबिकरण भएका ब्यवसायकाे संख्या`;
    this.graphService.getMonthWiseCount(this.fiscalYearList[this.currentIndex].fiscalYear).subscribe(x => {
      this.loadGraph(x);
     this.globalService.setLoading(false);
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }
}
