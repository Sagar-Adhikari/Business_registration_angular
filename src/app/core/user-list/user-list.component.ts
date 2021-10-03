import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatMenuTrigger } from '@angular/material';
import { UserService } from '../services/user.service';
import { GlobalService } from 'src/app/shared';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { UserFormModel } from '../form-model/user-form-model';
import { ResetPasswordInput } from 'src/app/generated/graphql';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('menuTriggerFilter') private menuTriggerFilter: MatMenuTrigger;
  @ViewChild('menuTriggerReset') private menuTriggerReset: MatMenuTrigger;
  @ViewChild('menuTriggerAdd') private menuTriggerAdd: MatMenuTrigger;
  @ViewChild('menuTriggerEdit') private menuTriggerEdit: MatMenuTrigger;

  @ViewChild('userName') userName: ElementRef;
  @ViewChild('elAddUser') elAddUser: any;
  @ViewChild('elEditUser') elEditUser: any;
  @ViewChild('elNewPassword') elNewPassword: ElementRef;
  @ViewChild('formReset') formToReset: any;

  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  private sortDirection: any;
  private sortField: any;
  private userId: any;

  userFullName = '';
  dataSource = [];
  pageSize = 10;
  length = 0;
  displayedColumns = ['imageUrl', 'fullName', 'email', 'mobileNo', 'roleName', 'createdOn', 'id'];
  filterName = null;
  filterRoleName = null;
  filterEmail = null;

  passwordResetForm: FormGroup;

  constructor(private userService: UserService, private globalService: GlobalService) {
    this.passwordResetForm = new UserFormModel().passwordResetForm();
  }

  ngOnInit() {
    this.paginator.showFirstLastButtons = true;
    this.paginator.pageSizeOptions = [10, 25, 50, 100, 500];
    this.paginator.pageSize = 10;
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe((x: { active: any; direction: string; }) => {
      this.paginator.pageIndex = 0;
      this.sortField = x.active;
      this.sortDirection = x.direction === 'asc' ? 'ASC' : x.direction === 'desc' ? 'DESC' : undefined;
    });
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadUsers())
    ).subscribe();
  }


  loadUsers(isSecondTime: boolean = true) {
    if (isSecondTime) {
      this.globalService.setLoading(true);
    }
    this.pageSize = this.paginator.pageSize ? this.paginator.pageSize : 10;
    const pageNo = this.paginator.pageIndex ? this.paginator.pageIndex : 0;
    const orderBy = [];
    const filterBy = [];
    if (this.sortField) {
      orderBy.push(JSON.stringify({ field: this.sortField, direction: this.sortDirection }));
    }

    if (this.filterName) {
      filterBy.push(JSON.stringify({ field: 'firstName', value: this.filterName }));
    }

    if (this.filterEmail) {
      filterBy.push(JSON.stringify({ field: 'email', value: this.filterEmail }));
    }

    if (this.filterRoleName) {
      filterBy.push(JSON.stringify({ field: 'roleName', value: this.filterRoleName }));
    }

    if (filterBy.length > 0) {
      this.globalService.setPageTitle('युजरहरू ः फिल्टरड');
    } else {
      this.globalService.setPageTitle('युजरहरू');
    }
    this.userService.getAllUsers(pageNo, this.pageSize, filterBy, orderBy).subscribe(x => {
      x.users.forEach((element: { createdOn: any; }) => {
        element.createdOn = this.globalService.getShortDateWithTime(element.createdOn);
      });
      this.dataSource = x.users;
      this.length = x.totalRows;
      if (isSecondTime) {
        this.globalService.setLoading(false);
      }
    });
  }

  onFilterOpen(event: any) {
    this.userName.nativeElement.focus();
  }

  onResetPasswordOpen(event: any, id: any, name: any) {
    this.formToReset.resetForm();
    this.elNewPassword.nativeElement.focus();
    this.userId = id;
    this.userFullName = name;
  }
  onUserEditOpen(event: any, id: any) {

    this.elEditUser.focus(id);

  }

  onAddMenuOpened(event: any) {
    this.elAddUser.focus();
  }

  menuCancel() {
    this.menuTriggerFilter.closeMenu();
    this.menuTriggerReset.closeMenu();
  }
  filterData() {
    this.setInitialState();
    this.loadUsers();
    this.menuTriggerFilter.closeMenu();
  }

  private setInitialState() {
    this.paginator.pageIndex = 0;
    this.sortField = 'createdOn';
    this.sortDirection = 'DESC';
  }
  clearFilter() {
    this.setInitialState();
    this.filterName = null;
    this.filterRoleName = null;
    this.filterEmail = null;
    this.loadUsers();
    this.menuTriggerFilter.closeMenu();
  }

  onAddClicked() {
    const ev = { event: 'add' };
    this.buttonClicked.emit(ev);
  }
  onEditClicked(id: any) {
    const ev = { event: 'edit', id: +id };
    this.buttonClicked.emit(ev);
  }

  onDeleteClicked(id: any) {
    this.userService.deleteUser(id).subscribe(x => {
      if (x) {
        this.globalService.showSuccessMessage('युजर डिलिट भयाे ।');
        this.loadUsers();
      }
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  resetPassword({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.globalService.setLoading(true);
      const x: ResetPasswordInput = {
        id: this.userId,
        newPassword: value.newPassword
      };

      this.userService.passwordReset(x).subscribe(data => {
        if (data) {
          this.globalService.showSuccessMessage('पासवर्ड रिसेट भयाे ।');
          this.menuTriggerReset.closeMenu();
        }
      }, (() => {
        this.globalService.showErrorMessage('पासवर्ड रिसेट भएन।');
      }));
    } else {
      this.globalService.showErrorMessage('कृपया नयाँ पासवर्ड भर्नुहाेस ।');
    }

  }
  userFormEvent(event: any) {
    if (event === 'cancel') {
      this.menuTriggerAdd.closeMenu();
      this.menuTriggerEdit.closeMenu();
    } else {
      this.menuTriggerAdd.closeMenu();
      this.menuTriggerEdit.closeMenu();
      this.setInitialState();
      this.loadUsers(true);
    }
  }
}
