import { TestBed, inject } from '@angular/core/testing';

import { AbsenceService } from './absence.service';

describe('AbsenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbsenceService]
    });
  });

  it('should be created', inject([AbsenceService], (service: AbsenceService) => {
    expect(service).toBeTruthy();
  }));
});
