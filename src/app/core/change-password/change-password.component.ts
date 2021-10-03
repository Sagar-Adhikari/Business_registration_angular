import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormGroup } from '@angular/forms';
import { UserFormModel } from '../form-model/user-form-model';
import * as language from './language';
import { Router } from '@angular/router';
// import { MatSnackBar } from '@angular/material';
import { ChangePasswordInput } from 'src/app/generated/graphql';
import { GlobalService } from 'src/app/shared';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [UserService]
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('oldPassword') oldPassword: ElementRef;

  changePasswordForm: FormGroup;

  currentUrl: any = '../../../assets/logo/logo.jpg';
  infoBackgroundUrl: any = '../../../assets/background/change-password-background.png';
  infoTransparentUrl: any = '../../../assets/background/change-password-transparent.png';


  // lang = 0;
  placeHolder: any;
  errorLabel: any;
  hintLabel: any;
  label: any;
  appMessage: any;
  changeNewPW = true;
  changeOldPW = true;


  constructor(private userService: UserService,
    private router: Router,
    private globalService: GlobalService) {
    this.changePasswordForm = new UserFormModel().changePasswordForm();
    this.placeHolder = language.placeHolder;
    this.errorLabel = language.error;
    this.hintLabel = language.hint;
    this.label = language.label;
    this.appMessage = language.message;
    // this.globalService.language$.subscribe(x => {
    //   this.lang = x;
    // });
    this.globalService.setPageTitle( 'पासवर्ड परिवर्तन');
  }

  ngOnInit() {
    this.oldPassword.nativeElement.focus();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.globalService.setLoading(true);
      const x: ChangePasswordInput = {
        oldPassword: value.oldPassword,
        newPassword: value.newPassword
      };

      this.userService.changePassword(x).subscribe(data => {
        if (data) {
          this.router.navigate(['core/login']);
          this.globalService.showSuccessMessage(this.appMessage.success);
        }
      }, (() => {
        this.globalService.showErrorMessage(this.appMessage.error);
      }));
    }
  }
}
