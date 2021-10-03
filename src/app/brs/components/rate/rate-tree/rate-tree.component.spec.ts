import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateTreeComponent } from './rate-tree.component';

describe('RateTreeComponent', () => {
  let component: RateTreeComponent;
  let fixture: ComponentFixture<RateTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
