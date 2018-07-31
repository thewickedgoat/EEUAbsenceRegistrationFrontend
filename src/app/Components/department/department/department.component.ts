import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {DepartmentEditDialogComponent} from '../department-edit-dialog/department-edit-dialog.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit {

  @Input()
  department: Department;
  @Output()
  deleteDepartmentEmitter = new EventEmitter();
  @Output()
  deleteEmployeeEmitter = new EventEmitter();
  @Output()
  updateDepartmentEmitter = new EventEmitter();

  loggedInUser: Employee;

  constructor(private router: Router,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.department.Employees.sort(this.sortEmployeesByName);
  }

  sortEmployeesByName(a: Employee, b: Employee) {
    let nameOfA = a.FirstName;
    let nameOfB = b.FirstName;
    return nameOfA > nameOfB ? 1 : (nameOfA < nameOfB ? -1 : 0);
  }


  /**
   * Page navigation to edit department
   * @param $event
   */
  edit(){
    let dialogRef = this.dialog.open(DepartmentEditDialogComponent, {
      data: {
        department: this.department,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        let newName = '';
        newName = result;
        this.department.Name = newName;
        this.updateDepartmentEmitter.emit(this.department);
      }
    });
  }

  deleteDepartment(){
    this.deleteDepartmentEmitter.emit(this.department.Id);
  }

  admin()
  {
    return EmployeeRole.Administrator;
  }

  delete(id){
    this.deleteEmployeeEmitter.emit(id);
  }

  /**
   * Checks for admin rights prevent user access to delete
   * @returns {boolean}
   */
  isAdmin(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else return false;
  }
}
