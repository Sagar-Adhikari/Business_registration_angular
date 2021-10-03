import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApsRegisterComponent } from './aps-register.component';

describe('ApsRegisterComponent', () => {
  let component: ApsRegisterComponent;
  let fixture: ComponentFixture<ApsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
