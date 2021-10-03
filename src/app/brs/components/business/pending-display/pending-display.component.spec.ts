import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDisplayComponent } from './pending-display.component';

describe('PendingDisplayComponent', () => {
  let component: PendingDisplayComponent;
  let fixture: ComponentFixture<PendingDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
