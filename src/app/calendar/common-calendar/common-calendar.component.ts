import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Department} from '../../entities/department';
import {DepartmentService} from '../../services/department.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-common-calendar',
  templateUrl: './common-calendar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CommonCalendarComponent implements OnInit {
  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  departments: Department[];
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  holidayYearStart: Date;
  holidayYearEnd: Date;
  currentMonth: Date;
  daysInCurrentMonth: Date[];

  constructor(private router: Router, private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getDates(+params.get('year'), +params.get('month'));
      this.initData();
    });
  }

  initData(){
    this.getHolidayYear();
    this.daysInCurrentMonth = new Array<Date>();
    this.daysInMonth();
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
      console.log(departments);
    });
  }

  /**
   * fins the days in the current month
   */
  daysInMonth(){
    let year = this.currentMonth.getFullYear();
    let month = this.currentMonth.getMonth();
    let numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    let days = new Array();
    for(let i=1;i<=numOfDays+1;i++)
    {
      days[i] = new Date(year, month,i).getDay();
      this.daysInCurrentMonth.push(new Date(year, month,i));
    }
    console.log(this.daysInCurrentMonth);
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
    this.currentMonth = firstDay;

  }

  /**
   * Page navigation
   * @param id
   */
  goToCalendar(id: number){
    this.router.navigateByUrl('calendar/' + id + '/' + this.currentMonth.getFullYear() + '/' + this.currentMonth.getMonth())
  }

  /**
   * Page navigation
   * @param month
   */
  goToMonth(month: number){
    if(month >= 4)
    {
      const year = this.holidayYearStart.getFullYear();
      this.router.navigateByUrl('common-calendar/' + year + '/' + month);
    }
    else if(month < 4){
      const year = this.holidayYearEnd.getFullYear();
      this.router.navigateByUrl('common-calendar/' + year + '/' + month);
    }

  }

  /**
   * Page navigation
   */
  next(){
    const nextYear = this.currentMonth.getFullYear()+1;
    this.router.navigateByUrl('common-calendar/' + nextYear + '/' + this.currentMonth.getMonth());
  }

  previous(){
    const previousYear = this.currentMonth.getFullYear()-1;
    this.router.navigateByUrl('common-calendar/' + previousYear + '/' + this.currentMonth.getMonth());
  }

  /**
   * calculates the holidayyear start and end dates
   */
  getHolidayYear(){
    const index = this.currentMonth.getMonth();
    const may = 4;
    const april = 3;
    if(index <= april){
      let endDate = new Date();
      endDate.setFullYear(this.currentMonth.getFullYear());
      endDate.setMonth(april);
      this.holidayYearEnd = endDate;

      let startDate = new Date();
      startDate.setFullYear(this.currentMonth.getFullYear()-1);
      startDate.setMonth(may);
      this.holidayYearStart = startDate;
    }
    if(index >= may){
      let endDate = new Date();
      endDate.setFullYear(this.currentMonth.getFullYear()+1);
      endDate.setMonth(april);
      this.holidayYearEnd = endDate;

      let startDate = new Date();
      startDate.setFullYear(this.currentMonth.getFullYear());
      startDate.setMonth(may);
      this.holidayYearStart = startDate;
    }
  }
}
