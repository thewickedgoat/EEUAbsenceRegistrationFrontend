import { TestBed, inject } from '@angular/core/testing';

import { HolidayYearSpecService } from './holidayyearspec.service';

describe('HolidayYearSpecService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolidayYearSpecService]
    });
  });

  it('should be created', inject([HolidayYearSpecService], (service: HolidayYearSpecService) => {
    expect(service).toBeTruthy();
  }));
});
