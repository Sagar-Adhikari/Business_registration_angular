import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalFormatComponent } from './normal-format.component';

describe('NormalFormatComponent', () => {
  let component: NormalFormatComponent;
  let fixture: ComponentFixture<NormalFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NormalFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NormalFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
