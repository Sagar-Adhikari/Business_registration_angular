import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ParamService } from '../../../services/param.service';
import { ParamUserService } from '../../services/param-user.service';
import { GlobalService } from '../../../../../../app/shared';
import { FormModel } from '../../../../../../app/tools/parameter/form-model';
import { ParamInput } from 'src/app/generated/graphql';


@Component({
  selector: 'app-param-user-create',
  templateUrl: './param-user-create.component.html',
  styleUrls: ['./param-user-create.component.scss'],
  providers: [ParamService, ParamUserService]
})
export class ParamUserCreateComponent implements OnInit {
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  paramCreateForm: FormGroup;
  formType: string;
  formTitle: string;
  isDelete = false;
  dataTypeList: any[] = [];
  dataTypeId: any;
  isGroup = false;

  dataTypeReadOnly = false;
  saveButtonCaption = 'Save';
  private parentId: number;
  private paramId: number;
 // private selectedFile = null;
 // private iconPath = environment.icon_image_path + 'param/p/';

  // imgUrl: any = this.iconPath + 'default.jpg';

  private clearForm() {
    this.paramCreateForm = new FormModel().ParamUserForm();
    this.parentId = undefined;
    this.paramId = undefined;
    this.dataTypeReadOnly = false;
    this.isDelete = false;
    this.isGroup = false;
    this.dataTypeId = undefined;
  }

  public loadForm(formType: string, parentId: number, paramId?: number) {
    // formType= 'Create/Edit/Delete'
    this.globalService.setLoading(true);
    this.clearForm();
    this.formType = formType;
    if (this.formType === 'create') {
      this.formTitle = 'Create Parameter';
      const pageTitle = 'नयाँ पारामिटर';
      this.globalService.setPageTitle(pageTitle);
    } else if (this.formType === 'delete') {
      this.formTitle = 'Delete Parameter';
      this.isDelete = true;
      const pageTitle = 'पारामिटर डिलिट';
      this.globalService.setPageTitle(pageTitle);
    } else if (this.formType === 'edit') {
      this.formTitle = 'Edit Parameter';
      const pageTitle = 'पारामिटर मिलाउने';
      this.globalService.setPageTitle(pageTitle);
    }
    this.parentId = parentId;
    this.paramId = paramId;
    if (paramId) {
      this.paramUserService.getDetailsForEdit(paramId, parentId).subscribe(x => {
        this.saveButtonCaption = 'Update';
        this.paramCreateForm.controls['parentName'].setValue(x.parent.name);
        this.paramCreateForm.controls['name'].setValue(x.details.name);
      //  this.paramCreateForm.controls['nameNepali'].setValue(x.details.nameNepali);
        this.isGroup = x.details.isGroup;
        this.paramCreateForm.controls['isGroup'].setValue(this.isGroup);
       // this.paramCreateForm.controls['imageURL'].setValue(x.details.imageURL);
        if (x.details.details.length > 0) {
          this.dataTypeId = x.details.details[0].dataTypeId;
          this.paramCreateForm.controls['dataTypeId'].setValue(this.dataTypeId.toString());
          this.paramCreateForm.controls['paramCode'].setValue(x.details.details[0].paramCode);
          this.paramCreateForm.controls['description'].setValue(x.details.details[0].description);
        //  this.paramCreateForm.controls['descriptionNepali'].setValue(x.details.details[0].descriptionNepali);
          if (x.details.details[0].script.length > 0) {
            this.paramCreateForm.controls['script'].setValue(x.details.details[0].script[0].script);
          }
        }
     //   this.imgUrl = this.iconPath + x.details.imageURL;
        this.groupChanged();
        this.globalService.setLoading(false);
      });
    } else {
      this.paramUserService.getParamUserById(parentId).subscribe(x => {
      //  this.imgUrl = this.iconPath + 'default.jpg';
        this.saveButtonCaption = 'Save';
        this.paramCreateForm.controls['parentName'].setValue(x.parameter.name);
        this.paramCreateForm.controls['isGroup'].setValue(false);
        this.groupChanged();
        this.globalService.setLoading(false);
      });
    }
  }

