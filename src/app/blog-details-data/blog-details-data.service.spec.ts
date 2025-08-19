import { TestBed } from '@angular/core/testing';

import { BlogDetailsDataService } from './blog-details-data.service';

describe('BlogDetailsDataService', () => {
  let service: BlogDetailsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlogDetailsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
