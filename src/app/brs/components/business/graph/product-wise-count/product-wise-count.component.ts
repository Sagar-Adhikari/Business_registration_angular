import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../../../shared';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { GraphService } from '../graph.service';



@Component({
  selector: 'app-product-wise-count',
  templateUrl: './product-wise-count.component.html',
  styleUrls: ['./product-wise-count.component.scss'],
  providers: [GraphService]
})
export class ProductWiseCountComponent implements OnInit {
  pendingVerify = 0;
  pendingPrint = 0;
  expired = 0;
  title = 'ब्यवसायकाे प्रकृति अनुसार जम्मा ब्यवसाय संख्या';

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartData: ChartDataSets[] = [{ data: [], label: 'संख्या' }];

  constructor(private globalService: GlobalService, private graphService: GraphService) {
    this.graphService.getProductWiseCount().subscribe(x => {
      x.pending.forEach((element: { status: number; count: number }) => {
        if (element.status === 1) {
          this.pendingVerify = element.count;
        } else if (element.status === 2) {
          this.pendingPrint = element.count;
        } else {
          this.expired = element.count;
        }
      });
      this.loadGraph(x.product);
      this.globalService.setLoading(false);
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  private loadGraph(graph: any) {
    const label = [];
    const data = [];
    this.barChartData = [];
    for (let i = 0; i < graph.length; i++) {
      label.push(graph[i].productName);
      data.push(graph[i].count);
    }
    this.barChartLabels = label;
    this.barChartData.push({ data: data, label: 'संख्या' });
  }

  ngOnInit() {
  }

  onSelect($event: any) {

  }
}
