import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Department} from '../../../entities/department';
import {DepartmentService} from '../../../services/department.service';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {MatDialog} from '@angular/material';
import {EmployeeDeleteDialogComponent} from '../employee-delete-dialog/employee-delete-dialog.component';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeListComponent implements OnInit {

  loggedInUser: Employee;
  departments: Department[];
  employees: Employee[];
  employeeDeleted: boolean = false;

  constructor(private employeeService: EmployeeService, private departmentService: DepartmentService, private router: Router, private dialog: MatDialog) {

  }

  ngOnInit() {
      this.initData();
  }

  /**
   * Based on the ID of the emitted method, deletes an employee with the given Id
   * @param id
   */
  deleteEmployeeFromList(id: number){
    this.employeeService.delete(id).subscribe(()=> this.initData());
  }

  deleteRequested(employeeId: number): void{
    console.log(employeeId);
    let employee = this.employees.find(x => x.Id === employeeId);
    let dialogRef = this.dialog.open(EmployeeDeleteDialogComponent, {data: {employee: employee}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result === true){
        this.deleteEmployeeFromList(employeeId);
        console.log('damn');
      }
    });
  }

  /**
   * Inits the list
   */
  initData(){
    this.employeeService.getAll().subscribe(employees => {
      this.employees = employees;
    });
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));

    console.log(sessionStorage.getItem("token"));

  }

  /**
   * Navigate to create employee
   */
  createEmployee() {
    this.router
      .navigateByUrl('employees/create');
  }

  /**
   * Navigate to create employee
   */
  createDepartment(){
    console.log('ayy')
    this.router
      .navigateByUrl('department/create');
  }

  /**
   * Checks for admin rights
   * @returns {boolean}
   */
  isAdmin(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else return false;
  }

}
