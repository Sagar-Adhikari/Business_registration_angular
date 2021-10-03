import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateInputRangeComponent } from './date-input-range.component';

describe('DateInputRangeComponent', () => {
  let component: DateInputRangeComponent;
  let fixture: ComponentFixture<DateInputRangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateInputRangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateInputRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
