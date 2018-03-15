import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {Month} from '../../../entities/month';
import {HolidayYear} from '../../../entities/HolidayYear';
import {StatusService} from '../../../services/status.service';
import {Status} from '../../../entities/status';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  statuses: Status[];
  holidayYear: HolidayYear;
  monthsInHolidayYear: Month[];

  loggedInUser: Employee;
  employee: Employee;

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService, private statusService: StatusService) {
  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.getEmployee();
    this.getStatuses();
  }

  /**
   * Go to the calendar for the given month
   * @param month
   */
  goToCalendar(month: number) {
    const april = 3;
    if(month > april){
      this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + this.holidayYear.StartDate.getFullYear() + '/' + month);
    }
    else if(month <= april){
      this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + this.holidayYear.EndDate.getFullYear() + '/' + month);
    }
  }

  getStatuses(){
    this.statusService.getAll().subscribe(statuses => this.statuses = statuses);
  }
  /**
   * Gets the employee
   */
  getEmployee() {
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {
        this.employee = employee;
        console.log(this.employee.HolidayYears);
        this.convertDates();
        console.log(this.employee.HolidayYears);
        this.getHolidayYearStartAndEnd();
        this.getMonthsInHolidayYear();

      });
  }

  convertDates(){
    //for holidays
    if(this.employee.HolidayYears != null){
      for(let holidayYear of this.employee.HolidayYears){
        const startDateToParse = holidayYear.StartDate.toString();
        const endDateToParse = holidayYear.EndDate.toString();
        const startDate = new Date(Date.parse(startDateToParse));
        const endDate = new Date(Date.parse(endDateToParse));
        holidayYear.StartDate = startDate;
        holidayYear.EndDate = endDate;
        console.log(holidayYear);
        //for months
        for(let month of holidayYear.Months){
          const monthDateToParse = month.MonthDate.toString();
          const monthDate = new Date(Date.parse(monthDateToParse));
          month.MonthDate = monthDate;
        }
      }
    }
  }

  /**
   * Calculates the current holidayyear start and end dates
   */
  getHolidayYearStartAndEnd() {
    console.log(this.employee.HolidayYears);
    let date = new Date();
    let april = 3;
    let month = date.getMonth();
    let year = date.getFullYear();
    if(month > april){
      const currentHolidayYear = this.employee.HolidayYears.find(x => x.StartDate.getFullYear() === year);
      this.holidayYear = currentHolidayYear;
      console.log(currentHolidayYear);
    }
    else if(month <= april){
      const currentHolidayYear = this.employee.HolidayYears.find(x => x.EndDate.getFullYear() === year);
      this.holidayYear = currentHolidayYear;
      console.log(currentHolidayYear);
    }

  }

  /**
   * gets the months in the current holidayYear
   */
  getMonthsInHolidayYear() {
    this.monthsInHolidayYear = this.holidayYear.Months;
  }
}
