import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {EmployeeRole} from '../../../entities/employeeRole.enum';

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
  emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  admin()
  {
    return EmployeeRole.Administrator;
  }

  delete(id){
    this.emitter.emit(id);
  }
}
