import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../shared';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  paramId;
  constructor(private globalService: GlobalService, private route: ActivatedRoute, ) {
    this.globalService.setPageTitle('मुख्य पाना');

  }

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');

    this.route.params.subscribe(routeParams => {
       this.paramId = routeParams.id;
    });
  }


}
