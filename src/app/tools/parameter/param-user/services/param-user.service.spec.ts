import { TestBed } from '@angular/core/testing';

import { ParamUserService } from './param-user.service';

describe('ParamUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParamUserService = TestBed.get(ParamUserService);
    expect(service).toBeTruthy();
  });
});
