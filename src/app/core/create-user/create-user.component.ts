import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserFormModel } from '../form-model/user-form-model';
import { UserService } from '../services/user.service';
import { GlobalService } from 'src/app/shared';
import { UserAddInput } from 'src/app/generated/graphql';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  @ViewChild('elFirstName') elFirstName: ElementRef;
  @ViewChild('formData') formToReset: any;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  userCreateForm: FormGroup;
  hidePassword = true;
  roleList: any = [];

  focus() {
    this.formToReset.resetForm();
    this.elFirstName.nativeElement.focus();
  }
  constructor(
    private userService: UserService,
    private globalService: GlobalService
  ) {
    this.userCreateForm = new UserFormModel().createUserForm();
    this.userService.getRoles().subscribe(x => {
      this.roleList = x;
    });
  }

  ngOnInit() { }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (valid) {
      this.globalService.setLoading(true);
      const x: UserAddInput = {
        email: value.email,
        firstName: value.firstName,
        lastName: value.lastName,
        mobileNo: value.mobileNo,
        roleId: +value.roleId,
        password: value.password,
        wardId: +value.wardId,
        status: 1
      };

      this.userService.createUser(x).subscribe(
        data => {
          if (data) {
            this.globalService.showSuccessMessage('नयाँ युजर रजिस्टर भयाे ।');
            this.buttonClicked.emit('saved');
          }
        },
        error => {
          this.globalService.showErrorMessage(error.message + ', नयाँ युजर रजिस्टर भएन ।');
        }
      );
    } else {
      this.globalService.showErrorMessage('कृपया सबै फिल्डहरू भर्नुहाेस ।');
    }
  }
  cancelClick() {
    this.buttonClicked.emit('cancel');
  }
}
