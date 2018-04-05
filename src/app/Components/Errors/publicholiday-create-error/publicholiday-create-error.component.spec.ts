import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicholidayCreateErrorComponent } from './publicholiday-create-error.component';

describe('PublicholidayCreateErrorComponent', () => {
  let component: PublicholidayCreateErrorComponent;
  let fixture: ComponentFixture<PublicholidayCreateErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicholidayCreateErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicholidayCreateErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
