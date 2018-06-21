import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {ActivatedRoute, Router} from '@angular/router';
import {DepartmentService} from '../../../services/department.service';
import {DateformatingService} from '../../../services/dateformating.service';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {EmployeeService} from '../../../services/employee.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {Department} from '../../../entities/department';

@Component({
  selector: 'app-public-calendar',
  templateUrl: './public-calendar.component.html',
  styleUrls: ['./public-calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicCalendarComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  departments: Department[];
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
  monthsInHolidayYear: number[];

  currentHolidayYearSpec: HolidayYearSpec;

  currentMonthDate: Date;
  daysInCurrentMonth: Date[];
  currentEmployee: Employee;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private departmentService: DepartmentService,
              private employeeService: EmployeeService,
              private holidayYearSpecSerivce: HolidayYearSpecService,
              private dateformatingService: DateformatingService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getCurrentHolidayYearSpec();
      this.getCurrentDate(+params.get('month'));
      this.initData();
    });
  }

  initData(){
    this.formatPublicHolidays();
    this.daysInCurrentMonth = new Array<Date>();
    this.daysInMonth();
    this.getNumberOfMonthsInHolidayYear();
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });
  }

  getNumberOfMonthsInHolidayYear(){
    this.monthsInHolidayYear = [];
    const startDate = this.currentHolidayYearSpec.StartDate;
    let dateToIterate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDate = this.currentHolidayYearSpec.EndDate;
    do{
      this.monthsInHolidayYear.push(dateToIterate.getMonth());
      dateToIterate.setMonth(dateToIterate.getMonth()+1);
    }
    while(dateToIterate < endDate);
  }

  employeeIsInCurrentHolidayYear(employee: Employee){
    const holidayYears = employee.HolidayYears;
    const holidayYear = holidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(holidayYear === null){
      return false;
    }
    else return true;
  }
  /**
   * fins the days in the current month
   */
  daysInMonth(){
    let year = this.currentMonthDate.getFullYear();
    let month = this.currentMonthDate.getMonth();
    let numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    let days = new Array();
    for(let i=1;i<=numOfDays+1;i++)
    {
      days[i] = new Date(year, month,i).getDay();
      this.daysInCurrentMonth.push(new Date(year, month,i));
    }
  }


  /**
   * Helper method for daysInMonth
   * @param year
   * @param month
   * @returns {number}
   */
  getDaysInMonth(year: number, month: number){
    let date = new Date(year, month +1, 0);
    date.setDate(date.getDate() - 1);
    return date.getDate();
  }

  /**
   * finds the first date of the current month
   */
  getCurrentDate(month: number){
    let year: number;
    const startDate = this.currentHolidayYearSpec.StartDate;
    const endDate = this.currentHolidayYearSpec.EndDate;
    if(month >= startDate.getMonth() && month >= endDate.getMonth()){
      year = startDate.getFullYear();
      console.log('meh1');

    }
    else if(month >= startDate.getMonth() && month <= endDate.getMonth()){
      year = endDate.getFullYear();
      console.log('meh2');
    }
    else if(month <= startDate.getMonth() && month <= endDate.getMonth()){
      year = endDate.getFullYear();
      console.log('meh3');
    }
    const firstDay = new Date(year, month, 1);
    this.currentMonthDate = firstDay;
  }

  /**
   * Page navigation
   * @param id
   */
  goToCalendar(id: number){
    this.router.navigateByUrl('calendar/' + id + '/' + this.currentMonthDate.getFullYear() + '/' + this.currentMonthDate.getMonth())
  }

  /**
   * Page navigation
   * @param month
   */
  goToMonth(month){
      this.router.navigateByUrl('public-calendar/' + month);
  }

  formatPublicHolidays(){
    if(this.currentHolidayYearSpec.PublicHolidays != null){
      for(let publicHoliday of this.currentHolidayYearSpec.PublicHolidays){
        publicHoliday.Date = this.dateformatingService.formatDate(publicHoliday.Date);
      }
    }
  }

  getCurrentHolidayYearSpec(){
    const currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    currentHolidayYearSpec.StartDate = this.dateformatingService.formatDate(currentHolidayYearSpec.StartDate);
    currentHolidayYearSpec.EndDate = this.dateformatingService.formatDate(currentHolidayYearSpec.EndDate);
    this.currentHolidayYearSpec = currentHolidayYearSpec;
  }

  /**
   * Helper method for parsing dates from a different format from the rest-API. "hack"
   */
  getAbsencesInCurrentMonth(employee: Employee){
    const currentHolidayYear = employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(currentHolidayYear != null){
      if(currentHolidayYear.Months != null)
        for(let month of currentHolidayYear.Months){
          month.MonthDate = this.dateformatingService.formatDate(month.MonthDate);
        }
        const currentMonth = currentHolidayYear.Months.find(x => x.MonthDate.getMonth() === this.currentMonthDate.getMonth());
        if(currentMonth.AbsencesInMonth != null){
          for(let absence of currentMonth.AbsencesInMonth){
            absence.Date = this.dateformatingService.formatDate(absence.Date);
          }
          return currentMonth.AbsencesInMonth;
        }
    }
  }
}