  onCancelledClicked() {
    const ev = { event: 'canceled' };
    this.buttonClicked.emit(ev);
  }

  public groupChanged() {
    this.isGroup = this.paramCreateForm.controls.isGroup.value;
    if (this.isGroup === true) {
      this.paramCreateForm.get('dataTypeId').clearValidators();
      this.paramCreateForm.get('paramCode').clearValidators();
      this.paramCreateForm.get('description').clearValidators();
     // this.paramCreateForm.get('descriptionNepali').clearValidators();
      this.paramCreateForm.get('script').clearValidators();
    } else {
      this.paramCreateForm.get('dataTypeId').setValidators([Validators.required]);
      this.paramCreateForm.get('paramCode').setValidators(
        Validators.compose(
          [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
        )
      );
      this.paramCreateForm.get('description').setValidators(
        Validators.compose(
          [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]
        )
      );
      // this.paramCreateForm.get('descriptionNepali').setValidators(
      //   Validators.compose(
      //     [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]
      //   )
      // );

      this.dataTypeId = this.paramCreateForm.controls.dataTypeId.value;
      if (this.dataTypeId === '10' || this.dataTypeId === '20') {
        this.paramCreateForm.get('script').setValidators(
          Validators.compose(
            [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]
          )
        );
      } else {
        this.paramCreateForm.get('script').clearValidators();
      }
    }

    this.paramCreateForm.get('dataTypeId').updateValueAndValidity();
    this.paramCreateForm.get('paramCode').updateValueAndValidity();
    this.paramCreateForm.get('description').updateValueAndValidity();
    // this.paramCreateForm.get('descriptionNepali').updateValueAndValidity();
    this.paramCreateForm.get('script').updateValueAndValidity();

  }

  // onFileSelected(event: any) {
  //   this.globalService.setLoading(true);
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     // tslint:disable-next-line:no-shadowed-variable
  //     reader.onload = (event: any) => {
  //       this.imgUrl = event.target.result;
  //       this.globalService.setLoading(false);
  //     };
  //     this.selectedFile = event.target.files[0];
  //     reader.readAsDataURL(event.target.files[0]);
  //   } else {
  //     this.selectedFile = null;
  //     this.imgUrl = null;
  //   }
  // }

  constructor(private paramService: ParamService,
    private paramUserService: ParamUserService,
    private globalService: GlobalService) {
    this.paramCreateForm = new FormModel().ParamUserForm();
    this.paramService.findSystemDatatypes().subscribe(x => {
      this.dataTypeList = x.dataTypes;
    });
  }


  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (!valid) {
      return;
    }
    this.globalService.setLoading(true);
    let script: string;
    if (this.isGroup) {
      this.dataTypeId = undefined;
    } else {
      if (+this.dataTypeId === 10 || +this.dataTypeId === 20) {
        script = value.script;
      }
    }

    let paramData: ParamInput = {
      id: this.paramId,
      name: value.name,
      parentId: this.parentId,
      isGroup: this.isGroup,
      dataTypeId: +this.dataTypeId,
      description: this.isGroup ? undefined : value.description,
      paramCode: this.isGroup ? undefined : value.paramCode,
      script: script
    };
    if (this.paramId) {
      paramData = { ...paramData, id: this.paramId };
    }

    this.paramUserService.save(paramData).subscribe(data => {
      if (data) {
        const ev = { event: 'saved', parentId: this.parentId };
        this.buttonClicked.emit(ev);
        if (this.paramId) {
          this.globalService.showSuccessMessage('Parameter edited successfully!');
        } else {
          this.globalService.showSuccessMessage('Parameter saved successfully!');
        }
      }
    }, (error: any) => {
      this.globalService.showErrorMessage(error.message);
    });
  }


  delete() {
    this.globalService.setLoading(true);
    this.paramUserService.delete(+this.paramId).subscribe(x => {
      const ev = { event: 'deleted', parentId: this.parentId };
      this.buttonClicked.emit(ev);
      this.globalService.showSuccessMessage('Parameter Deleted Successfully.');
    }, (error: any) => {
      this.globalService.showErrorMessage(error.message);
    });
  }

  ngOnInit() {
  }

}
