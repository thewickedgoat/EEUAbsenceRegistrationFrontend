import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../../../services/department.service';
import {Department} from '../../../entities/department';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AdminOverviewComponent implements OnInit {
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  /*This component is work in progress*/

  departments: Department[];
  holidayYearStart: number;

  constructor(private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
      //this.formatHolidayYearStartDates();
    });
    this.getHolidayYearStart();
  }

  getHolidayYearStart(){
    this.route.paramMap.subscribe(params => {
      this.holidayYearStart = +params.get('yearStart');
    });
  }

  /*formatHolidayYearStartDates(){
    for(let department of this.departments){
      for(let employee of department.Employees){
        for(let holidayYear of employee.HolidayYears){
          const startDateToParse = holidayYear.StartDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          holidayYear.StartDate = startDate;
          for(let month of holidayYear.Months){
            const dateToParse = month.MonthDate.toString();
            const date = new Date(Date.parse(dateToParse));
            month.MonthDate = date;
          }
        }
      }
    }
  }*/

}
