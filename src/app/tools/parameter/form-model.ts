import { FormBuilder, Validators } from '@angular/forms';

export class FormModel {
    // public ParamModuleForm() {
    //     return new FormBuilder().group({
    //         name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
    //         nameNepali: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
    //         isGroup: [''],
    //         parentName: [''],
    //         dataTypeId: [''],
    //         paramCode: [''],
    //         description: [''],
    //         script: [''],
    //     });
    // }

    public ParamUserForm() {
        return new FormBuilder().group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
            // nameNepali: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100)])],
            isGroup: [''],
            parentName: [''],
            dataTypeId: [''],
            paramCode: [''],
            description: [''],
            script: [''],
          //  imageURL: [''],
        });
    }
}
