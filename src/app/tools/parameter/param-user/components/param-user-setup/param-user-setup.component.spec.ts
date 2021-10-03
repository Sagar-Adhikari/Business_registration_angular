import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamUserSetupComponent } from './param-user-setup.component';

describe('ParamUserSetupComponent', () => {
  let component: ParamUserSetupComponent;
  let fixture: ComponentFixture<ParamUserSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamUserSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamUserSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
