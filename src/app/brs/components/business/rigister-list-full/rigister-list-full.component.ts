import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BrsService } from '../brs.service';
import { GlobalService } from 'src/app/shared';
import { IDatePickerOption } from 'src/app/tools/nepali-calendar';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-rigister-list-full',
  templateUrl: './rigister-list-full.component.html',
  styleUrls: ['./rigister-list-full.component.scss']
})
export class RigisterListFullComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  inputValueChanged = new Subject<any>();
  displayedColumns = ['RedgNo',
    'BusinessNameNepali',
    'BusinessNameEnglish',
    'BusinessPanNo',
    'BusinessRedgNo',
    'BusinessTyoe',
    'WorkingCapital',
    'RunningCapital',
    'TotalCapital',
    'TurnOver',
    'DirectEmp',
    'InDirectEmp',
    'IssuedPerson',
    'HouseOwner',
    'HouseRent',
    'Frequency',
    'OfficeAddress',
    'MemberNameNepali',
    'MemberNameEnglish',
    'CitizenNo',
    'CitizenDate',
    'CitizenDistrict',
    'MemberPanNo',
    'MobileNo',
    'PhoneNo',
    'Email',
    'FatherName',
    'MotherName',
    'GFNAme',
    'PAddress',
    'TAddress',
    'Rate',
    'Remarks',
    'IssuedDate'
  ];
  headings = ['दर्ता नं.',
    'ब्यवसायकाे नाम (नेपालीमा)',
    'ब्यवसायकाे नाम (अंग्रेजीमा)',
    'प्यान नं',
    'दर्ता मिति',
    'ब्यवसायकाे किसिम',
    'चालु पँजी',
    'स्थिर',
    'जम्मा पुँजी',
    'क्षमता',
    'प्रत्यक्ष राेजगार',
    'अप्रत्यक्ष राेजगार',
    'प्रमाणित गर्ने',
    'घर बेटी',
    'घर भाडा',
    'भाडा बुझाउने',
    'कार्यालय ठेगाना',
    'ब्यवसायीकाे नाम (नेपालीमा)',
    'ब्यवसायीकाे नाम (अंग्रेजीमा)',
    'नागरीकता नं',
    'नागरीकता जारी मिति',
    'नागरीकता जारी गर्ने जिल्ला',
    'ब्यवसायीकाे प्यान नं',
    'माेबाइल नं',
    'फाेन नं',
    'इमेल',
    'बुबाकाे नाम',
    'अामाकाे नाम',
    'हजुरबुबाकाे नाम',
    'स्थायी ठेगाना',
    'अस्थायी ठेगाना',
    'शुल्क',
    'कैफियत',
    'जारी मिति',
    'भाखा नाघ्ने मिति',
    'स्टाटस'
  ];
  dataSource = [];
  total: any;
  filterWard: any;
  filterType: any;
  date: any;
  annex4: any;

  dpOption: IDatePickerOption;
  private sortDirection: any;
  private sortField: any;

  pageSize = 10;
  length = 0;

  loadData(isExport = false) {

    this.globalService.setLoading(true);
    let pageNo = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    if (isExport === false) {
      this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    } else {
      this.pageSize = 1000000;
      pageNo = 0;
    }


    const orderBy = [];
    const filterBy = [];
    if (this.sortField) {
      orderBy.push(JSON.stringify({ field: this.sortField, direction: this.sortDirection }));
    }
    if (this.filterWard) {
      filterBy.push(JSON.stringify({ field: 'wardNo', value: this.filterWard }));
    }

    if (this.filterType) {
      filterBy.push(JSON.stringify({ field: 'type', value: this.filterType }));
    }
    if (this.date) {
      if (this.date.fromDate.date) {
        filterBy.push(JSON.stringify({
          field: 'date',
          value: new Date(this.date.fromDate.date),
          value1: new Date(this.date.toDate.date)
        }));
      }
    }

    this.brsService.getAllBusinessWithTotal(pageNo, this.pageSize, filterBy, orderBy).subscribe(x => {
      // this.headings = x.headings;
      // this.displayedColumns  = x.displayedColumns;
      if (isExport) {
        const result = x.body;
        result.unshift(this.headings);
        result.unshift(['ब्यवसायकाे लिस्ट']);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(result);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, 'ब्यवसायकाे लिस्ट.xlsx');
        this.globalService.showSuccessMessage('Data exported successfully!');
      } else {
        this.dataSource = x.body;
        this.length = x.total.totalRows;
        this.total = x.total;
        this.globalService.setLoading(false);
      }
    });
  }

  dateChanged($event: any) {
    this.date = $event;
    this.loadData();
  }

  constructor(private brsService: BrsService, private globalService: GlobalService) {
    this.dpOption = this.globalService.getDatePickerOption;
    this.dpOption.required = false;
    this.dpOption.placeholder = 'फिल्टर मिति';
    this.globalService.setPageTitle('ब्यवसायकाे लिस्ट (डिटेलमा)');

    this.brsService.getAnnex4OrderByCaption().subscribe(x => {
      this.annex4 = x;
    });

    this.inputValueChanged.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(() => {
        this.paginator.pageIndex = 0;
        this.loadData();
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === 'asc' ? 'ASC' : x.direction === 'desc' ? 'DESC' : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadData())
    ).subscribe();
  }

  ngOnDestroy() {
    this.inputValueChanged.unsubscribe();
  }
  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [10, 25, 50, 100, 500];
    this.paginator.pageSize = 10;
    this.loadData();
  }

  // changeType(ev: any) {
  //   const bId = +ev.value;
  //   this.loadData();
  // }

  export() {
    this.loadData(true);
  }

}
