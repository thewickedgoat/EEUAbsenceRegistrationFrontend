import { TestBed, inject } from '@angular/core/testing';

import { HolidayyearService } from './holidayyear.service';

describe('HolidayyearService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HolidayyearService]
    });
  });

  it('should be created', inject([HolidayyearService], (service: HolidayyearService) => {
    expect(service).toBeTruthy();
  }));
});
