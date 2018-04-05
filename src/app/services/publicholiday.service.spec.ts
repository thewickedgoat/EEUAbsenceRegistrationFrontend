import { TestBed, inject } from '@angular/core/testing';

import { PublicholidayService } from './publicholiday.service';

describe('PublicholidayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicholidayService]
    });
  });

  it('should be created', inject([PublicholidayService], (service: PublicholidayService) => {
    expect(service).toBeTruthy();
  }));
});
