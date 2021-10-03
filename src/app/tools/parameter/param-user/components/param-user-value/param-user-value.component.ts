import {
  Component, OnInit, ElementRef,
  Renderer2, AfterViewChecked, ViewChild, ViewChildren
} from '@angular/core';
import { ParamService } from '../../../services/param.service';
import { GlobalService } from 'src/app/shared';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';

interface TreeNode {
  id: number;
  name: string;
  parentId: number;
  imageURL: string;
  children?: TreeNode[];
}

@Component({
  selector: 'app-param-user-value',
  templateUrl: './param-user-value.component.html',
  styleUrls: ['./param-user-value.component.scss']
})
export class ParamUserValueComponent implements OnInit, AfterViewChecked {
  @ViewChild('tree') tree: { treeControl: { collapseAll: () => void; expandAll: () => void; }; };
  @ViewChild('treeContainer') treeContainer: ElementRef;
  @ViewChildren('treeNode', { read: ElementRef }) treeNodes: ElementRef[];

  nestedTreeControl: NestedTreeControl<TreeNode>;
  nestedDataSource: MatTreeNestedDataSource<TreeNode>;
  selectedModuleName = 'General';
  selectedModuleId = 600;
  lastSelectedItemId = '100';
  hasListener: any[] = [];
  oldHighlight: ElementRef;

  paramIconUrl = environment.icon_image_path + 'param/t/';

  hasNestedChild(_: number, node: TreeNode) {
    return node != null && node.children != null && node.children.length > 0;
  }

  updateHighlight = (newHighlight: ElementRef) => {
    // tslint:disable-next-line:no-unused-expression
    this.oldHighlight && this.renderer.removeClass(this.oldHighlight, 'background-highlight');
    this.renderer.addClass(newHighlight, 'background-highlight');
    this.oldHighlight = newHighlight;
  }

  constructor(private globalService: GlobalService,
    private renderer: Renderer2,
    private paramService: ParamService) {
    this.nestedTreeControl = new NestedTreeControl(node => of(node.children));
    this.nestedDataSource = new MatTreeNestedDataSource();
    this.globalService.setPageTitle('सेटिङ्गस');
    this.refresh();
  }

  ngOnInit() {
    // this.globalService.setLoading(false);
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
        const scroll = elRef.nativeElement.offsetTop + elRef.nativeElement.offsetHeight - this.treeContainer.nativeElement.offsetHeight;
        if (scroll > 0) {
          this.treeContainer.nativeElement.scrollTop = scroll;
        } else {
          this.treeContainer.nativeElement.scrollTop = 0;
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

  treeStateChange(val: string) {
    if (val.toString().startsWith('c')) {
      this.tree.treeControl.collapseAll();
    } else {
      this.tree.treeControl.expandAll();
    }
  }


  refresh() {
    this.globalService.setLoading(true);
    this.paramService.getParamListForDefaultValue().subscribe(x => {
      this.nestedTreeControl.dataNodes = x.groupTree;
      this.nestedDataSource.data = x.groupTree;
      this.treeStateChange('expand');
      if (x.groupTree.length > 0) {
        this.selectNode(+x.groupTree[0].id);
      }
      this.globalService.setLoading(false);
    });
  }

  selectNode(id: number, current = null) {
    if (current == null) { current = this.nestedDataSource.data[0]; }
    if (current.id === id.toString()) {
      this.nestedTreeControl.expand(current);
      this.lastSelectedItemId = current.id.toString();
      return;
    } else {
      const children = current.children;
      if (children) {
        for (let i = 0, len = children.length; i < len; i++) {
          this.selectNode(id, children[i]);
          if (children[i].id === id.toString()) {
            break;
          }
        }
      }
    }
  }
}
