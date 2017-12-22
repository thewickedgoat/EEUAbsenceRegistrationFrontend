import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/employee';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Department} from '../../entities/department';
import {DepartmentService} from '../../services/department.service';
import {AuthenticationService} from "../../services/authentication.service";

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

  constructor(private authenticationService: AuthenticationService, private departmentService: DepartmentService, private employeeService: EmployeeService,
              private router: Router, private formBuilder: FormBuilder) {
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

  /**
   * creates the employee based on the input values.
   * Registers the employee for authentication afterwards.
   * Resets the formGroup
   */
  createEmployee() {
    const values = this.employeeGroup.value;
    console.log(this.employeeGroup.controls['department'].value)
    const department = this.getDepartment(this.employeeGroup.controls['department'].value);
    const employee: Employee = {FirstName: values.firstName, LastName: values.lastName,
      UserName: values.userName, Email: values.email, Password: values.password,
      EmployeeRole: values.employeeRole, Department: department};
    this.employeeService.post(employee).subscribe(emp => {
      console.log(emp);
      this.authenticationService.register(emp).subscribe(() => {
        this.employeeCreated = true;
        setTimeout(()=> {
          this.employeeCreated = false;
        }, 3000);
      });
      this.employeeGroup.reset();
    });
  }

  /**
   * Gets the department value for the formGroup
   * @param departmentName
   * @returns {Department}
   */
  getDepartment(departmentName: string){
    if(departmentName === ''){
      //by default the selector has its value set as the first department it runs in the loop,
      // but if nothing is selected it will be an empty string
      // the first department Id will always be 1, so therefore its defaulted here.
      const department = this.departments.find(dep => dep.Id === 1);
      console.log(department);
      return department;
    }
    else{
      const department = this.departments.find(dep => dep.Name === departmentName);
      console.log(department);
      return department;
    }

  }

  /**
   * 1 + 1 = 2
   */
  close() {
    this.employeeCreated = false;
  }

  /**
   * Checks if the name is invalid
   * @param controlName
   * @returns {boolean}
   */
  nameIsInvalid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * Checks if the name is valid
   * @param controlName
   * @returns {boolean}
   */
  nameIsValid(controlName: string) {
    const control = this.employeeGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
