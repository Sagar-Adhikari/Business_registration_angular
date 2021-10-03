import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscalYearWiseCountComponent } from './fiscal-year-wise-count.component';

describe('FiscalYearWiseCountComponent', () => {
  let component: FiscalYearWiseCountComponent;
  let fixture: ComponentFixture<FiscalYearWiseCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscalYearWiseCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearWiseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
