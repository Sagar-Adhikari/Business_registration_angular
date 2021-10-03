import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../../../../../shared';
import { GraphService } from '../graph.service';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-compare-fiscal-year',
  templateUrl: './compare-fiscal-year.component.html',
  styleUrls: ['./compare-fiscal-year.component.scss'],
  providers: [GraphService]
})
export class CompareFiscalYearComponent implements OnInit {
  private _graphType = 1;
  title = '';
  @Input()
  get graphType() {
    return this._graphType;
  }
  set graphType(value: number) {
    this._graphType = value;
    if (value === 1) {
      this.title = 'आर्थिक बर्ष अनुसार ब्यवसाय दर्ताकाे तुलना';
    } else {
      this.title = 'आर्थिक बर्ष अनुसार ब्यवसाय दर्ताबाट राजस्व संकलनकाे तुलना';
    }
  }


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
  pendingVerify = 0;
  pendingPrint = 0;
  expired = 0;


  constructor(private globalService: GlobalService,
    private graphService: GraphService) {
  }

  ngOnInit() {
    this.loadGraph();
  }

  private loadGraph() {
    this.globalService.setLoading(true);
    if (this.graphType === 1) {
      this.graphService.getFiscalYearCompareCount().subscribe(x => {
        this.formatGraph(x);
        this.globalService.setLoading(false);
      }, error => {
        this.globalService.showErrorMessage(error.message);
      });
    } else {
      this.graphService.getFiscalYearCompareRevenue().subscribe(x => {
        this.formatGraph(x);
        this.globalService.setLoading(false);
      }, error => {
        this.globalService.showErrorMessage(error.message);
      });
    }

  }

  private formatGraph(x: any) {
    const distinctClass = x.graph.filter((
      thing: { productName: string; },
      i: any,
      arr: {
        indexOf: (arg0: any) => void;
        find: (arg0: (t: any) => boolean) => void;
      }) => {
      return arr.indexOf(arr.find(t => t.productName === thing.productName)) === i;
    });

    const distinctFY = x.graph.filter((
      thing: { fiscalYear: string; },
      i: any,
      arr: {
        indexOf: (arg0: any) => void;
        find: (arg0: (t: any) => boolean) => void;
      }) => {
      return arr.indexOf(arr.find(t => t.fiscalYear === thing.fiscalYear)) === i;
    });

    this.lineChartLabels = [];
    for (let i = 0; i < distinctClass.length; i++) {
      this.lineChartLabels.push(distinctClass[i].productName);
    }

    this.lineChartData = [];
    for (let i = 0; i < distinctFY.length; i++) {
      const series = distinctFY[i].fiscalYear;
      const data = [];
      for (let j = 0; j < distinctClass.length; j++) {
        const monthArray = this.graphService.filterFiscalYear(x.graph, distinctClass[j].productId, distinctFY[i].fiscalYear);
        if (monthArray.length > 0) {
          data.push(monthArray[0].countOrRevenue);
        } else {
          data.push(0);
        }
      }
      this.lineChartData.push({ data: data, label: series });
    }
  }
}
