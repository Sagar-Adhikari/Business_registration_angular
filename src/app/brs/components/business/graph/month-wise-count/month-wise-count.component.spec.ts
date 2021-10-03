import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseCountComponent } from './month-wise-count.component';

describe('MonthWiseCountComponent', () => {
  let component: MonthWiseCountComponent;
  let fixture: ComponentFixture<MonthWiseCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWiseCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
