import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterListComponent } from '../register-list/register-list.component';
import { GlobalService } from 'src/app/shared';
// import { PrintTestComponent } from '../print-test/print-test.component';
import { ActivatedRoute } from '@angular/router';
import { RegisterComponent } from '../../register/register.component';
import { BrsService } from '../brs.service';
import { NormalFormatComponent } from '../normal-format/normal-format.component';
import { CertificateWithoutTitleComponent } from '../certificate-without-title/certificate-without-title.component';
import { CertificateWithTitleComponent } from '../certificate-with-title/certificate-with-title.component';
import { ParamService } from 'src/app/tools/parameter';
import { IdentityCardComponent } from '../identity-card/identity-card.component';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.scss']
})
export class RegisterMainComponent implements OnInit {
  viewType: string;

  @ViewChild('createForm') createForm: RegisterComponent;
  @ViewChild('withTitle') withTitle: CertificateWithTitleComponent;
  @ViewChild('withoutTitle') withoutTitle: CertificateWithoutTitleComponent;
  @ViewChild('normalFormat') normalFormat: NormalFormatComponent;
  @ViewChild('printId') printId: IdentityCardComponent;



  @ViewChild('list') list: RegisterListComponent;

  isLeftVisible = true;
  formType = 'add';
  certificateFormat = 'With Title';
  constructor(private globalService: GlobalService,
    private route: ActivatedRoute,
    private brsService: BrsService, private paramService: ParamService) {
    this.paramService.getParamByCode('format').subscribe(x => {
      this.certificateFormat = x.parameter.defaultValue;
    });
  }

  ngOnInit() {
    // this.globalService.setPageTitle('ब्यवसायकाे लिस्ट');
    this.route.params.subscribe(routeParams => {
      this.viewType = routeParams.id;
      if (this.viewType === 'print') {
        this.globalService.setPageTitle('प्रमाण पत्र प्रिन्ट हुन बाँकी ब्यवसायकाे लिस्ट');
      } else if (this.viewType === 'verify') {
        this.globalService.setPageTitle('प्रमाणित हुन बाँकी ब्यवसायकाे लिस्ट');
      } else if (this.viewType === 'expired') {
        this.globalService.setPageTitle('भाखा नाघेका ब्यवसायकाे लिस्ट');
      } else {
        this.globalService.setPageTitle('ब्यवसाय दर्ता लिस्ट');
      }
    });
  }

  onButtonClicked($event: any) {
    // debugger;

    if ($event.flag === 'saveAndclose') {
      this.globalService.setPageTitle('ब्यवसायकाे लिस्ट');
      this.list.loadBusiness();
      this.toogleForm();
    } else if ($event.flag === 'close') {
      this.globalService.setPageTitle('ब्यवसायकाे लिस्ट');
      this.toogleForm();
    } else {
      this.formType = $event.flag;
      if (this.isLeftVisible === true) {
        this.globalService.setLoading(true);
        if (this.formType === 'print') {
          setTimeout(() => {
            if (this.certificateFormat === 'With Title') {
              this.withTitle.loadForm(+$event.id);
            } else if (this.certificateFormat === 'Without Title') {
              this.withoutTitle.loadForm(+$event.id);
            } else if (this.certificateFormat === 'Default') {
              this.normalFormat.loadForm(+$event.id);
            }
            //  this.printForm.loadForm(+$event.id);
            this.toogleForm();
          });
        } else if (this.formType === 'printId') {

          setTimeout(() => {
            this.printId.loadForm(+$event.id);
            //  this.printForm.loadForm(+$event.id);
            this.toogleForm();
          });

        } else {
          setTimeout(() => {
            if ($event.id) {
              this.createForm.clearForm();
              const redgId = +$event.id;
              this.globalService.setLoading(true);
              this.brsService.getBusiness(redgId).subscribe(x => {
                const hAdd = x.business.houseOwners[0].municipality.district;
                this.brsService
                  .getListOfEdit(+hAdd.stateId, +hAdd.id, +x.business.businessClassId, +x.business.businessTypeId
                  )
                  .subscribe(
                    y => {
                      $event = { ...$event, y: y, x: x };
                      this.createForm.loadForm($event);
                      this.toogleForm();
                    });
              });
            } else {
              this.createForm.clearForm();
              setTimeout(() => {
                this.createForm.loadForm($event);
                this.toogleForm();
                this.globalService.setLoading(false);
              }, 1);
            }
          }, 100);
        }
      } else {
        this.toogleForm();
      }
    }
  }

  toogleForm() {
    this.isLeftVisible = this.isLeftVisible ? false : true;
    if (this.isLeftVisible) {
      if (this.formType !== 'print') {
        // this.createForm.clearForm();
      }
    }
  }
}
