import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/employee';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Department} from '../../entities/department';
import {DepartmentService} from '../../services/department.service';
import {RegistrationService} from '../../services/registration.service';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeCreateComponent implements OnInit {

  employeeGroup: FormGroup;
  departments: Department[];
  employeeRole: EmployeeRole;
  employeeCreated = false;

  constructor(private departmentService: DepartmentService, private employeeService: EmployeeService,
              private registrationService: RegistrationService, private router: Router, private formBuilder: FormBuilder) {
    this.initData();
    this.employeeGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      employeeRole:[EmployeeRole.Medarbejder],
      department: ['']
      });
  }

  ngOnInit() {
  }

  back(){
    this.router.navigateByUrl('employees');
  }
  initData(){
    this.departmentService.getAll().subscribe(departments => {this.departments = departments, console.log(this.departments);});

  }

  createEmployee() {
    const values = this.employeeGroup.value;
    const departmentIndex = this.getDepartment();
    const department = this.departments.find(dep => dep.Id === departmentIndex);
    const employee: Employee = {FirstName: values.firstName, LastName: values.lastName,
      UserName: values.userName, Email: values.email, Password: values.password,
      EmployeeRole: values.employeeRole, Department: department};
    console.log(employee);
     this.employeeService.post(employee).subscribe(emp => {
      this.employeeGroup.reset();
      this.employeeCreated = true;
      setTimeout(()=> {
        this.employeeCreated = false;
      }, 3000);
    });
  }

  getDepartment(){
    switch(this.employeeGroup.controls['department'].value){
      case 'Utildelte Medarbejdere':
        console.log('works');
        return 0;
      case 'Fælles':
        console.log('works');
        return 1;
      case 'Erhverv':
        console.log('works');
        return 2;
      case 'Marketing':
        console.log('works');
        return 3;
    }
  }

  test(){
    console.log(this.employeeGroup.controls['department'].value);
    this.getDepartment();
  }

  close() {
    this.employeeCreated = false;
  }

  nameIsInvalid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  nameIsValid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
