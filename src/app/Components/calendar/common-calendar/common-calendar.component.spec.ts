import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonCalendarComponent } from './common-calendar.component';

describe('CommonCalendarComponent', () => {
  let component: CommonCalendarComponent;
  let fixture: ComponentFixture<CommonCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
