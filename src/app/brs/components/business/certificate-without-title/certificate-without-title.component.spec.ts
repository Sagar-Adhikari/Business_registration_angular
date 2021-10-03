import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateWithoutTitleComponent } from './certificate-without-title.component';

describe('CertificateWithoutTitleComponent', () => {
  let component: CertificateWithoutTitleComponent;
  let fixture: ComponentFixture<CertificateWithoutTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateWithoutTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateWithoutTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
