import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLocationComponent } from './member-location.component';

describe('MemberLocationComponent', () => {
  let component: MemberLocationComponent;
  let fixture: ComponentFixture<MemberLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
