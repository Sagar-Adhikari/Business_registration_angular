import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ParamUserTreeComponent } from '../param-user-tree/param-user-tree.component';
import { ParamUserDetailsComponent } from '../param-user-details/param-user-details.component';
import { ParamUserCreateComponent } from '../param-user-create/param-user-create.component';
import { GlobalService } from '../../../../../../app/shared';

@Component({
  selector: 'app-param-user-setup',
  templateUrl: './param-user-setup.component.html',
  styleUrls: ['./param-user-setup.component.scss']
})
export class ParamUserSetupComponent implements OnInit, OnDestroy {
  @ViewChild('tree') tree: ParamUserTreeComponent;
  @ViewChild('details') details: ParamUserDetailsComponent;
  @ViewChild('createForm') createForm: ParamUserCreateComponent;
  isLeftVisible = true;

  constructor(private globalService: GlobalService) {
    const pageTitle = 'पारामिटर विवरण';
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
    const pageTitle = 'पारामिटर विवरण';
    this.globalService.setPageTitle(pageTitle);
    if (ev.event === 'back') {
      this.tree.selectNode(+ev.parentId);
    } else if (ev.event === 'drill') {
      this.globalService.setLoading(true);
      this.tree.selectNode(+ev.paramId);
    } else if (ev.event === 'new') {
      this.createForm.loadForm('create', +ev.parentId);
      this.toogleForm();
    } else if (ev.event === 'edit') {
      this.createForm.loadForm('edit', +ev.parentId, +ev.paramId);
      this.toogleForm();
    } else if (ev.event === 'delete') {
      this.createForm.loadForm('delete', +ev.parentId, +ev.paramId);
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
