import { Component, OnInit, Input } from '@angular/core';
import { IDatePickerOption, DateType } from 'src/app/tools/nepali-calendar';
import { GlobalService } from 'src/app/shared';
import { ParamValueInput } from 'src/app/generated/graphql';
import { ParamService } from '../../../services/param.service';

@Component({
  selector: 'app-param-value',
  templateUrl: './param-value.component.html',
  styleUrls: ['./param-value.component.scss']
})
export class ParamValueComponent implements OnInit {
  private _node: any;
  private _lang = 0;
  private _userOrModule = 'Module';
  dpOption: IDatePickerOption;
  placeHolder = '';
  value: any;

  @Input() get userOrModule() {
    return this._userOrModule;
  }
  set userOrModule(val: any) {
    this._userOrModule = val;
  }


  @Input() get node() {
    return this._node;
  }
  set node(val: any) {
    this._node = val;
    this.placeHolder = val.name;
    this.dpOption.placeholder = this.placeHolder;

    if (val.details[0].dataTypeId === 50) {
      this.value = new Date(val.details[0].defaultValue);
    } else {
      this.value = val.details[0].defaultValue;
    }
    if (val.details[0].dataTypeId === 60) {
      if (val.details[0].defaultValue) {
        if (val.details[0].defaultValue === 'true') {
          this.value = true;
        } else {
          this.value = false;
        }
      }
    }
    // this.value = val.details[0].defaultValue;
    // console.log(val);
  }

  @Input() get lang() {
    return this._lang;
  }
  set lang(val: any) {
    this._lang = val;
    if (val === 0) {
      this.placeHolder = this._node.name;
    } else {
      this.placeHolder = this._node.nameNepali;
    }
    this.dpOption.placeholder = this.placeHolder;
  }

  constructor(private globalService: GlobalService, private paramService: ParamService) {
    this.dpOption = this.globalService.getDatePickerOption;
    this.dpOption.dateType = DateType.AD;
    this.dpOption.withTime = false;
    this.dpOption.closeOnClick = true;
    this.dpOption.required = false;
    // this.dpOption.isRange = false;
    this.dpOption.fromDate = new Date();
    this.dpOption.toDate = new Date();
    this.dpOption.placeholder = '';
  }

  ngOnInit() {
  }

  save() {
    this.globalService.setLoading(true);
    const data: ParamValueInput = {
      id: +this.node.id,
      dataTypeId: this.node.details[0].dataTypeId,
      defaultValue: this.value ? this.value.toString() : ''
    };

    // if (this.userOrModule === 'Module') {
    //   this.paramService.updateParamModuleDefaultValue(data).subscribe(x => {
    //     this.globalService.showSuccessMessage('Value updated successfully!', 1000);
    //   }, err => {
    //     this.globalService.showErrorMessage(err.message);
    //   });
    // } else {
    this.paramService.updateParamUserDefaultValue(data).subscribe(x => {
      this.globalService.showSuccessMessage('Value updated successfully!', 1000);
    }, err => {
      this.globalService.showErrorMessage(err.message);
    });
    // }
  }
}
