import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RigisterListFullComponent } from './rigister-list-full.component';

describe('RigisterListFullComponent', () => {
  let component: RigisterListFullComponent;
  let fixture: ComponentFixture<RigisterListFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RigisterListFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RigisterListFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
