import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearWiseRevenueComponent } from './fiscal-year-wise-revenue.component';

describe('FiscalYearWiseRevenueComponent', () => {
  let component: FiscalYearWiseRevenueComponent;
  let fixture: ComponentFixture<FiscalYearWiseRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalYearWiseRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearWiseRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
