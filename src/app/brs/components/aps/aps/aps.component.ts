import { IDatePickerOption } from './../../../../tools/nepali-calendar/model/calendar.option';
import { DataDictionary } from 'src/app/shared/data-model';
import { WardInput, ApeInput } from './../../../../generated/graphql';
import { ApsService } from './../aps.service';
import {
  MatPaginator,
  MatSort,
  MatMenuTrigger,
  MatTableDataSource
} from '@angular/material';
import { merge, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core';
import { GlobalService } from '../../../../shared';

// import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

// import * as XLSX from 'xlsx';
// import { Element } from '@angular/compiler';


@Component({
  selector: 'app-aps',
  templateUrl: './aps.component.html',
  styleUrls: ['./aps.component.scss']
})
export class ApsComponent implements OnInit {
  // @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild('paginator') paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('menuTriggerFilter') private menuTriggerFilter: MatMenuTrigger;
  // @ViewChild('elRegNo') elRegNo: ElementRef;
  dataSource: any = [];
  displayedColumns = ['title'];
  pageSize = 10;
  length = 0;
  wardNo: number;
  wardList: [];
  isLoggedIn = false;

  constructor(
    private globalService: GlobalService,
    private apeService: ApsService,
  ) {
    this.globalService.setPageTitle('व्यावसायिक क्षेत्र संभाव्यता सर्वेक्षण');
    this.isLoggedIn = this.globalService.isLoggedIn();
    this.apeService.getWardList().subscribe(x => {
      this.wardList = x;
    });
  }

  loadApe(isSecondTime: boolean = true) {
    // if (isSecondTime === false) {
    //   // this.setInitialState();
    //   // this.clearFilterFields();
    // }
    this.pageSize = this.paginator.pageSize
      ? this.paginator.pageSize
      : this.pageSize;
    const pageNo = 1;
    const orderBy = [];
    const filterBy = [];
    this.pageSize = 10;
    // console.log(this.sortField, this.sortDirection, pageNo);
    // if (this.sortField) {
    //   orderBy.push(
    //     JSON.stringify({ field: this.sortField, direction: this.sortDirection })
    //   );
    // }
    if (this.wardNo) {
      filterBy.push(JSON.stringify({ field: 'wardNo', value: this.wardNo }));
    }
    // debugger;

    this.apeService
      .getAllApe(pageNo, this.pageSize, filterBy, orderBy)
      .subscribe(x => {

        // debugger;
        // console.log('xape',x.ape);
        x.ape.forEach((element: { createdOn: any; title: any }) => {
          // console.log(x);
          element.createdOn = this.globalService.getShortDateWithTime(
            element.createdOn
          );
        });
        console.log(x);
        this.dataSource = x.ape;
        this.length = x.totalRows;
      });
  }

  filterData(x: number) {
    if (x === 0) {
      this.wardNo = undefined;
    } else {
      this.wardNo = x;
    }
    this.loadApe();
    // this.menuTriggerFilter.closeMenu();
  }


  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageSize = this.pageSize;
    this.loadApe();
    this.globalService.setLoading(false);
  }

}
