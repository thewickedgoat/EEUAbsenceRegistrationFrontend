import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Department} from '../../entities/department';
import {DepartmentService} from '../../services/department.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AdminOverviewComponent implements OnInit {

  departments: Department[];
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  holidayYearStart: Date;
  holidayYearEnd: Date;

  currentMonth: Date;
  daysInCurrentMonth: Date[];

  /*This component is work in progress*/

  constructor(private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getDates(+params.get('year'), +params.get('month'));
      this.initData();
    });
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });

  }

  /**
   * Inits the month and holidayYear
   */
  initData(){
    this.getHolidayYear();
    this.daysInCurrentMonth = new Array<Date>();
    this.daysInMonth()
  }

  /**
   * Gets the first month date
   * @param year
   * @param month
   */
  getDates(year: number, month: number){
    const firstDay = new Date(year, month, 1);
    this.currentMonth = firstDay;

  }

  /**
   * Calculates the holidayyear start and end dates
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


  /**
   * Calculates the days in the current month
   */
  daysInMonth(){
    let year = this.currentMonth.getFullYear();
    let month = this.currentMonth.getMonth();
    let numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    let days = new Array();

    for(let i=1;i<=numOfDays+1;i++)
    {
      days.push(new Date(year, month,i).getDay());
    }
    this.daysInCurrentMonth = days;
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
}
