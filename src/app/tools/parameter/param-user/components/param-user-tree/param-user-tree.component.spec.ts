import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamUserTreeComponent } from './param-user-tree.component';

describe('ParamUserTreeComponent', () => {
  let component: ParamUserTreeComponent;
  let fixture: ComponentFixture<ParamUserTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamUserTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamUserTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
