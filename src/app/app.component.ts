import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { MatMenuTrigger, MatSidenav } from '@angular/material';
import { Observable, observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { fadeAnimation } from '../app/animation/animation';
import { GlobalService, Parameter } from './shared/global.service';
import { Router } from '@angular/router';
import { ParamService } from './tools/parameter';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeAnimation],
  providers: [ParamService, AppService]
})

export class AppComponent implements OnInit {
  @ViewChild(MatMenuTrigger) private menuTrigger: MatMenuTrigger;
  @ViewChild('userinfo') userInfo: ElementRef;
  @ViewChild('drawer') public leftSideNav: MatSidenav;
  @ViewChild('pageTitleContainer') public pageTitleContainer: ElementRef;
  displayName = undefined;
  pageTitle = 'ब्यवसाय दर्ता प्रणाली';
  private greetings = 'Good Afternoon';
  roleId = 0;
  loading = false;
  paramValue: Parameter;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  // async loadProperties() {
  //   await this.paramService.getParamValues().toPromise().then(x => {
  //     alert(1);
  //     this.globalService.loadProperties(x);
  //     this.globalService.changeUser();
  //   });

  // }
  constructor(private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private router: Router,
    public globalService: GlobalService, private paramService: ParamService,
    private appService: AppService) {

    // this.paramService.getParamValues().toPromise().then(x => {
    //   alert(1);
    //   this.globalService.loadProperties(x);
    // });
    //  this.loadProperties();
    this.globalService.refreshParameter();
    //   alert(2);
    this.paramService.getParamValues().subscribe(x => {
      this.globalService.loadProperties(x);
    });
    this.globalService.changeUser();
    this.globalService.greetingsTitle$.subscribe(x => {
      this.greetings = x;
    });

    this.globalService.parameter$.subscribe((x: Parameter) => {
      this.paramValue = x;
    });

    this.globalService.currentUser$.subscribe(x => {
      if (x) {
        this.displayName = x.fullName;
        this.roleId = x.roleId;
      } else {
        this.displayName = '';
        this.roleId = 0;
      }
    });
    this.globalService.loading$.subscribe(x => {
      this.loading = x;
    });
  }
  ngOnInit() {
    this.globalService.pageTitle$.subscribe(x => {
      this.pageTitleContainer.nativeElement.style.display = 'none';
      this.pageTitle = x;
      setTimeout(() => {
        this.pageTitleContainer.nativeElement.style.display = '';
      }, 10);
    });

  }


  public checkState() {
    return this.leftSideNav.mode;
  }

  menuClicked(url: string) {
    if (!this.router.isActive(url, true)) {
      this.globalService.setLoading(true);
      this.router.navigate([url]);
    } else {
      this.globalService.showInfoMessage('तपाइ यही पेजमा हुनुहुन्छ ।', 1000);
    }
  }

  public openMenu(event: any) {
    const menu = document.getElementById('menuBtn');
    const left = this.userInfo.nativeElement.offsetLeft;
    menu.style.display = '';
    menu.style.position = 'absolute';
    menu.style.top = '51px';
    if (left >= 600) {
      menu.style.left = (this.userInfo.nativeElement.offsetLeft) + 50 + 'px';
    } else {
      menu.style.left = '50px';
    }
    this.menuTrigger.openMenu();
  }


  logout() {
    this.globalService.clearUser();
    this.router.navigate(['/brs/aps-details']);
  }
  titleClicked() {
    if (this.roleId === 5) {
      this.router.navigate(['/brs/list-ape']);
    } else if (this.roleId >= 1) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['/brs/aps-details']);
    }
  }
  onMenuClosed(): void {
    const menu = document.getElementById('menuBtn');
    if (menu) {
      menu.style.display = 'none';
    }
  }

  animStart(e: any) {

  }

  menuClickedToBackup() {
    this.globalService.showInfoMessage('Backing up is in process...');
    this.globalService.setLoading(true);
    this.appService.backupDB().subscribe(_ => {
      this.globalService.showSuccessMessage('Backup completed');
    }, error => {
      this.globalService.showErrorMessage(error.message);
    });
  }
}
