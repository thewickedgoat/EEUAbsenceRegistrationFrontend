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
   * Page navigation
   */
  goToCalendar(){
    const date = new Date();
    this.router
      .navigateByUrl('calendar/' + this.employee.Id + '/' + date.getFullYear() + '/' + date.getMonth());
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


