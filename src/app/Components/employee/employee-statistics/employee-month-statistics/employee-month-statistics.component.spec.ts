import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMonthStatisticsComponent } from './employee-month-statistics.component';

describe('EmployeeMonthStatisticsComponent', () => {
  let component: EmployeeMonthStatisticsComponent;
  let fixture: ComponentFixture<EmployeeMonthStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMonthStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMonthStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
