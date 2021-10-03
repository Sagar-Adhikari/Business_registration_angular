import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CalendarService, DateFormat } from '../../../../tools/nepali-calendar';
import { BrsService } from '../brs.service';
import { GlobalService } from 'src/app/shared';
import { ElectronService } from 'ngx-electron';
import { Parameter } from 'src/app/shared/global.service';



@Component({
  selector: 'app-normal-format',
  templateUrl: './normal-format.component.html',
  styleUrls: ['./normal-format.component.scss'],
  providers: [CalendarService]
})
export class NormalFormatComponent implements OnInit {
  isElectronMode = true;
  paramValue: Parameter;
  constructor(private cal: CalendarService,
    private brsService: BrsService,
    private globalService: GlobalService,
    private electronService: ElectronService) {
    this.isElectronMode = this.electronService.isElectronApp;
  }
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  certificate: any;
  printedOn = '';
  currentUrl: any = 'assets/background/roshi-certificate.jpg';
  prefix = '';
  id = 0;

  loadForm(id: any) {
    this.brsService.getCertificateDetailsOfBusenessId(+id).subscribe(x => {
      this.globalService.refreshParameter();
      this.id = id;
      this.certificate = x.certificate;
      this.printedOn = this.cal.GetDateBS(new Date(this.certificate.verifiedOn), DateFormat.yyyyMMdd);
      this.printedOn = this.printedOn.toString().replace('-', '.');
      this.printedOn = this.printedOn.toString().replace('-', '.');
      this.globalService.parameter$.subscribe((y: Parameter) => {
        this.prefix = y.PrefixOfCertificateNo.toString() + '  ';
      });
      this.globalService.setLoading(false);
    }, error => {
      this.globalService.setLoading(false);
      this.globalService.showErrorMessage(error.message);
    });
  }
  ngOnInit() {
  }

  closeButtonClick() {
    const data = { flag: 'close' };
    this.buttonClicked.emit(data);
  }

  print(printSection: any): void {
    const printContents = document.getElementById(printSection).innerHTML;
    try {
      this.electronService.ipcRenderer.send('print', printContents);
    } catch (ex) {
      console.log(ex);
    }
  }
  markAsPrinted() {
    this.brsService.markAsPrinted(this.id).subscribe(x => {
      this.globalService.showSuccessMessage('प्रिन्ट भयाे भनेर मार्क भयाे');
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }
}
