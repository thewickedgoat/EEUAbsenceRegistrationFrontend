import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {EmployeeService} from '../../../services/employee.service';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationComponent implements OnInit {

  currentHolidayYearSpec: HolidayYearSpec;
  employees: Employee[];
  holidayYearStart: Date;
  holidayYearEnd: Date;

  constructor(private holidayYearSpecService: HolidayYearSpecService,
              private employeeService: EmployeeService) { }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.getCurrentHolidayYear();
    this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getAll().subscribe(emps => {
      this.employees = emps;
      console.log(this.employees);
      this.getHolidayYearStartEnd();
    });
  }

  getCurrentHolidayYear(){
    const currentDate = new Date();
    this.holidayYearSpecService.getAll().subscribe(holidayYearsSpecs => {
      const formatedHolidayYearsSpecs = this.formatHolidayYearDates(holidayYearsSpecs);
      const currentHolidayYearSpec = formatedHolidayYearsSpecs.find(x => x.StartDate <= currentDate && x.EndDate >= currentDate);
      this.currentHolidayYearSpec = currentHolidayYearSpec;
    })
  }

  formatHolidayYearDates(holidayYearsSpecs: HolidayYearSpec[]){
    for(let holidayYearSpec of holidayYearsSpecs){
      const startDateToParse = holidayYearSpec.StartDate.toString();
      const endDateToParse = holidayYearSpec.EndDate.toString();
      const startDate = new Date(Date.parse(startDateToParse));
      const endDate = new Date(Date.parse(endDateToParse));
      holidayYearSpec.StartDate = startDate;
      holidayYearSpec.EndDate = endDate;
    }
    return holidayYearsSpecs;
  }

  updateView(){
    this.initData();
  }

  getHolidayYearStartEnd(){
    this.holidayYearStart = this.currentHolidayYearSpec.StartDate;
    this.holidayYearEnd = this.currentHolidayYearSpec.EndDate;
  }

}
