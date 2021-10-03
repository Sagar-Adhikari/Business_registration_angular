import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {
  caption = 'Alert!';
  messageText = 'Are you sure?';
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { caption: string, messageText: string },
    private dialogRef: MatDialogRef<MessageBoxComponent>) {
    if (data.caption) {
      this.caption = data.caption;
    }
    if (data.messageText) {
      this.messageText = data.messageText;
    }
  }
  ngOnInit() {
  }
  closeDialog(result: any) {
    this.dialogRef.close(result);
  }
}
