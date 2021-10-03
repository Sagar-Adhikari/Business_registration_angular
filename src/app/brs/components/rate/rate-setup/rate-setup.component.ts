import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RateTreeComponent } from '../rate-tree/rate-tree.component';
import { RateDetailsComponent } from '../rate-details/rate-details.component';
import { RateCreateComponent } from '../rate-create/rate-create.component';
import { GlobalService } from 'src/app/shared';

@Component({
  selector: 'app-rate-setup',
  templateUrl: './rate-setup.component.html',
  styleUrls: ['./rate-setup.component.scss']
})
export class RateSetupComponent implements OnInit, OnDestroy {
  @ViewChild('tree') tree: RateTreeComponent;
  @ViewChild('details') details: RateDetailsComponent;
  @ViewChild('createForm') createForm: RateCreateComponent;
  isLeftVisible = true;

  constructor(private globalService: GlobalService) {
    const pageTitle = 'अनुसुची ४';
    this.globalService.setPageTitle(pageTitle);
  }

  ngOnInit() {
    this.globalService.setLoading(false);
  }
  ngOnDestroy() {
    this.tree = undefined;
    this.details = undefined;
    this.createForm = undefined;
  }

  toogleForm() {
    this.isLeftVisible = this.isLeftVisible ? false : true;
  }

  onTreeNodeClicked(ev: any) {
    this.details.loadChildren(ev);
  }

  onButtonClicked(ev: any) {
    const pageTitle = 'अनुसुची ४ काे बिवरण';
    this.globalService.setPageTitle(pageTitle);
    if (ev.event === 'back') {
      this.tree.selectNode(+ev.parentId);
    } else if (ev.event === 'drill') {
      this.globalService.setLoading(true);
      this.tree.selectNode(+ev.rateId);
    } else if (ev.event === 'new') {
      this.createForm.loadForm('create', +ev.parentId);
      this.toogleForm();
    } else if (ev.event === 'edit') {
      this.createForm.loadForm('edit', +ev.parentId, +ev.rateId);
      this.toogleForm();
    } else if (ev.event === 'delete') {
      this.createForm.loadForm('delete', +ev.parentId, +ev.rateId);
      this.toogleForm();
    } else if (ev.event === 'canceled') {
      this.toogleForm();
    } else if (ev.event === 'saved') {
      this.toogleForm();
      this.tree.refresh(+ev.parentId);
    } else if (ev.event === 'deleted') {
      this.toogleForm();
      this.tree.refresh(+ev.parentId);
    }
  }


}
