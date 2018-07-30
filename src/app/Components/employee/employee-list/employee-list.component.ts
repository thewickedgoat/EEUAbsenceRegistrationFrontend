import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Department} from '../../../entities/department';
import {DepartmentService} from '../../../services/department.service';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {MatDialog} from '@angular/material';
import {EmployeeDeleteDialogComponent} from '../employee-delete-dialog/employee-delete-dialog.component';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {DepartmentDeleteDialogComponent} from '../../department/department-delete-dialog/department-delete-dialog.component';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {AuthenticationService} from '../../../services/authentication.service';


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

  constructor(private employeeService: EmployeeService,
              private departmentService: DepartmentService,
              private holidayYearSpecService: HolidayYearSpecService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private dialog: MatDialog) {

  }

  ngOnInit() {
      this.initData();
  }

  /**
   * Based on the ID of the emitted method, deletes an employee with the given Id
   * @param id
   */
  deleteEmployeeFromList(id: number){
    this.authenticationService.delete(id).subscribe();
    this.employeeService.delete(id).subscribe(()=> this.initData());
  }

  /**
   * Based on the ID of the emitted method, deletes an department with the given Id
   * @param id
   */
  deleteDepartmentFromList(id: number){
    this.departmentService.delete(id).subscribe(()=> this.initData());
  }


  deleteEmployeeFromDepartment(employeeId: number): void{
    let employee = this.employees.find(x => x.Id === employeeId);
    let dialogRef = this.dialog.open(EmployeeDeleteDialogComponent, {data: {employee: employee}});
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        this.deleteEmployeeFromList(employeeId);
      }
    });
  }

  deleteDepartment(departmentId: number){
    const department = this.departments.find(x => x.Id === departmentId);
    let dialogRef = this.dialog.open(DepartmentDeleteDialogComponent, {data: {department: department}});
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        if(department.Employees.length > 0){
          let dialogRef2 = this.dialog.open(UniversalErrorCatcherComponent, {
            data: {
              errorMessage: 'Der er stadig medarbejdere tilknyttet denne afdeling.',
              errorHandler: 'Slet/Flyt disse fra afdelingen og prøv igen.',
              multipleOptions: false
            }
          });
          dialogRef2.afterClosed().subscribe(() => {
            return;
          });
        }
        else {
          this.deleteDepartmentFromList(departmentId);
        }
      }
    });
  }

  updateDepartment(department: Department){
    let newDepartment: Department = {Id: department.Id, Name: department.Name, Employees: new Array<Employee>()};
    this.departmentService.put(newDepartment).subscribe(result => {
    });
  }

  /**
   * Inits the list
   */
  initData(){
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
      this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    });

  }

  /**
   * Navigate to create employee
   */
  createEmployee() {
    if(this.isAdmin()){
      this.router
        .navigateByUrl('employees/create');
    }
  }

  /**
   * Navigate to create employee
   */
  createDepartment(){
    if(this.isAdmin()){
      this.router
        .navigateByUrl('department/create');
    }
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
