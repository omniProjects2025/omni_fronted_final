import { TestBed } from '@angular/core/testing';

import { FixedpackagesService } from './fixedpackages.service';

describe('FixedpackagesService', () => {
  let service: FixedpackagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixedpackagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
