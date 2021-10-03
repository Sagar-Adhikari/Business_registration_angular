import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CalendarService, DateFormat } from '../../../../tools/nepali-calendar';
import { BrsService } from '../brs.service';
import { GlobalService } from 'src/app/shared';
import { ElectronService } from 'ngx-electron';
import { Parameter } from 'src/app/shared/global.service';


@Component({
  selector: 'app-print-test',
  templateUrl: './print-test.component.html',
  styleUrls: ['./print-test.component.scss'],
  providers: [CalendarService]
})
export class PrintTestComponent implements OnInit {
  isElectronMode = true;
  paramValue: Parameter;
  constructor(private cal: CalendarService,
    private brsService: BrsService,
    private globalService: GlobalService,
    private electronService: ElectronService) {
      this.globalService.refreshParameter();
    this.isElectronMode = this.electronService.isElectronApp;
    this.globalService.parameter$.subscribe((x: Parameter) => {
      this.prefix = x.PrefixOfCertificateNo.toString() + '  ';
    });
  }
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  certificate: any;
  printedOn = '';
  currentUrl: any = 'assets/background/roshi-certificate.jpg';
  prefix = '';
  id = 0;

  loadForm(id: any) {
    this.brsService.getCertificateDetailsOfBusenessId(+id).subscribe(x => {
      this.id = id;
      this.certificate = x.certificate;
      this.printedOn = this.cal.GetDateBS(new Date(this.certificate.verifiedOn), DateFormat.yyyyMMdd);
      this.printedOn = this.printedOn.toString().replace('-', '.');
      this.printedOn = this.printedOn.toString().replace('-', '.');

    }, error => {
      console.log(error);
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
  // public playPingPong() {
  //   try {
  //     this.electronService.ipcRenderer.send('print-to-pdf');
  //     console.log('success');
  //   } catch (ex) {
  //     console.log(ex);
  //   }
  // }

  // public beep() {
  //   this.electronService.shell.beep();
  // }
}
