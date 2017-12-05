import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {EmployeeService} from '../../services/employee.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeRole} from '../../entities/employeeRole.enum';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {

  @Input()
  employee: Employee;

  employeeToDelete: Employee;

  @Output()
  emitter = new EventEmitter();

  constructor(private router: Router) {

  }

  ngOnInit() {
  }
  delete(employee: Employee, $event) {
    this.employeeToDelete = employee;
    $event.stopPropagation();
  }
  edit(){
    this.router
      .navigateByUrl('employees/edit/' + this.employee.Id);
  }

  cancelDeletion($event) {
    this.employeeToDelete = null;
    $event.stopPropagation();
  }

  deleteAccepted(id: number) {
    this.emitter.emit(id);
  }

  goToCalendar(){
    this.router
      .navigateByUrl('calendar/' + this.employee.Id);
  }

  getRole(role: string)
  {
    return EmployeeRole[role];
  }

}


