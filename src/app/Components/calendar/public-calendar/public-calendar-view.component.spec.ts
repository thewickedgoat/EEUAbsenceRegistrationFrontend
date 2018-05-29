import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCalendarViewComponent } from './public-calendar-view.component';

describe('PublicCalendarViewComponent', () => {
  let component: PublicCalendarViewComponent;
  let fixture: ComponentFixture<PublicCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
