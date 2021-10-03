import { ApsRegisterComponent } from './../aps-register/aps-register.component';
import { ApsListComponent } from './../aps-list/aps-list.component';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/shared';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-aps-main',
  templateUrl: './aps-main.component.html',
  styleUrls: ['./aps-main.component.scss']
})
export class ApsMainComponent implements OnInit {
  @ViewChild('list') list: ApsListComponent;
  @ViewChild('createForm') createForm: ApsRegisterComponent;
  isLeftVisible = true;

  viewType: string;
  formType = 'add';

  constructor(
    private globalService: GlobalService,
    private route: ActivatedRoute
  ) { }


  onButtonClicked($event: any) {
    if ($event.flag === 'saveAndclose') {
      this.globalService.setPageTitle('ब्यवसायीक सम्भाब्यताहरू');
      this.list.loadApe(false);
      this.isLeftVisible = true;
    } else if ($event.flag === 'close') {
      this.globalService.setPageTitle('ब्यवसायीक सम्भाब्यताहरू');
      this.isLeftVisible = true;
    } else if ($event.flag === 'add') {
      this.globalService.setPageTitle('नयाँ ब्यवसायीक सम्भाब्यता');
      setTimeout(() => {
        this.createForm.loadForm($event);
        this.isLeftVisible = false;
      }, 20);
    } else if ($event.flag === 'view') {
      this.globalService.setPageTitle('ब्यवसायीक सम्भाब्यता');
      this.createForm.loadForm($event);
      this.isLeftVisible = false;
    }
  }

  ngOnInit() {
    this.globalService.setPageTitle('ब्यवसायीक सम्भाब्यताहरू');
    this.list.loadApe();
    this.route.params.subscribe(routeParams => {
      this.viewType = routeParams.id;
    });
  }


  toogleForm() {
    this.isLeftVisible = this.isLeftVisible ? false : true;
    if (this.isLeftVisible) {
      if (this.formType !== 'add') {
        this.createForm.clearForm();
      }
    }
  }

}
