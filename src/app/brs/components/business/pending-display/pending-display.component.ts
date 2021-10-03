import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/shared';

@Component({
  selector: 'app-pending-display',
  templateUrl: './pending-display.component.html',
  styleUrls: ['./pending-display.component.scss']
})
export class PendingDisplayComponent implements OnInit {
  private _pendingVerify = 0;
  private _pendingPrint = 0;
  private _expired = 0;

  @Input()
  get pendingVerify() {
    return this._pendingVerify;
  }
  set pendingVerify(value: number) {
    this._pendingVerify = value;
  }

  @Input()
  get pendingPrint() {
    return this._pendingPrint;
  }
  set pendingPrint(value: number) {
    this._pendingPrint = value;
  }

  @Input()
  get expired() {
    return this._expired;
  }
  set expired(value: number) {
    this._expired = value;
  }

  constructor(private router: Router, private globalService: GlobalService) { }

  ngOnInit() {
  }

  labelClick(label: string) {
    const url = `/brs/list-business/${label}`;
    this.globalService.setLoading(true);
    this.router.navigate([url]);
  }
}
