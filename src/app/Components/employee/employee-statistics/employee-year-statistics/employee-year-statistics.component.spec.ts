import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeYearStatisticsComponent } from './employee-year-statistics.component';

describe('EmployeeYearStatisticsComponent', () => {
  let component: EmployeeYearStatisticsComponent;
  let fixture: ComponentFixture<EmployeeYearStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeYearStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeYearStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
