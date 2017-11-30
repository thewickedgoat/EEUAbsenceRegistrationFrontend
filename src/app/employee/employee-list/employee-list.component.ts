import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/Employee';
import {Router} from '@angular/router';
import {EmployeeRole} from '../../entities/employeeRole.enum';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[];

  constructor(private employeeService: EmployeeService, private router: Router) {
    this.initData();
  }

  ngOnInit() {

  }

  deleteEmployeeFromList(id: number){
    this.employeeService.delete(id).subscribe(()=>this.initData());
  }

  initData(){
    this.employeeService.getAll().subscribe(employees => {this.employees = employees, console.log(this.employees);});

  }

  createEmployee() {
    this.router
      .navigateByUrl('employees/create');
  }

}
