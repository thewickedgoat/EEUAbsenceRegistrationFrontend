import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/employee';
import {Router} from '@angular/router';

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

  loggedInUser: Employee;

  constructor(private router: Router) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
  }


  /**
   * Page navigation to edit department
   * @param $event
   */
  edit($event){
    $event.stopPropagation();
    this.router
      .navigateByUrl('department/edit/' + this.department.Id);

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
