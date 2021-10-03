import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-rate-card',
  templateUrl: './rate-card.component.html',
  styleUrls: ['./rate-card.component.scss']
})
export class RateCardComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  private _rates: any;

  @Input() set rates(rates) {
    this._rates = rates;
  }
  get rates() { return this._rates; }

  constructor() { }

  ngOnInit() {
  }

  onDrillClicked(rateId: number) {
    const event = { event: 'drill', rateId: rateId };
    this.buttonClicked.emit(event);
  }

  onEditClicked(rateId: number) {
    const event = { event: 'edit', rateId: rateId };
    this.buttonClicked.emit(event);
  }

  onDeleteClicked(rateId: number) {
    const event = { event: 'delete', rateId: rateId };
    this.buttonClicked.emit(event);
  }
}
