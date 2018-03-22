import { TestBed, inject } from '@angular/core/testing';

import { WorkfreedayService } from './workfreeday.service';

describe('WorkfreedayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkfreedayService]
    });
  });

  it('should be created', inject([WorkfreedayService], (service: WorkfreedayService) => {
    expect(service).toBeTruthy();
  }));
});
