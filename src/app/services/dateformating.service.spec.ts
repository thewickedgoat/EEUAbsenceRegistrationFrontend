import { TestBed, inject } from '@angular/core/testing';

import { DateformatingService } from './dateformating.service';

describe('DateformatingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateformatingService]
    });
  });

  it('should be created', inject([DateformatingService], (service: DateformatingService) => {
    expect(service).toBeTruthy();
  }));
});
