import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateWithTitleComponent } from './certificate-with-title.component';

describe('CertificateWithTitleComponent', () => {
  let component: CertificateWithTitleComponent;
  let fixture: ComponentFixture<CertificateWithTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateWithTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateWithTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
