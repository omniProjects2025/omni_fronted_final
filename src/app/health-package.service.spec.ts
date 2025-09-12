import { TestBed } from '@angular/core/testing';

import { HealthPackageService } from './health-package.service';

describe('HealthPackageService', () => {
  let service: HealthPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
