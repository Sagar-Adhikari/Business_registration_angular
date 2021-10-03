import { FormModel } from 'src/app/brs/form-module';
import { ApeInput } from './../../../../generated/graphql';
import { ApsService } from './../aps.service';
import { GlobalService } from './../../../../shared/global.service';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-aps-register',
  templateUrl: './aps-register.component.html',
  styleUrls: ['./aps-register.component.scss']
})
export class ApsRegisterComponent implements OnInit {

  @Output() buttonClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild('form') formToReset: any;
  apeRegisterForm: FormGroup;
  id: number;
  pageTitle = '';
  wardList: [];

  editorStyle = {
    height: '300px',
    backgroundColor: 'white'
  };

  config = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ align: [] }],
      ['clean']
      // [{ script: 'sub' }, { script: 'super' }],
      // [{ indent: '-1' }, { indent: '+1' }],
      // [{ direction: 'rtl' }],
      // [{ header: [1, 2, 3, 4, 5, 6, false] }],
      // [{ color: [] }, { background: [] }],
      // [{ font: [] }],
      // [{ header: 1 }, { header: 2 }],
    ]
  };
  constructor(
    private globalService: GlobalService,
    private apeService: ApsService
  ) {
    this.apeRegisterForm = new FormModel().ApeForm();

    this.apeService.getWardList().subscribe(x => {
      this.wardList = x;
    });
  }

  ngOnInit() { }

  closeButtonClick() {
    const data = { flag: 'close' };
    this.buttonClicked.emit(data);
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }) {
    if (!valid) {
      this.globalService.showErrorMessage('आवस्यक डाटा पुगेको छैन ।');
      return;
    }

    const x: ApeInput = {
      id: this.id,
      description: value.description,
      title: value.title,
      wardNo: +value.wardNo
    };

    this.apeService.saveAPE(x).subscribe(
      y => {
        this.globalService.showSuccessMessage('data saved successfully!');
        const data = { flag: 'saveAndclose' };
        this.buttonClicked.emit(data);
      },
      error => {
        this.globalService.showErrorMessage('Data saving Error');
      }
    );
  }
  loadForm(data: any) {
    this.clearForm();

    if (data.flag === 'add') {
      this.pageTitle = 'नयाँ ब्यवसायीक सम्भाब्यता';
    } else if (data.flag === 'view') {
      this.pageTitle = 'ब्यवसायीक सम्भाब्यता';
    }
    if (data.id) {
      this.id = +data.id;
      this.apeService.getApeById(this.id).subscribe(x => {
        this.apeRegisterForm.controls['wardNo'].setValue(x.wardNo.toString());
        this.apeRegisterForm.controls['title'].setValue(x.title);
        this.apeRegisterForm.controls['description'].setValue(x.description);
      });
    } else {
      this.id = undefined;
    }
  }
  saveClicked(apeRegisterForm) {
    this.onSubmit(apeRegisterForm);
  }
  onDelete() {
    this.apeService.deleteApe(this.id).subscribe(
      x => {
        this.globalService.showSuccessMessage('डाटा सफलतापूर्वक डिलिट भयाे।');
        const data = { flag: 'saveAndclose' };
        this.buttonClicked.emit(data);
      },
      error => {
        this.globalService.showErrorMessage(error.message);
      }
    );
  }
  clearForm() {
    this.formToReset.resetForm();
  }

  onEditorFocused(quill: any) {
    quill.focus();
  }

  // setFocus(editor) {
  //   console.log(editor);
  //   editor.focus();
  //   // editor.on('focus', (event) => { // Do some stuff }
  //   // editor.on('blur', (event) => { // Do some stuff }
  //   // ...
  // }

}
