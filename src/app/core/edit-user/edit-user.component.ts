import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { GlobalService } from 'src/app/shared';
import { UserFormModel } from '../form-model/user-form-model';
import { UserEditInput } from 'src/app/generated/graphql';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  // providers: [UserService]
})
export class EditUserComponent implements OnInit {
  @ViewChild('elFirstName') elFirstName: ElementRef;
  @ViewChild('formData') formToReset: any;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();

  email = '';
  createdOn: any;
  passwordChangedOn: any;
  isDataLoaded = false;
  userEditForm: FormGroup;
  roleList: any = [];
  statusList: any = [
    { id: 1, text: 'Active' },
    { id: 2, text: 'Inactive' }
  ];
  private userId: any;

  focus(id: string) {
    this.email = '';
    this.passwordChangedOn = '';
    this.createdOn = '';

    this.isDataLoaded = false;
    this.userId = id;
    this.globalService.setLoading(true);
    this.formToReset.resetForm();
    this.userService.getUserById(id).subscribe(x => {
      this.email = x.email;
      this.passwordChangedOn = this.globalService.getShortDateWithTime(x.passwordChangedOn);
      this.createdOn = this.globalService.getShortDateWithTime(x.createdOn);
      this.userEditForm.controls['firstName'].setValue(x.firstName);
      this.userEditForm.controls['lastName'].setValue(x.lastName);
      this.userEditForm.controls['mobileNo'].setValue(x.mobileNo);
      this.userEditForm.controls['roleId'].setValue(x.roleId.toString());
      this.userEditForm.controls['status'].setValue(x.status);
      this.userEditForm.controls['wardId'].setValue(x.wardId);
      this.globalService.setLoading(false);
      this.isDataLoaded = true;
    }, error => {
      this.globalService.showErrorMessage('डाटा लाेड सफल भएन ।');
    });
    this.elFirstName.nativeElement.focus();
  }
  constructor(private userService: UserService, private globalService: GlobalService) {
    this.userEditForm = new UserFormModel().editUserForm();
    this.userService.getRoles().subscribe(x => {
      this.roleList = x;
    });
  }

  ngOnInit() {
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.globalService.setLoading(true);
      const x: UserEditInput = {
        id: this.userId,
        firstName: value.firstName,
        lastName: value.lastName,
        mobileNo: value.mobileNo,
        roleId: +value.roleId,
        status: +value.status,
        wardId: +value.wardId
      };

      this.userService.editUser(x).subscribe(data => {
        if (data) {
          this.globalService.showSuccessMessage('युजर इडिट सफल भयाे ।');
          this.buttonClicked.emit('saved');
        }
      }, (error => {
        this.globalService.showErrorMessage( error.message + ', युजर इडिट सफल भएन ।');
      }));
    } else {
      this.globalService.showErrorMessage('कृपया सबै फिल्डहरू भर्नुहाेस ।');
    }
  }
  cancelClick() {
    this.buttonClicked.emit('cancel');
  }
}
