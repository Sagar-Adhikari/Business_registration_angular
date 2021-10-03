import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  private _caption: string;
  private _message: string;
  private _disabled: false;

  @Input()
  get caption() {
    return this._caption;
  }
  set caption(caption) {
    this._caption = caption;
  }

  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }

  @Input() get message() {
    return this._message;
  }
  set message(message) {
    this._message = message;
  }

  @Output() success: EventEmitter<any> = new EventEmitter();
  // @Output() onload: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  onButtonClicked() {
    // this.onload.emit();
    const dialogDelete = this.dialog.open(MessageBoxComponent, {
      disableClose: false,
      hasBackdrop: true,
      autoFocus: true,
      panelClass: 'message-box-no-padding',
      data: {
        caption: this.caption + '  ?',
        messageText: this.message
      }
    });
    dialogDelete.afterClosed()
      .subscribe((result: any) => {
        if (result === 'yes') {
          this.success.emit(result);
        }
      });
    return false;
  }
}
