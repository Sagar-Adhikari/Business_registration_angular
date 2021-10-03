import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareFiscalYearComponent } from './compare-fiscal-year.component';

describe('CompareFiscalYearComponent', () => {
  let component: CompareFiscalYearComponent;
  let fixture: ComponentFixture<CompareFiscalYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareFiscalYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareFiscalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
