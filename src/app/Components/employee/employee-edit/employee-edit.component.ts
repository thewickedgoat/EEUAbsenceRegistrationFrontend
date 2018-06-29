import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators, AbstractControl} from '@angular/forms';
import 'rxjs/add/operator/switchMap';
import {Location} from '@angular/common';
import {DepartmentService} from '../../../services/department.service';
import {Department} from '../../../entities/department';
import {EmployeeService} from '../../../services/employee.service';
import {Employee} from '../../../entities/Employee';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {AuthenticationService} from '../../../services/authentication.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {WorkfreeDay} from '../../../entities/workfreeDay';
import {DateformatingService} from '../../../services/dateformating.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeEditComponent implements OnInit {
  currentHolidayYearSpec: HolidayYearSpec;
  isNotEditable: boolean;
  employeeUpdated: boolean;
  employee: Employee;
  departments: Department[];
  employeeGroup: FormGroup;
  employeeRole = EmployeeRole;
  showPassword: boolean;
  loggedInUser: Employee;
  employeeWorkfreeDaysInYear: WorkfreeDay[];
  constructor(private location: Location,
              private formBuilder: FormBuilder,
              private departmentService: DepartmentService,
              private employeeService: EmployeeService,
              private authenticationService: AuthenticationService,
              private dateformatingService: DateformatingService,
              private route: ActivatedRoute) {
    this.showPassword = false;
    this.employeeUpdated = false;
    this.isNotEditable = true;
  }

  ngOnInit() {
    this.initData();
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
      passwordCheck: [{value: this.employee.Password, disabled: this.isNotEditable}, Validators.required],
      employeeRole:[{value: '', disabled: this.isNotEditable}, Validators.required],
      department: [{value: '', disabled: this.isNotEditable}, Validators.required]
    }, {validator: this.matchPassword}
    );
  }

  initData(){
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {
        this.employee = employee;
        this.createFormgroup();
        this.getHolidayYearSpec();
        this.formatHolidayYearStartEnd();
        this.formatWorkfreeDays();
        this.getWorkfreeDaysInHolidayYear(this.employee.WorkfreeDays);
      });
    this.departmentService.getAll().subscribe(departments => this.departments = departments);
  }

  matchPassword(AC: AbstractControl){
    let password = AC.get('password').value;
    let passwordCheck = AC.get('passwordCheck').value;
    if(password != passwordCheck){
      AC.get('passwordCheck').setErrors({MatchPassword: true})
    }
    else {
      return null;
    }
  }

  formatHolidayYearStartEnd(){
    let holidayYearSpec = this.currentHolidayYearSpec;
    holidayYearSpec.StartDate = this.dateformatingService.formatDate(holidayYearSpec.StartDate);
    holidayYearSpec.EndDate = this.dateformatingService.formatDate(holidayYearSpec.EndDate);
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
    const values = this.employeeGroup.value;
    let department = this.departments.find( x => x.Name === values.department);
    if(department != null){
      this.employee.Department = department;
    }
    this.authenticationService.update(this.employee).subscribe(() => {
    });
    this.employeeService.put(this.employee).subscribe(() => {
    });
  }

  passwordIsInvalid(controlName: string){
    const passwordCheck = this.employeeGroup.controls[controlName];
    const password = this.employeeGroup.controls['password'];
    if(passwordCheck.value != password.value){
      return passwordCheck.invalid;
    }
  }

  passwordIsValid(controlName: string){
    const values = this.employeeGroup.value;
    const passwordCheck = this.employeeGroup.controls[controlName];
    if(passwordCheck.value === values.password){
      return !passwordCheck.invalid;
    }
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
    this.employeeGroup.controls['passwordCheck'].enable();
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
    setTimeout(() =>{
      this.isNotEditable = true;
    }, 100);
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

  updateWorkfreeDaysList(){
    this.employeeService.getById(this.employee.Id)
      .subscribe(employee => {
        this.employee = employee;
        this.formatWorkfreeDays();
        this.getWorkfreeDaysInHolidayYear(this.employee.WorkfreeDays);
      });
  }

  getHolidayYearSpec(){
    this.currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
  }

  getWorkfreeDaysInHolidayYear(workfreeDays: WorkfreeDay[]){
    let currentWorkfreeDayList = new Array<WorkfreeDay>();
    for(let workfreeDay of workfreeDays){
      if(workfreeDay.Date >= this.currentHolidayYearSpec.StartDate && workfreeDay.Date <= this.currentHolidayYearSpec.EndDate){
        currentWorkfreeDayList.push(workfreeDay);

      }
    }
    this.employeeWorkfreeDaysInYear = currentWorkfreeDayList;
  }

  formatWorkfreeDays(){
    if(this.employee){
      if(this.employee.WorkfreeDays != null || this.employee.WorkfreeDays.length > 0) {
        for (let workfreeDay of this.employee.WorkfreeDays) {
          workfreeDay.Date = this.dateformatingService.formatDate(workfreeDay.Date);
        }
      }
    }
  }
}
