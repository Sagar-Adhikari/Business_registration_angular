import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/shared';
import { BrsService, AnnexOutput } from '../brs.service';
import { NoticeInput, NoticeToInput } from 'src/app/generated/graphql';
import { MatSelect } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {
  @ViewChild('eleClassId') eleClassId: MatSelect;
  formGroup: FormGroup;
  get formArray(): AbstractControl | null {
    return this.formGroup.get('formArray');
  }
  businessClassAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };

  businessTypeAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };
  businessSizeAnnex: AnnexOutput = {
    hasCapital: false,
    rateList: [],
    hasChild: false,
    rate: 0
  };

  disabled = false;

  private memberList: any;
  displayedColumns = ['memberName', 'mobileNo'];
  dataSource = [];

  hasBusinessSize = false;
  textLength = 0;

  businessSizeRequired(flag: boolean) {
    if (flag) {
      this.formArray.get([0]).get('businessSizeId').setValidators([Validators.required]);
      this.formArray.get([0]).get('businessSizeId')
        .setValidators([Validators.required]);
    } else {
      this.formArray.get([0]).get('businessSizeId').clearValidators();
    }
    this.formArray.get([0]).get('businessSizeId').updateValueAndValidity();
  }

  businessTypeChanged(flag: any) {
    // debugger;
    this.globalService.setLoading(true);
    if (flag === 1) {
      const classId = +this.formArray.get([0]).get('businessClassId').value;
      this.formArray.get([0]).get('businessTypeId').setValue(null);
      this.businessSizeRequired(false);
      this.brsService.getAnnex(classId).subscribe(x => {
        this.businessTypeAnnex = x;
        this.hasBusinessSize = false;
        this.getMobileNo(flag, classId);
        this.globalService.setLoading(false);
      });
    } else if (flag === 2) {
      const classId = +this.formArray.get([0]).get('businessTypeId').value;
      this.formArray.get([0]).get('businessSizeId').setValue(null);
      this.brsService.getAnnex(classId).subscribe(x => {
        this.businessSizeAnnex = x;
        this.hasBusinessSize = x.hasChild;
        this.businessSizeRequired(x.hasChild);
        this.getMobileNo(flag, classId);

        this.globalService.setLoading(false);
      });
    } else if (flag === 3) {
      const classId = +this.formArray.get([0]).get('businessSizeId').value;
      this.brsService.getAnnex(classId).subscribe(x => {
        this.globalService.setLoading(false);
        this.getMobileNo(flag, classId);
      });
    }
  }

  getMobileNo(flag: number, type: number) {
    this.brsService.getMobileNo(flag, type).subscribe(x => {
      this.memberList = x;
      let mobileNo = '';
      const result = [];
      for (let i = 0; i < x.length; i++) {
        const business = x[i].businesses;
        for (let j = 0; j < business.length; j++) {
          result.push({ memberName: x[i].nameInNepali, mobileNo: x[i].mobileNo, businessName: business[j].businessName });
        }
        mobileNo = mobileNo + x[i].mobileNo + '; ';
      }
      this.formArray.get([1]).get('mobileNo').setValue(mobileNo);
      this.dataSource = result;
    });
  }

  save({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      this.globalService.showErrorMessage('Error! Some fields are not valid.');
      return;
    }
    this.globalService.setLoading(true);
    this.disabled = true;
    const noticeTo = [];

    for (let i = 0; i < this.memberList.length; i++) {
      const business = this.memberList[i].businesses;
      for (let j = 0; j < business.length; j++) {
        noticeTo.push({ businessId: +business[j].id, mobileNo: +this.memberList[i].mobileNo });
      }
    }

    const noticeInput: NoticeInput = {
      message: value.message,
      title: value.title,
      noticeTo: noticeTo
    };

    this.brsService.sendSMS(noticeInput).subscribe(x => {
      this.formArray.reset();
      this.dataSource = [];
      this.eleClassId.focus();
      this.disabled = false;
      this.globalService.showSuccessMessage('Notice Send Successfully!');
      this.router.navigate(['sms-list']);
    }, error => {
      this.globalService.showErrorMessage(error.message);
      this.eleClassId.focus();
      this.disabled = false;
    });

  }


  getLength(ev: any) {
    this.textLength = ev.toString().length;
  }
  constructor(private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private brsService: BrsService,
    private router: Router) {
    this.globalService.setPageTitle('एस. एम. एस. मेसेज');

    this.brsService.getAnnex(1).subscribe(x => {
      this.businessClassAnnex = x;
      this.globalService.setLoading(false);
    });


  }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          businessClassId: ['', Validators.required],
          businessTypeId: ['', Validators.required],
          businessSizeId: ['']
        }),
        this.formBuilder.group({
          mobileNo: ['', Validators.required],
          title: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
          message: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(10)])]
        })
      ])
    });
  }
}
