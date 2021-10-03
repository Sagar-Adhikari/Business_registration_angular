import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../shared';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private globalService: GlobalService) {
    this.globalService.setPageTitle('निरेखा बारे');
  }

  ngOnInit() {

  }
}
