import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {DepartmentService} from '../../../services/department.service';
import {Department} from '../../../entities/department';
import {EmployeeService} from '../../../services/employee.service';
import {Employee} from '../../../entities/Employee';
import {EmployeeRole} from '../../../entities/employeeRole.enum';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeEditComponent implements OnInit {
  isNotEditable: boolean;
  employeeUpdated: boolean;
  employee: Employee;
  departments: Department[];
  employeeGroup: FormGroup;
  employeeRole = EmployeeRole;
  showPassword: boolean;
  loggedInUser: Employee;
  constructor(private location: Location, private formBuilder: FormBuilder, private departmentService: DepartmentService,
              private employeeService: EmployeeService, private route: ActivatedRoute) {
    this.showPassword = false;
    this.employeeUpdated = false;
    this.isNotEditable = true;
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {this.employee = employee; console.log(this.employee); this.createFormgroup();});
    this.departmentService.getAll().subscribe(departments => this.departments = departments);

  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
  }

  /**
   * Feeds the formgroup values from init
   */
  createFormgroup(){
    this.employeeGroup = this.formBuilder.group({
      firstName: [{value: '', disabled: this.isNotEditable}, Validators.required],
      lastName: [{value: '', disabled: this.isNotEditable}, Validators.required],
      userName: [{value: '', disabled: this.isNotEditable}, Validators.required],
      email: [{value: '', disabled: this.isNotEditable}, Validators.required],
      password: [{value: '', disabled: this.isNotEditable}, Validators.required],
      employeeRole:[{value: this.employee.EmployeeRole, disabled: this.isNotEditable}, Validators.required],
      department: [{value: '', disabled: this.isNotEditable}, Validators.required]
    });
  }


  /**
   * Goes back to last visited page
   */
  back(){
    this.location.back()
  }

  /**
   * Updates the employee
   */
  updateEmployee(){
    this.employeeService.put(this.employee).subscribe(() => console.log(this.employee))
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

  /**
   * Hide or show password
   * @returns {boolean}
   */
  hideShowPassword(){
    if(this.showPassword === false){
      return this.showPassword = true;
    }
    if(this.showPassword === true){
      return this.showPassword = false;
    }
  }

  /**
   * Allows for different eidits based on role
   */
  edit(){
    this.employeeGroup.controls['firstName'].enable();
    this.employeeGroup.controls['lastName'].enable();
    this.employeeGroup.controls['email'].enable();
    this.employeeGroup.controls['password'].enable();
    if(this.isAdmin()){
      this.employeeGroup.controls['userName'].enable();
      this.employeeGroup.controls['employeeRole'].enable();
      this.employeeGroup.controls['department'].enable();
    }
    this.isNotEditable = false;

  }

  /**
   * Save/Cancel edit
   */
  stopEdit(){
    this.employeeGroup.controls['firstName'].disable();
    this.employeeGroup.controls['lastName'].disable();
    this.employeeGroup.controls['email'].disable();
    this.employeeGroup.controls['password'].disable();
    if(this.isAdmin()){
      this.employeeGroup.controls['userName'].disable();
      this.employeeGroup.controls['employeeRole'].disable();
      this.employeeGroup.controls['department'].disable();
    }
    this.isNotEditable = true;
    this.employeeUpdated = true;
    setTimeout(()=> {
      this.employeeUpdated = false;
    }, 3000);
  }

  /**
   * Checks if the current logged in employee has admin rights
   * @returns {boolean}
   */
  isAdmin(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else return false;
  }


}
