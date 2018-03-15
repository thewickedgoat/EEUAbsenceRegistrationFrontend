import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Department} from '../../../entities/department';
import {DepartmentService} from '../../../services/department.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Employee} from '../../../entities/employee';

@Component({
  selector: 'app-common-calendar',
  templateUrl: './common-calendar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommonCalendarComponent implements OnInit {
  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  departments: Department[];
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  holidayYearStartDate: Date;
  holidayYearEndDate: Date;
  currentMonthDate: Date;
  daysInCurrentMonth: Date[];

  constructor(private router: Router, private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getDates(+params.get('year'), +params.get('month'));
      this.initData();
    });
  }

  initData(){
    this.getHolidayYearStartEnd();
    this.daysInCurrentMonth = new Array<Date>();
    this.daysInMonth();
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });
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
   * @param year
   * @param month
   */
  getDates(year: number, month: number){
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
    const nextYear = this.currentMonthDate.getFullYear()+1;
    this.router.navigateByUrl('common-calendar/' + nextYear + '/' + this.currentMonthDate.getMonth());
  }

  previous(){
    const previousYear = this.currentMonthDate.getFullYear()-1;
    this.router.navigateByUrl('common-calendar/' + previousYear + '/' + this.currentMonthDate.getMonth());
  }

  /**
   * calculates the holidayyear start and end dates
   */
  getHolidayYearStartEnd(){
    let monthDate = this.currentMonthDate.getMonth();
    let april = 3;
    let may = 4;
    if(monthDate <= april){
      let startDate = new Date();
      startDate.setDate(1);
      startDate.setMonth(may);
      startDate.setFullYear(this.currentMonthDate.getFullYear()-1);
      this.holidayYearStartDate = startDate;
      let endDate = new Date();
      endDate.setDate(1);
      endDate.setMonth(april);
      endDate.setFullYear(this.currentMonthDate.getFullYear());
      this.holidayYearEndDate = endDate;
    }
    else if(monthDate > april){
      let startDate = new Date();
      startDate.setDate(1);
      startDate.setMonth(may);
      startDate.setFullYear(this.currentMonthDate.getFullYear());
      this.holidayYearStartDate = startDate;
      let endDate = new Date();
      endDate.setDate(1);
      endDate.setMonth(april);
      endDate.setFullYear(this.currentMonthDate.getFullYear()+1);
      this.holidayYearEndDate = endDate;
    }
  }


  /**
   * Helper method for parsing dates from a different format from the rest-API. "hack"
   */
  getAbsencesInCurrentMonth(employee: Employee){
    if(employee.HolidayYears != null && employee.HolidayYears.length > 0){
      this.convertDates(employee);
      let currentHolidayYear = employee.HolidayYears
        .find(x => x.StartDate.getFullYear() === this.holidayYearStartDate.getFullYear()
          && x.EndDate.getFullYear() === this.holidayYearEndDate.getFullYear());
      if(currentHolidayYear.Months != null){
        let currentMonth = currentHolidayYear.Months.find(x => x.MonthDate.getMonth() === this.currentMonthDate.getMonth());
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

  convertDates(employee: Employee){
    //for holidays
    if(employee.HolidayYears != null){
      for(let holidayYear of employee.HolidayYears){
        const startDateToParse = holidayYear.StartDate.toString();
        const endDateToParse = holidayYear.EndDate.toString();
        const startDate = new Date(Date.parse(startDateToParse));
        const endDate = new Date(Date.parse(endDateToParse));
        holidayYear.StartDate = startDate;
        holidayYear.EndDate = endDate;
        //for months
        for(let month of holidayYear.Months){
          const monthDateToParse = month.MonthDate.toString();
          const monthDate = new Date(Date.parse(monthDateToParse));
          month.MonthDate = monthDate;
        }
      }
    }
  }
}
