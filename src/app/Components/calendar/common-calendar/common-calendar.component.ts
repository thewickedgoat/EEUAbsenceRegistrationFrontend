import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Department} from '../../../entities/department';
import {DepartmentService} from '../../../services/department.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Employee} from '../../../entities/employee';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Month} from '../../../entities/month';
import {EmployeeService} from '../../../services/employee.service';
import {DateformatingService} from '../../../services/dateformating.service';

@Component({
  selector: 'app-common-calendar',
  templateUrl: './common-calendar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommonCalendarComponent implements OnInit {
  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  departments: Department[];
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  currentHolidayYearSpec: HolidayYearSpec;

  holidayYearStartDate: Date;
  holidayYearEndDate: Date;
  currentDate: Date;
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
      this.getDates(+params.get('year'), +params.get('month'));
      this.getCurrentHolidayYearSpec();
    });
  }

  initData(){
    this.formatPublicHolidays();
    this.getHolidayYearStartEnd();
    this.daysInCurrentMonth = new Array<Date>();
    this.daysInMonth();
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
      console.log(this.departments);
    });
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
    let year = this.currentDate.getFullYear();
    let month = this.currentDate.getMonth();
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
   * @param year
   * @param month
   */
  getDates(year: number, month: number){
    const firstDay = new Date(year, month, 1);
    this.currentDate = firstDay;
  }

  /**
   * Page navigation
   * @param id
   */
  goToCalendar(id: number){
    this.router.navigateByUrl('calendar/' + id + '/' + this.currentDate.getFullYear() + '/' + this.currentDate.getMonth())
  }

  /**
   * Page navigation
   * @param month
   */
  goToMonth(month: number){
    if(month >= 4)
    {
      const year = this.holidayYearStartDate.getFullYear();
      this.router.navigateByUrl('common-calendar/' + year + '/' + month);
    }
    else if(month < 4){
      const year = this.holidayYearEndDate.getFullYear();
      this.router.navigateByUrl('common-calendar/' + year + '/' + month);
    }

  }

  /**
   * Page navigation
   */
  next(){
    const nextYear = this.currentDate.getFullYear()+1;
    this.router.navigateByUrl('common-calendar/' + nextYear + '/' + this.currentDate.getMonth());
  }

  previous(){
    const previousYear = this.currentDate.getFullYear()-1;
    this.router.navigateByUrl('common-calendar/' + previousYear + '/' + this.currentDate.getMonth());
  }

  formatPublicHolidays(){
    if(this.currentHolidayYearSpec.PublicHolidays != null){
      for(let publicHoliday of this.currentHolidayYearSpec.PublicHolidays){
        publicHoliday.Date = this.dateformatingService.formatDate(publicHoliday.Date);
      }
    }
  }

  getCurrentHolidayYearSpec(){
    let holidayYearsSpecs = [];
    this.holidayYearSpecSerivce.getAll().subscribe( specs => {
      if(specs != null){
        for(let holidayYearSpec of specs){
          const startDateToParse = holidayYearSpec.StartDate.toString();
          const endDateToParse = holidayYearSpec.EndDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          const endDate = new Date(Date.parse(endDateToParse));
          holidayYearSpec.StartDate = startDate;
          holidayYearSpec.EndDate = endDate;
        }
      }
      holidayYearsSpecs = specs;
      if(holidayYearsSpecs != null){
        this.currentHolidayYearSpec = holidayYearsSpecs.find(x => x.StartDate <= this.currentDate && x.EndDate >= this.currentDate);
        this.initData();
      }
    });

  }

  /**
   * calculates the holidayyear start and end dates
   */
  getHolidayYearStartEnd(){
    this.holidayYearStartDate = this.currentHolidayYearSpec.StartDate;
    this.holidayYearEndDate = this.currentHolidayYearSpec.EndDate;
  }


  /**
   * Helper method for parsing dates from a different format from the rest-API. "hack"
   */
  getAbsencesInCurrentMonth(employee: Employee){
    const currentHolidayYear = employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(currentHolidayYear != null){
      for(let month of currentHolidayYear.Months){
        month.MonthDate = this.dateformatingService.formatDate(month.MonthDate);
      }
      const currentMonth = currentHolidayYear.Months.find(x => x.MonthDate.getMonth() === this.currentDate.getMonth() &&
      x.MonthDate.getFullYear() === this.currentDate.getFullYear());
      if(currentMonth.AbsencesInMonth != null){
        for(let absence of currentMonth.AbsencesInMonth){
          const absenceToAdd = absence.Date.toString();
          const date = new Date(Date.parse(absenceToAdd));
          absence.Date = date;
        }
        return currentMonth.AbsencesInMonth;
      }
    }
  }
}
