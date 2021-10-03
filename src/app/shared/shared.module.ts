import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectPipe } from './select.pipe';
import { MessageBoxComponent } from './message-box/message-box.component';


import {
    MatInputModule, MatCheckboxModule, MatCardModule,
    MatIconModule, MatButtonModule, MatTreeModule, MatOptionModule,
    MatFormFieldModule, MatTooltipModule, MatMenuModule, MatSelectModule,
} from '@angular/material';
import { AlertComponent } from './alert/alert.component';
import { SlidePanelComponent } from './slide-panel/slide-panel.component';
// import { SlidePanelDatepickerComponent } from './slide-panel-datepicker/slide-panel-datepicker.component';

@NgModule({
    declarations: [
        SelectPipe,
        MessageBoxComponent,
        AlertComponent,
        SlidePanelComponent,
        // SlidePanelDatepickerComponent,
    ],
    imports: [
        CommonModule,
        MatInputModule, MatCheckboxModule,
        MatIconModule, MatCardModule, MatButtonModule, MatTreeModule, MatOptionModule,
        MatFormFieldModule, MatTooltipModule, MatMenuModule, MatSelectModule
    ],
    entryComponents: [MessageBoxComponent],
    exports: [
        SelectPipe,
        AlertComponent, SlidePanelComponent],
    // schemas: [
    //     CUSTOM_ELEMENTS_SCHEMA,
    //     NO_ERRORS_SCHEMA
    // ]
})
export class SharedModule { }
