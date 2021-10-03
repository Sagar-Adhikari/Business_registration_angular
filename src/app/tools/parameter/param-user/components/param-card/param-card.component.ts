import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-param-card',
  templateUrl: './param-card.component.html',
  styleUrls: ['./param-card.component.scss']
})
export class ParamCardComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  // iconUrl =  environment.icon_image_path + 'param/p/';

  private _params: any;

  @Input() set params(params) {
    this._params = params;
  }
  get params() { return this._params; }

  constructor() { }

  ngOnInit() {
  }

  onDrillClicked(paramId: number) {
    const event = { event: 'drill', paramId: paramId };
    this.buttonClicked.emit(event);
  }

  onEditClicked(paramId: number) {
    const event = { event: 'edit', paramId: paramId };
    this.buttonClicked.emit(event);
  }

  onDeleteClicked(paramId: number) {
    const event = { event: 'delete', paramId: paramId };
    this.buttonClicked.emit(event);
  }
}
