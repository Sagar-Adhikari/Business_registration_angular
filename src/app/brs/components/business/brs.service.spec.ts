import { TestBed } from '@angular/core/testing';

import { BrsService } from './brs.service';

describe('BrsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrsService = TestBed.get(BrsService);
    expect(service).toBeTruthy();
  });
});
