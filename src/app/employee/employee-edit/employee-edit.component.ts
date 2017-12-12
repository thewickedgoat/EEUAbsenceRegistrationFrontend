import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Employee} from '../../entities/employee';
import {EmployeeService} from '../../services/employee.service';
import 'rxjs/add/operator/switchMap';
import {Department} from '../../entities/department';
import {DepartmentService} from '../../services/department.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeEditComponent implements OnInit {

  employee: Employee;
  departments: Department[];
  employeeGroup: FormGroup;
  employeeRole = EmployeeRole;
  constructor(private router: Router, private formBuilder: FormBuilder, private departmentService: DepartmentService,
              private employeeService: EmployeeService, private route: ActivatedRoute) {
    this.employeeGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      employeeRole:[EmployeeRole.Medarbejder],
      department: ['']
    });
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {this.employee = employee; console.log(this.employee);});
    this.departmentService.getAll().subscribe(departments => this.departments = departments);

  }

  ngOnInit() {
  }

  back(){
    this.router.navigateByUrl('employees');
  }

  updateEmployee(){
    this.employeeService.put(this.employee).subscribe(() => console.log(this.employee))
  }

  nameIsInvalid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  nameIsValid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

  test(){
    console.log(this.employee);
  }




}
