import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BrsService } from '../brs.service';
import { CalendarService, DateFormat } from '../../../../tools/nepali-calendar';
import { GlobalService } from 'src/app/shared';
import { environment } from 'src/environments/environment.prod';
import { ParamService } from 'src/app/tools/parameter';
import { Parameter } from 'src/app/shared/global.service';


@Component({
  selector: 'app-certificate-without-title',
  templateUrl: './certificate-without-title.component.html',
  styleUrls: ['./certificate-without-title.component.scss']
})
export class CertificateWithoutTitleComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  companyName = 'Nirekha Dot Com Pvt. Ltd.';
  companyAddress1 = 'राेशी, काभ्रे';
  companyAddress2 = '३ नं प्रदेश, नेपाल';
  marginLeft = '100';
  marginTop = '0';
  imgUrl = '';
  isElectronMode = false;

  private iconPath = environment.icon_image_path + 'photo/p/';

  paramValue: Parameter;
  certificate: any;
  printedOn = '';
  currentUrl: any = 'assets/background/roshi-certificate.jpg';
  prefix = '';
  id = 0;

  constructor(private brsService: BrsService, private cal: CalendarService,
    private globalService: GlobalService, private paramService: ParamService
  ) {
    this.globalService.refreshParameter();
    this.globalService.parameter$.subscribe((x: Parameter) => {
      this.paramValue = x;
      this.companyName = x.CompanyName;
      this.prefix = this.paramValue.PrefixOfCertificateNo.toString() + '  ';
    });
    //  this.companyName = this.globalService.CompanyName;
    this.paramService.getParamByCode('margin').subscribe(x => {
      this.marginTop = x.parameter.defaultValue;
    });
  }

  ngOnInit() {
  }
  closeButtonClick() {
    const data = { flag: 'close' };
    this.buttonClicked.emit(data);
  }
  loadForm(id: any) {
    this.brsService.getCertificateDetailsOfBusenessId(+id).subscribe(x => {

      this.id = id;
      this.certificate = x.certificate;
      this.printedOn = this.cal.GetDateBS(new Date(this.certificate.verifiedOn), DateFormat.yyyyMMdd);
      this.printedOn = this.printedOn.toString().replace('-', '.');
      this.printedOn = this.printedOn.toString().replace('-', '.');
      this.imgUrl = this.iconPath + x.certificate.member.photoURL;
      this.globalService.setLoading(false);
    }, error => {

      this.globalService.showErrorMessage(error.message);
      this.globalService.setLoading(false);
    });
  }
  markAsPrinted() {
    this.brsService.markAsPrinted(this.id).subscribe(x => {
      this.globalService.showSuccessMessage('प्रिन्ट भयाे भनेर मार्क भयाे');
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }

}
