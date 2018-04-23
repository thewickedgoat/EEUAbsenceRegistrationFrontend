import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicHolidayViewComponent } from './public-holiday-view.component';

describe('PublicHolidayViewComponent', () => {
  let component: PublicHolidayViewComponent;
  let fixture: ComponentFixture<PublicHolidayViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicHolidayViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicHolidayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
