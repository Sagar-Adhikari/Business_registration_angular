import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ParamUserService } from '../../services/param-user.service';
import { GlobalService } from '../../../../../shared';

export interface ParentParameter {
  id: number;
  name: string;
  parentId: number;
}


@Component({
  selector: 'app-param-user-details',
  templateUrl: './param-user-details.component.html',
  styleUrls: ['./param-user-details.component.scss'],
  providers: [ParamUserService]
})
export class ParamUserDetailsComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  parent: ParentParameter;
  childs: any = [];
   constructor(private paramService: ParamUserService, private globalService: GlobalService) {
     this.parent = { id: 1, parentId: null, name: 'Group'};
  }

  ngOnInit() {
  }

  loadChildren(parent: ParentParameter) {
    if (parent) {
       this.globalService.setLoading(true);
      this.parent = parent;
      this.paramService.findChildParameter(+this.parent.id).subscribe(x => {
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
