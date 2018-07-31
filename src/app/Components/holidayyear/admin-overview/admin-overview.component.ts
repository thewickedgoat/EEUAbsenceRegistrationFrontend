import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DepartmentService} from '../../../services/department.service';
import {Department} from '../../../entities/department';
import {Employee} from '../../../entities/employee';

@Component({
  selector: 'app-admin-overview',
  templateUrl: './admin-overview.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AdminOverviewComponent implements OnInit {
  loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

  departments: Department[];
  holidayYearStart: number;

  constructor(private route: ActivatedRoute, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.departmentService.getAll().subscribe(departments => {
      for(let department of departments){
        if(department.Employees.length > 0 && department.Employees != null){
          department.Employees.sort(this.sortEmployeesByName);
        }
      }
      this.departments = departments;
    });
    this.getHolidayYearStart();
  }

  sortEmployeesByName(a: Employee, b: Employee) {
    let firstNameOfA = a.FirstName;
    let firstNameOfB = b.FirstName;
    return firstNameOfA > firstNameOfB ? 1 : (firstNameOfA < firstNameOfB ? -1 : 0);
  }

  getHolidayYearStart(){
    this.route.paramMap.subscribe(params => {
      this.holidayYearStart = +params.get('yearStart');
    });
  }

}
