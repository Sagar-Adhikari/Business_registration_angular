import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrsService } from '../brs.service';

@Component({
  selector: 'app-brs-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  districtList = [];
  cityList = [];

  @Input() address: FormGroup;

  private _stateList = [];
  @Input() set stateList(val) {
    this._stateList = val;
  }
  get stateList() {
    return this._stateList;
  }

  private _addressType: string;
  @Input() set addressType(val) {
    this._addressType = val;
  }
  get addressType() { return this._addressType; }



  constructor(private brsService: BrsService) {
    // this.addressForm = new FormModel().AddressForm();
  }

  ngOnInit() {
  }

  districtChanged() {
    const districtId = +this.address.controls.district.value;
    this.brsService.getCityByDistrictId(districtId).subscribe(x => {
      this.cityList = x;
    });

  }
  stateChanged() {
    const stateId = +this.address.controls.state.value;
    this.brsService.getDistrictByStateId(stateId).subscribe(x => {
      this.districtList = x;
    });

  }
}
