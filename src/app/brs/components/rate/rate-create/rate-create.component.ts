import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { RateService } from '../rate.service';
// import { ParamUserService } from '../../services/param-user.service';
import { GlobalService } from '../../../../shared';
import { FormModel } from '../../../form-module';
import { RateInput } from 'src/app/generated/graphql';


@Component({
  selector: 'app-rate-create',
  templateUrl: './rate-create.component.html',
  styleUrls: ['./rate-create.component.scss'],
  providers: [RateService]
})
export class RateCreateComponent implements OnInit {
  @ViewChild('formData') formToReset: any;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  rateCreateForm: FormGroup;
  formType: string;
  formTitle: string;
  isDelete = false;
  isGroup = false;

  saveButtonCaption = 'सेभ';

  private parentId: number;
  private rateId: number;

  private clearForm() {
    this.formToReset.resetForm();
    this.parentId = undefined;
    this.rateId = undefined;
    this.isDelete = false;
    this.isGroup = false;
  }

  constructor(private rateService: RateService,
    private globalService: GlobalService) {
    this.rateCreateForm = new FormModel().RateForm();

  }

  public loadForm(formType: string, parentId: number, rateId?: number) {
    // formType= 'Create/Edit/Delete'
    this.globalService.setLoading(true);
    this.clearForm();
    this.formType = formType;
    if (this.formType === 'create') {
      this.formTitle = 'नयाँ अनुसुची शिर्षक';
      const pageTitle = 'नयाँ अनुसुची शिर्षक';
      this.globalService.setPageTitle(pageTitle);
    } else if (this.formType === 'delete') {
      this.isDelete = true;
      this.formTitle = 'अनुसुची शिर्षक डिलिट';
      const pageTitle = 'अनुसुची शिर्षक डिलिट';
      this.globalService.setPageTitle(pageTitle);
    } else if (this.formType === 'edit') {
      this.formTitle = 'इडिट अनुसुची शिर्षक';
      const pageTitle = 'इडिट अनुसुची शिर्षक';
      this.globalService.setPageTitle(pageTitle);
    }
    this.parentId = parentId;
    this.rateId = rateId;
    if (rateId) {
      this.rateService.getRateById(rateId).subscribe(x => {
        this.saveButtonCaption = 'अपडेट';
        this.rateCreateForm.controls['rate'].setValue(x.rate);
        this.rateCreateForm.controls['capital'].setValue(x.capital);
        this.rateCreateForm.controls['name'].setValue(x.name);
        this.rateCreateForm.controls['parentName'].setValue(x.parent.name);
        this.rateCreateForm.controls['isGroup'].setValue(x.isGroup);
        this.groupChanged();
        this.globalService.setLoading(false);
      });
    } else {
      this.rateService.getRateById(parentId).subscribe(x => {
        this.saveButtonCaption = 'सेभ';
        this.rateCreateForm.controls['parentName'].setValue(x.name);
        this.rateCreateForm.controls['isGroup'].setValue(false);
        this.groupChanged();
        this.globalService.setLoading(false);
      });
    }
  }

  onCancelledClicked() {
    const ev = { event: 'canceled' };
    this.buttonClicked.emit(ev);
  }

  public groupChanged() {
    this.isGroup = this.rateCreateForm.controls.isGroup.value;
    if (this.isGroup === true) {
      this.rateCreateForm.get('rate').clearValidators();
      this.rateCreateForm.get('capital').clearValidators();
    } else {
      this.rateCreateForm.get('rate').setValidators([Validators.required]);
      this.rateCreateForm.get('capital').setValidators([Validators.required]);
    }
    this.rateCreateForm.get('rate').updateValueAndValidity();
    this.rateCreateForm.get('capital').updateValueAndValidity();
  }



  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      return;
    }
    this.globalService.setLoading(true);

    const rateData: RateInput = {
      id: this.rateId,
      caption: value.name,
      parentId: this.parentId,
      isGroup: value.isGroup,
      rate: value.isGroup ? 0 : +value.rate,
      capital: value.isGroup ? 0 : +value.capital
    };


    this.rateService.save(rateData).subscribe(data => {
      if (data) {
        const ev = { event: 'saved', parentId: this.parentId };
        this.buttonClicked.emit(ev);
        if (this.rateId) {
          this.globalService.showSuccessMessage('रेट सफतापूर्वक इडिट भयाे!');
        } else {
          this.globalService.showSuccessMessage('रेट सफतापूर्वक सेभ भयाे!');
        }
      }
    }, (error: any) => {
      this.globalService.showErrorMessage(error.message);
    });
  }


  delete() {
    this.globalService.setLoading(true);
    this.rateService.delete(+this.rateId).subscribe(x => {
      const ev = { event: 'deleted', parentId: this.parentId };
      this.buttonClicked.emit(ev);
      this.globalService.showSuccessMessage('रेट सफलतापूर्वक डिलिट भयाे ।');
    }, (error: any) => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  ngOnInit() {
  }

}
