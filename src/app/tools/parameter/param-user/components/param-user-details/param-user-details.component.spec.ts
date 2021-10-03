import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamUserDetailsComponent } from './param-user-details.component';

describe('ParamUserDetailsComponent', () => {
  let component: ParamUserDetailsComponent;
  let fixture: ComponentFixture<ParamUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
