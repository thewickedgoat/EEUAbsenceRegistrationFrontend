import { TestBed, inject } from '@angular/core/testing';

import { MonthService } from './month.service';

describe('MonthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonthService]
    });
  });

  it('should be created', inject([MonthService], (service: MonthService) => {
    expect(service).toBeTruthy();
  }));
});
