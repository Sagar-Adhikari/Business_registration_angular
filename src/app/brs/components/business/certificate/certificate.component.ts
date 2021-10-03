import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  private _format: string;


  @Input()
  get format() {
    return this._format;
  }
  set format(val: any) {
    this._format = val;
  }
  constructor() { }

  ngOnInit() {
  }

}
