import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCalendarViewComponent } from './common-calendar-view.component';

describe('CommonCalendarViewComponent', () => {
  let component: CommonCalendarViewComponent;
  let fixture: ComponentFixture<CommonCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
