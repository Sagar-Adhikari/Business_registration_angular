import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApsListComponent } from './aps-list.component';

describe('ApsListComponent', () => {
  let component: ApsListComponent;
  let fixture: ComponentFixture<ApsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
