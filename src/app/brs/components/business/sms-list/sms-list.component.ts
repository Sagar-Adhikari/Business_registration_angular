import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { BrsService } from '../brs.service';
import { GlobalService } from 'src/app/shared';
import { IDatePickerOption } from 'src/app/tools/nepali-calendar';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-sms-list',
  templateUrl: './sms-list.component.html',
  styleUrls: ['./sms-list.component.scss']
})
export class SmsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns = ['title', 'message', 'createdOn'];
  dataSource = [];
  filterMessage: any;
  filterTitle: any;
  dpOption: IDatePickerOption;
  private sortDirection: any;
  private sortField: any;
  date: any;
  pageSize = 10;
  length = 0;
  inputValueChanged = new Subject<any>();
  panelOpenState = false;

  loadData() {

    this.globalService.setLoading(true);

    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const pageNo = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    const orderBy = [];
    const filterBy = [];
    if (this.sortField) {
      orderBy.push(JSON.stringify({ field: this.sortField, direction: this.sortDirection }));
    }
    if (this.filterTitle) {
      filterBy.push(JSON.stringify({ field: 'title', value: this.filterTitle }));
    }

    if (this.filterMessage) {
      filterBy.push(JSON.stringify({ field: 'message', value: this.filterMessage }));
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

    this.brsService.getAllNotice(pageNo + 1, this.pageSize, filterBy, orderBy).subscribe(x => {
      x.notices.forEach((element) => {
        let mobileNo = '';
        element.noticeTo.forEach(e => {
          mobileNo = mobileNo + e.mobileNo + ';';
        });
        element.mobileNo = mobileNo;
        element.count = element.noticeTo.length;
        element.createdOn = this.globalService.getShortDateWithTime(element.createdOn);
      });

      this.dataSource = x.notices;
      this.length = x.totalRows;
      this.globalService.setLoading(false);
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
    this.globalService.setPageTitle('एस. एम. एस. लिस्ट');
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

}
