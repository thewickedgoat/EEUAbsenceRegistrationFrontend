import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {Month} from '../../../entities/month';
import {HolidayYear} from '../../../entities/HolidayYear';
import {StatusService} from '../../../services/status.service';
import {Status} from '../../../entities/status';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  statuses: Status[];
  currentHolidayYear: HolidayYear;
  monthsInHolidayYear: Month[];

  loggedInUser: Employee;
  employee: Employee;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private employeeService: EmployeeService,
              private holidayYearSpecService: HolidayYearSpecService,
              private statusService: StatusService) {
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
    this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + this.getYearOfMonth(month) + '/' + month);
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
        this.getHolidayYearStartAndEnd();
        //this.convertDates();
        this.getMonthsInHolidayYear();

      });
  }
/*

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
*/

  getYearOfMonth(month: number){
    let months = this.currentHolidayYear.Months;
    let currentMonth = months.find(x => x.MonthDate.getMonth() === month);
    return currentMonth.MonthDate.getMonth();
  }

  /**
   * Calculates the current holidayyear start and end dates
   */
  getHolidayYearStartAndEnd() {
    const currentDate = new Date();
    let holidaySpecs = [];
    this.holidayYearSpecService.getAll().subscribe(holidayYearsSpecs => {
      if(holidayYearsSpecs != null){
        for(let holidayYearSpec of holidayYearsSpecs){
          const startDateToParse = holidayYearSpec.StartDate.toString();
          const endDateToParse = holidayYearSpec.EndDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          const endDate = new Date(Date.parse(endDateToParse));
          holidayYearSpec.StartDate = startDate;
          holidayYearSpec.EndDate = endDate;
        }
        holidaySpecs = holidayYearsSpecs;
      }
    });
    const currentHolidayYearSpec = holidaySpecs.find(x => x.StartDate <= currentDate && x.EndDate >= currentDate);
    this.currentHolidayYear = this.employee.HolidayYears.find(x => x.CurrentHolidayYear === currentHolidayYearSpec);
  }

  /**
   * gets the months in the current currentHolidayYear
   */
  getMonthsInHolidayYear() {
    let months = this.currentHolidayYear.Months;
    if(months != null) {
      for (let month of months) {
        const monthDateToParse = month.MonthDate.toString();
        const monthDate = new Date(Date.parse(monthDateToParse));
        month.MonthDate = monthDate;
      }
      this.monthsInHolidayYear = this.currentHolidayYear.Months;
    }
  }
}
