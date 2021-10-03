import { IDatePickerOption } from './../../../../tools/nepali-calendar/model/calendar.option';
import { ApsService } from './../aps.service';
import {
  MatPaginator,
  MatSort,
} from '@angular/material';
import { merge, Subject } from 'rxjs';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { GlobalService } from '../../../../shared';

@Component({
  selector: 'app-aps-list',
  templateUrl: './aps-list.component.html',
  styleUrls: ['./aps-list.component.scss']
})
export class ApsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  inputValueChanged = new Subject<any>();

  private sortDirection: any;
  private sortField: any;
  pageSize = 10;
  length = 0;
  dataSource = [];

  dpOption: IDatePickerOption;
  date: any;

  filterWard: string;
  filterTitle: string;
  filterDescription: string;

  displayedColumns = [
    'wardNo',
    'title',
    'description',
    'createdOn',
    'id'
  ];

  constructor(
    private globalService: GlobalService,
    private apeService: ApsService
  ) {
    this.dpOption = this.globalService.getDatePickerOption;
    this.dpOption.required = false;

    this.inputValueChanged.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(() => {
        this.paginator.pageIndex = 0;
        this.loadApe(true);
      });
  }

  ngOnDestroy() {
    this.inputValueChanged.unsubscribe();
  }

  onAddClicked() {
    const data = { flag: 'add' };
    this.buttonClicked.emit(data);
  }

  loadApe(isSecondTime: boolean = true) {
    if (isSecondTime === false) {
      this.setInitialState();
    }
    this.globalService.setLoading(true);
    this.pageSize = this.paginator.pageSize
      ? this.paginator.pageSize
      : this.pageSize;
    const pageNo = this.paginator.pageIndex ? this.paginator.pageIndex + 1 : 1;
    const orderBy = [];
    const filterBy = [];

    if (this.sortField) {
      orderBy.push(
        JSON.stringify({ field: this.sortField, direction: this.sortDirection })
      );
    }
    if (this.filterWard) {
      filterBy.push(JSON.stringify({ field: 'wardNo', value: this.filterWard }));
    }

    if (this.filterTitle) {
      filterBy.push(JSON.stringify({ field: 'title', value: this.filterTitle }));
    }

    if (this.filterDescription) {
      filterBy.push(
        JSON.stringify({ field: 'description', value: this.filterDescription })
      );
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
    this.apeService
      .getAllApe(pageNo, this.pageSize, filterBy, orderBy)
      .subscribe(x => {
        x.ape.forEach((element: { createdOn: any; title: any }) => {
          element.createdOn = this.globalService.getShortDateWithTime(
            element.createdOn
          );
        });
        this.dataSource = x.ape;
        this.length = x.totalRows;
        this.globalService.setLoading(false);
      });
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [5, 10, 25, 50, 100, 500];
    this.paginator.pageSize = this.pageSize;
    this.loadApe();
    this.globalService.setLoading(false);
  }
  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection =
        x.direction === 'asc'
          ? 'ASC'
          : x.direction === 'desc'
            ? 'DESC'
            : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadApe()))
      .subscribe();
  }
  private setInitialState() {
    this.paginator.pageIndex = 0;
    this.sortField = 'createdOn';
    this.sortDirection = 'DESC';
  }
  showDetails(id: number) {
    const data = { flag: 'view', id: id };
    this.buttonClicked.emit(data);
  }

  dateChanged($event: any) {
    this.date = $event;
    this.loadApe(true);
  }

}
