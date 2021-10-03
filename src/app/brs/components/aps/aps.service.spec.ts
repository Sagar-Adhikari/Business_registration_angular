import { TestBed } from '@angular/core/testing';

import { ApsService } from './aps.service';

describe('ApsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApsService = TestBed.get(ApsService);
    expect(service).toBeTruthy();
  });
});
