import { FormBuilder, Validators } from '@angular/forms';

export class UserFormModel {
    constructor() {
    }
    public createUserForm() {
        return new FormBuilder().group({
            firstName: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.minLength(1)])],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            roleId: ['', Validators.required],
            mobileNo: [null, Validators.compose([Validators.required,
            Validators.minLength(10), Validators.maxLength(10)])],
            wardId: ['', Validators.required],
            password: ['', Validators.compose([Validators.required,
            // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,15}$'),
            Validators.minLength(6), Validators.maxLength(15)])]
        });
    }

    public editUserForm() {
        return new FormBuilder().group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            roleId: ['', Validators.required],
            status: ['', Validators.required],
            mobileNo: [null, Validators.compose([Validators.required,
            Validators.minLength(10), Validators.maxLength(10)])],
            wardId: ['', Validators.required]
        });
    }

    // public UserProfileEditForm() {
    //     return new FormBuilder().group({
    //         displayName: ['', Validators.required],
    //         firstName: ['', Validators.required],
    //         lastName: ['', Validators.required],
    //         gender: ['Male', Validators.required],
    //         dateOfBirth: [new Date(), Validators.required]
    //     });
    // }

    public UserLoginForm() {
        return new FormBuilder().group({
            email: ['', Validators.compose([Validators.required, Validators.email])],
            password: ['', Validators.compose([Validators.required,
            // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,15}$'),
            Validators.minLength(6), Validators.maxLength(15)])],
        });
    }

    // public ForgotPasswordForm() {
    //     return new FormBuilder().group({
    //         email: ['', Validators.compose([Validators.required, Validators.email])],
    //         captcha: ['', Validators.required]
    //     });
    // }

    public changePasswordForm() {
        return new FormBuilder().group({
            oldPassword: ['', Validators.compose([Validators.required,
            //  Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,15}$'),
            Validators.minLength(6), Validators.maxLength(15)])],
            newPassword: ['', Validators.compose([Validators.required,
            //  Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,15}$'),
            Validators.minLength(6), Validators.maxLength(15)])],
        });
    }

    public passwordResetForm() {
        return new FormBuilder().group({
            newPassword: ['', Validators.compose([Validators.required,
            // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,15}$'),
            Validators.minLength(6), Validators.maxLength(15)])],
        });
    }
}
