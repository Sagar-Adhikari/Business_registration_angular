import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserFormModel } from '../form-model/user-form-model';
import * as language from './language';
import { Router } from '@angular/router';
import { GlobalService } from '../../shared/global.service';
import { ParamService } from 'src/app/tools/parameter';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {

  @ViewChild('useremail') userEmail: ElementRef;
  loginForm: FormGroup;
  currentUrl: any = 'assets/logo/nepalGovernmentLogo.png';
  infoBackgroundUrl: any = 'assets/background/login-background.png';
  infoTransparentUrl: any = 'assets/background/transparent.png';

  placeHolder: any;
  errorLabel: any;
  hintLabel: any;
  label: any;
  hidePassword = true;
  constructor(
    private userService: UserService,
    private router: Router,
    private globalService: GlobalService,
    private paramService: ParamService
  ) {
    this.loginForm = new UserFormModel().UserLoginForm();
    this.placeHolder = language.placeHolder;
    this.errorLabel = language.error;
    this.hintLabel = language.hint;
    this.label = language.label;
    this.globalService.setPageTitle(this.label.pageTitle);
  }

  ngOnInit() {
    this.userEmail.nativeElement.focus();
  }

  // ngAfterViewInit() {
  //   this.globalService.setLoading(false);
  // }
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.globalService.setLoading(true);
      this.userService.login(value.email, value.password).subscribe(({ data }: any) => {
        if (data.login) {
          this.globalService.setToken(data.login.token, data.login.refreshToken, data.login.user);

          this.paramService.getParamValues().subscribe(x => {
            this.globalService.loadProperties(x);
          });

          if (data.login.user.roleId === 5) {
            this.router.navigate(['list-ape']);

          } else {
            // list-ape
            this.router.navigate(['dashboard']);

          }

          this.globalService.showSuccessMessage(this.label.success);
        }
      }, (error: any) => {
        this.globalService.showErrorMessage(error);
      });
    } else {
      this.globalService.showErrorMessage('तँपाइले भरेकाे डाटा मिलेन, कृपया मिलेकाे डाटा भर्नुहाेस् ।');
    }
  }

}
