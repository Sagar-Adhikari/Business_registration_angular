import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApsMainComponent } from './aps-main.component';

describe('ApsMainComponent', () => {
  let component: ApsMainComponent;
  let fixture: ComponentFixture<ApsMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
