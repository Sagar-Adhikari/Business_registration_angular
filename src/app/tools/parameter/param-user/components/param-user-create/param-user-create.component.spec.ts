import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamUserCreateComponent } from './param-user-create.component';

describe('ParamUserCreateComponent', () => {
  let component: ParamUserCreateComponent;
  let fixture: ComponentFixture<ParamUserCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamUserCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamUserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
