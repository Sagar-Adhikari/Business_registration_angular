import {
  Component, OnInit, Output, EventEmitter, ViewChild,
  ElementRef, ViewChildren, Renderer2, AfterViewChecked, AfterViewInit, OnDestroy
} from '@angular/core';

import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { ParamUserService } from '../../services/param-user.service';
import { of } from 'rxjs';
import { GlobalService } from '../../../../../../app/shared';
import { environment } from '../../../../../../environments/environment';

interface TreeNode {
  id: number;
  name: string;
  nameNepali: string;
  parentId: number;
  imageURL: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-param-user-tree',
  templateUrl: './param-user-tree.component.html',
  styleUrls: ['./param-user-tree.component.scss'],
  providers: [ParamUserService]
})
export class ParamUserTreeComponent implements OnInit, AfterViewChecked, AfterViewInit {
  @Output() nodeClicked: EventEmitter<any> = new EventEmitter();
  @ViewChild('tree') tree: { treeControl: { collapseAll: () => void; expandAll: () => void; }; };
  @ViewChild('treeContainer') treeContainer: ElementRef;
  @ViewChildren('treeNode', { read: ElementRef }) treeNodes: ElementRef[];

  iconUrl = environment.icon_image_path + 'param/t/';
  nestedTreeControl: NestedTreeControl<TreeNode>;
  nestedDataSource: MatTreeNestedDataSource<TreeNode>;
  filterText = '';
  hasListener: any[] = [];
  oldHighlight: ElementRef;
  manualClicked = false;
  private lastSelectedItemId = '';
  private allTreeData: any;


  hasNestedChild(_: number, node: TreeNode) {
    return node != null && node.children != null && node.children.length > 0;
  }

  updateHighlight = (newHighlight: ElementRef) => {
    // tslint:disable-next-line:no-unused-expression
    this.oldHighlight && this.renderer.removeClass(this.oldHighlight, 'background-highlight');
    this.renderer.addClass(newHighlight, 'background-highlight');
    this.oldHighlight = newHighlight;
  }

  constructor(private paramService: ParamUserService,
    private renderer: Renderer2,
    private globalService: GlobalService) {
    this.nestedTreeControl = new NestedTreeControl(node => of(node.children));
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.paramService.findAllGroup().subscribe(
      x => {
        this.allTreeData = x.groups;
        this.nestedTreeControl.dataNodes = x.groups;
        this.nestedDataSource.data = x.groups;
        if (x.groups.length > 0) {
          this.selectNode(x.groups[0].id);
        }
      }
    );
  }


  ngOnInit() {
  }

  ngAfterViewChecked() {
    if (this.treeNodes) {
      this.treeNodes.forEach((reference) => {
        if (reference) {
          if (!this.hasListener.includes(reference.nativeElement)) {
            let element: any;
            if (reference.nativeElement.childNodes.length > 1) {
              element = reference.nativeElement.childNodes[1];
            } else {
              element = reference.nativeElement.childNodes[0].childNodes[1];
            }
            this.renderer.listen(element, 'click', () => {
              this.updateHighlight(element);
            });
            this.hasListener = this.hasListener.concat([reference.nativeElement]);
          }
          this.hasListener = this.hasListener.filter((element) => document.contains(element));
        }
      });
    }
    if (this.lastSelectedItemId !== '') {
      const elRef = this.treeNodes.filter((element) => element.nativeElement.id === this.lastSelectedItemId)[0];
      if (elRef) {
        if (!this.manualClicked) {
          const scroll = elRef.nativeElement.offsetTop + elRef.nativeElement.offsetHeight - this.treeContainer.nativeElement.offsetHeight;
          if (scroll > 0) {
            this.treeContainer.nativeElement.scrollTop = scroll;
          } else {
            this.treeContainer.nativeElement.scrollTop = 0;
          }
        }
        let ele: any;
        if (elRef.nativeElement.childNodes.length > 1) {
          ele = elRef.nativeElement.childNodes[1];
        } else {
          ele = elRef.nativeElement.childNodes[0].childNodes[1];
        }
        this.updateHighlight(ele);
        this.lastSelectedItemId = '';
      }
    }
  }

  ngAfterViewInit() {

  }

  selectNode(id: number) {
    this.manualClicked = false;
    for (let i = 0, len = this.allTreeData.length; i < len; i++) {
      if (this.allTreeData[i].id.toString() === id.toString()) {
        const current = this.allTreeData[i];
        this.nestedTreeControl.expand(current);
        // current = { ...current, moduleId: this.selectedModuleId === 0 ? null : +this.selectedModuleId };
        this.nodeClicked.emit(current);
        this.lastSelectedItemId = current.id.toString();
        return;
      } else {
        if (this.scanChild(this.allTreeData[i], id) === true) {
          break;
        }
      }
    }
  }


  scanChild(element: any, id: number) {
    const children = element.children;
    if (children) {
      for (let i = 0, len = children.length; i < len; i++) {
        if (children[i].id === id.toString()) {
          const current = children[i];
          this.nestedTreeControl.expand(current);
          //  current = { ...current, moduleId: this.selectedModuleId === 0 ? null : +this.selectedModuleId };
          this.nodeClicked.emit(current);
          this.lastSelectedItemId = current.id.toString();
          return true;
        } else {
          if (children[i].children) {
            this.scanChild(children[i], id);
          }
        }
      }
    }
  }

  refresh(selectedNode: number) {
    this.lastSelectedItemId = selectedNode.toString();
    this.globalService.setLoading(true);
    this.paramService.findAllGroup().subscribe(
      x => {
        this.nestedDataSource.data = null;
        this.allTreeData = x.groups;
        this.nestedTreeControl.dataNodes = x.groups;
        this.nestedDataSource.data = x.groups;
        if (selectedNode === 0) {
          if (x.groups.length > 0) {
            this.selectNode(x.groups[0].id);
          }
          this.treeStateChange('expand');
        } else {
          this.selectNode(+selectedNode);
          this.treeStateChange('expand');
        }

        this.selectNode(+selectedNode);
        setTimeout(() => {
          this.lastSelectedItemId = selectedNode.toString();
          this.ngAfterViewChecked();
          this.globalService.setLoading(false);
        }, 100);
      }
    );
  }

  itemClicked(id: number, name: string, parentId: number) {
    this.manualClicked = true;
    if (this.lastSelectedItemId !== id.toString()) {
      const item = {
        id: id,
        name: name,
        parentId: parentId,
        // moduleId: this.selectedModuleId === 0 ? null : +this.selectedModuleId
      };
      this.nodeClicked.emit(item);
    }
    this.lastSelectedItemId = id.toString();
  }

  treeStateChange(val: string) {
    if (val.toString().startsWith('c')) {
      this.tree.treeControl.collapseAll();
    } else {
      this.tree.treeControl.expandAll();
    }
  }

  filterTree() {
    this.globalService.setLoading(true);
    if (this.filterText) {
      const treeData = JSON.parse(JSON.stringify(this.allTreeData));
      let res = this.paramService.filter(treeData, this.filterText);
      this.nestedDataSource.data = res;
      if (res && res.length > 0) {
        while (res[0].children) {
          this.nestedTreeControl.expand(res[0]);
          if (res[0].name.includes(this.filterText)) {
            break;
          } else {
            res = res[0].children;
          }
        }
        this.selectNode(+res[0].id);
      } else {
        this.globalService.showWarningMessage('Record not found!', 3000);
        this.nestedDataSource.data = JSON.parse(JSON.stringify(this.allTreeData));
      }
    } else {
      this.refresh(0);
    }
    this.filterText = '';
    this.globalService.setLoading(false);
  }
}
