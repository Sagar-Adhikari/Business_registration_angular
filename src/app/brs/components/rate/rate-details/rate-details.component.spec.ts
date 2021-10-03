import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDetailsComponent } from './rate-details.component';

describe('RateDetailsComponent', () => {
  let component: RateDetailsComponent;
  let fixture: ComponentFixture<RateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
