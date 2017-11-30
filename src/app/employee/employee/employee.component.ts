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

  constructor(private employeeService: EmployeeService, private router: Router, private activeRoute: ActivatedRoute) {

  }

  ngOnInit() {
  }
  delete(employee: Employee, $event) {
    this.employeeToDelete = employee;
    $event.stopPropagation();
  }

  cancelDeletion($event) {
    this.employeeToDelete = null;
    $event.stopPropagation();
  }

  deleteAccepted(id: number) {
    this.emitter.emit(id);
  }

  getRole(role: string)
  {
    return EmployeeRole[role];
  }

}


