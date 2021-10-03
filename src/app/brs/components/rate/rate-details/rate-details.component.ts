import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RateService } from '../rate.service';
import { GlobalService } from '../../../../shared';

export interface ParentRate {
  id: number;
  name: string;
  parentId: number;
}


@Component({
  selector: 'app-rate-details',
  templateUrl: './rate-details.component.html',
  styleUrls: ['./rate-details.component.scss'],
  providers: [RateService]
})


export class RateDetailsComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  parent: ParentRate;
  childs: any = [];

  constructor(private rateService: RateService,
    private globalService: GlobalService) {
    this.parent = { id: 1, parentId: null, name: 'ग्रुप' };
  }

  ngOnInit() {
  }

  loadChildren(parent: ParentRate) {
    if (parent) {
       this.globalService.setLoading(true);
      this.parent = parent;
      this.rateService.findChildRate(+this.parent.id).subscribe(x => {
        this.childs = x;
        this.globalService.setLoading(false);
      });
    }
  }

  onButtonClicked(ev: any) {
    if (ev.event === 'edit' || ev.event === 'delete') {
      ev = { ...ev, parentId: this.parent.id };
    }
    this.buttonClicked.emit(ev);
  }
}
 