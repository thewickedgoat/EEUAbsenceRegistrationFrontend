import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {

  @Input()
  employee: Employee;

  loggedInUser: Employee;

  employeeToDelete: Employee;

  @Output()
  emitter = new EventEmitter();

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
  }

  /**
   * Sets the employeeToDelete
   */
  delete() {
    this.emitter.emit(this.employee.Id);
  }

  /**
   * Page navigation to edit
   * @param $event
   */
  edit($event){
    $event.stopPropagation();
    this.router
      .navigateByUrl('employees/profile/' + this.employee.Id);

  }

  /**
   * Self explanatory
   * @param $event
   */
  cancelDeletion($event) {
    this.employeeToDelete = null;
    $event.stopPropagation();
  }

  /**
   * emits the Id of the employee to delete
   * @param id
   * @param $event
   */
  deleteAccepted(id: number, $event) {
    $event.stopPropagation();
    this.emitter.emit(id);
  }

  /**
   * Page navigation
   */
  goToCalendar(){
    this.router
      .navigateByUrl('overview/' + this.employee.Id);
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


