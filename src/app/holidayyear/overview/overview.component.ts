import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/employee';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  holidayYearStart: Date;
  holidayYearEnd: Date;

  monthsInHolidayYear: Date[];

  loggedInUser: Employee;
  employee: Employee;

  constructor(private route: ActivatedRoute, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.monthsInHolidayYear = new Array<Date>();
    this.getHolidayYearStartAndEnd();
    this.getMonthsInHolidayYear();
    this.getEmployee();
  }

  /**
   * Refresh view
   * @param year
   */
  refreshData(year: number){
    this.monthsInHolidayYear = new Array<Date>();
    this.getHolidayYearStartAndEnd(year);
    this.getMonthsInHolidayYear();
    this.getEmployee();
  }

  /**
   * Gets the employee
   */
  getEmployee(){
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {this.employee = employee; console.log(this.employee);});
  }

  /**
   * Calculates the current holidayyear start and end dates
   */
  getHolidayYearStartAndEnd(year?: number) {
    let currentDate = new Date();
    if(year){
      currentDate.setFullYear(year);
      currentDate.setMonth(currentDate.getMonth());
    }
    else{
      currentDate.setFullYear(currentDate.getFullYear());
      currentDate.setMonth(currentDate.getMonth());
    }

    const may = 4;
    const april = 3;
    const firstDayOfMay = 1;
    const lastDayOfApril = 30;

    if(currentDate.getMonth() >= may){
      let holidayYearStart = new Date(
        currentDate.getFullYear(),
        may,
        firstDayOfMay);
      let holidayYearEnd = new Date(
        currentDate.getFullYear()+1,
        april,
        lastDayOfApril);
      this.holidayYearStart = holidayYearStart;
      this.holidayYearEnd = holidayYearEnd;
    }
    else if(currentDate.getMonth() <= april){
      let holidayYearStart = new Date(
        currentDate.getFullYear()-1,
        may,
        firstDayOfMay);
      let holidayYearEnd = new Date(
        currentDate.getFullYear(),
        april,
        lastDayOfApril);
      this.holidayYearStart = holidayYearStart;
      this.holidayYearEnd = holidayYearEnd;

    }

  }

  /**
   * calculates the amount of months in the current holidayyear
   */
  getMonthsInHolidayYear(){
    const monthsInHolidayYear = 11; /* The Date object in Angular has months running from index 0 - 11. */
    const startIndex = 0;
    const startMonth = this.holidayYearStart.getMonth();
    const endMonth = this.holidayYearEnd.getMonth();
    for(var i = startIndex; i <= monthsInHolidayYear; i++){
      const month = new Date();
      if(i >= startMonth){
        month.setFullYear(this.holidayYearStart.getFullYear());
        month.setMonth(i);
        month.setDate(1);
      }
      else if(i <= endMonth){
        month.setFullYear(this.holidayYearEnd.getFullYear());
        month.setMonth(i);
        month.setDate(1);
      }
      this.monthsInHolidayYear.push(month);
    }
    console.log(this.monthsInHolidayYear);
  }

}
