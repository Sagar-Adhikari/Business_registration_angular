import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentityCardComponent } from './identity-card.component';

describe('IdentityCardComponent', () => {
  let component: IdentityCardComponent;
  let fixture: ComponentFixture<IdentityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
