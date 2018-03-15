import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStatisticsControllerComponent } from './employee-statistics-controller.component';

describe('EmployeeStatisticsControllerComponent', () => {
  let component: EmployeeStatisticsControllerComponent;
  let fixture: ComponentFixture<EmployeeStatisticsControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeStatisticsControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStatisticsControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
