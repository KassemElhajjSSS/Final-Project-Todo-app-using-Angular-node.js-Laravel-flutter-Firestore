import { TestBed } from '@angular/core/testing';

import { HandleApiErrorServiceService } from './handle-api-error.service.service';

describe('HandleApiErrorServiceService', () => {
  let service: HandleApiErrorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleApiErrorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
