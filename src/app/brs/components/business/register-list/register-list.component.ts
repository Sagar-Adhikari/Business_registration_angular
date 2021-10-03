import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, ElementRef, Input, OnDestroy } from '@angular/core';
import { GlobalService } from '../../../../shared';
import { MatPaginator, MatSort, MatMenuTrigger } from '@angular/material';
import { BrsService } from '../brs.service';
import { merge, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IDatePickerOption } from 'src/app/tools/nepali-calendar';
import { DataDictionary } from 'src/app/shared/data-model';
import { Parameter } from 'src/app/shared/global.service';

@Component({
  selector: 'app-business-list',
  templateUrl: './register-list.component.html',
  styleUrls: ['./register-list.component.scss']
})
export class RegisterListComponent implements OnInit, AfterViewInit, OnDestroy {
  private _viewType: string;
  paramValue: Parameter;
  inputValueChanged = new Subject<any>();

  @Input()
  get viewType() {
    return this._viewType;
  }
  set viewType(value: string) {
    this._viewType = value;
    if (value === 'verify') {
      this.displayedColumns = ['blank', 'verifiedOn', 'businessName',
        'ownerName', 'businessClassName', 'totalCapital', 'createdOn', 'id'];
      this.status = '1';
    } else if (value === 'print') {
      this.displayedColumns = ['verifiedOn', 'redgNo', 'businessName',
        'ownerName', 'businessClassName', 'totalCapital', 'createdOn', 'id'];
      this.status = '2';
    } else if (value === 'expired') {
      this.displayedColumns = ['verifiedOn', 'redgNo', 'businessName',
        'ownerName', 'businessClassName', 'totalCapital', 'createdOn'];
      this.status = '6';
    }
    if (this.loaded) {
      this.loadBusiness();
    }
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  private redgId = 0;
  private sortDirection: any;
  private sortField: any;
  private loaded = false;
  status = '';
  rowStatus = 0;
  date: any;

  filterBusinessName = null;
  filterOwnerName = null;
  filterBusinessType = null;

  statusList: any[];
  allowEdit = false;
  allowVerify = false;

  dpOption: IDatePickerOption;
  dataSource = [];
  pageSize = 10;
  length = 0;
  roleId = 0;

  displayedColumns = ['verifiedOn', 'redgNo', 'businessName',
    'ownerName', 'businessClassName', 'totalCapital', 'createdOn', 'id'];

  constructor(private globalService: GlobalService,
    private brsService: BrsService) {
    this.globalService.currentUser$.subscribe(x => {
      if (x) {
        this.roleId = x.roleId;
      } else {
        this.roleId = 0;
      }
    });
    this.globalService.refreshParameter();
    this.globalService.parameter$.subscribe((x: Parameter) => {
      this.paramValue = x;
    });

    this.dpOption = this.globalService.getDatePickerOption;
    this.dpOption.required = false;
    this.dpOption.placeholder = 'Filter Date Range';
    this.statusList = new DataDictionary().StatusList();

    this.inputValueChanged.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(() => {
        this.paginator.pageIndex = 0;
        this.loadBusiness();
      });
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [10, 25, 50, 100, 500];
    this.paginator.pageSize = 10;
    this.loadBusiness();
    // this.globalService.setLoading(false);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === 'asc' ? 'ASC' : x.direction === 'desc' ? 'DESC' : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadBusiness())
    ).subscribe();
  }

  ngOnDestroy() {
    this.inputValueChanged.unsubscribe();
  }

  loadBusiness() {

    this.globalService.setLoading(true);

    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const pageNo = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    const orderBy = [];
    const filterBy = [];
    if (this.sortField) {
      orderBy.push(JSON.stringify({ field: this.sortField, direction: this.sortDirection }));
    }
    if (this.filterBusinessName) {
      filterBy.push(JSON.stringify({ field: 'filterBusinessName', value: this.filterBusinessName }));
    }

    if (this.filterOwnerName) {
      filterBy.push(JSON.stringify({ field: 'filterOwnerName', value: this.filterOwnerName }));
    }

    if (this.filterBusinessType) {
      filterBy.push(JSON.stringify({ field: 'filterBusinessType', value: this.filterBusinessType }));
    }

    if (this.status) {
      filterBy.push(JSON.stringify({ field: 'status', value: this.status }));
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
    this.brsService.getAllBusinessForList(pageNo, this.pageSize, filterBy, orderBy).subscribe(x => {
      x.business.forEach((element: { createdOn: any; }) => {
        element.createdOn = this.globalService.getShortDateWithTime(element.createdOn);
      });
      this.dataSource = x.business;
      this.length = x.totalRows;
      this.globalService.setLoading(false);
      this.loaded = true;
    });
  }
  onAddClicked() {
    const data = { flag: 'add' };
    this.buttonClicked.emit(data);
  }
  onMenuOpen(id: any, status: any) {
    this.redgId = id;
    this.rowStatus = status;
    this.allowVerify = false;
    this.allowEdit = false;
    if (this.roleId <= 2) {
      if (this.rowStatus === 1) {
        this.allowEdit = true;
        this.allowVerify = true;
      }
      if (this.rowStatus === 2) {
        this.allowEdit = true;
      }
    } else if (this.roleId === 3) {
      if (this.rowStatus === 1) {
        this.allowEdit = true;
        this.allowVerify = this.paramValue.AllowAccessToVerifyToUser;
      }
      if (this.rowStatus === 2) {
        this.allowEdit = this.paramValue.AllowAccessToEditVerifiedDataToUser;
      }
    }
  }

  dateChanged($event: any) {
    this.date = $event;
    this.loadBusiness();
    // console.log(this.date);
  }
  menuClicked($event: any) {
    // $event = 1  details
    // $event = 2 edit
    // 3 = verify
    // 4 = renew
    // 5 = print

    let data: any;
    if ($event === 1) {
      data = { flag: 'details', id: this.redgId };
    } else if ($event === 2) {
      data = { flag: 'edit', id: this.redgId };
    } else if ($event === 3) {
      data = { flag: 'verify', id: this.redgId };
    } else if ($event === 4) {
      data = { flag: 'renew', id: this.redgId };
    } else if ($event === 5) {
      data = { flag: 'print', id: this.redgId };
    } else if ($event === 6) {
      data = { flag: 'delete', id: this.redgId };
    } else if ($event === 7) {
      data = { flag: 'printId', id: this.redgId };
    }
    this.buttonClicked.emit(data);
  }
}
