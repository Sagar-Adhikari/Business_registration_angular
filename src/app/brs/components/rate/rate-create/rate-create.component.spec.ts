import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCreateComponent } from './rate-create.component';

describe('RateCreateComponent', () => {
  let component: RateCreateComponent;
  let fixture: ComponentFixture<RateCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
