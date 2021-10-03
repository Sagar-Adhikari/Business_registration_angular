import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamUserValueComponent } from './param-user-value.component';

describe('ParamUserValueComponent', () => {
  let component: ParamUserValueComponent;
  let fixture: ComponentFixture<ParamUserValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamUserValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamUserValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
