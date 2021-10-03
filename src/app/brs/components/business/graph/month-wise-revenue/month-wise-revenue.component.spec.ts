import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseRevenueComponent } from './month-wise-revenue.component';

describe('MonthWiseRevenueComponent', () => {
  let component: MonthWiseRevenueComponent;
  let fixture: ComponentFixture<MonthWiseRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWiseRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
