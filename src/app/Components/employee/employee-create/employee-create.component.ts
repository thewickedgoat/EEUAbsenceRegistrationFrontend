import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../../services/employee.service';
import {AuthenticationService} from '../../../services/authentication.service';
import {DepartmentService} from '../../../services/department.service';
import {Department} from '../../../entities/department';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';

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
  emails: string[] = [];

  constructor(private authenticationService: AuthenticationService,
              private departmentService: DepartmentService,
              private employeeService: EmployeeService,
              private router: Router,
              private formBuilder: FormBuilder,
              private dialog: MatDialog) {
    this.buildFormgrup();
  }

  ngOnInit() {
    this.initData();
  }

  back(){
    this.router.navigateByUrl('employees');
  }
  initData(){
    this.departmentService.getAll().subscribe(departments => {this.departments = departments; console.log(this.departments);});
    this.getAlreadyExistingEmails();
  }


  buildFormgrup(){
    this.employeeGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required],
      employeeRole:['', Validators.required],
      department: ['', Validators.required]
    },{validator: this.abstractValidator});
  }

  /**
   * Creates a list of all emails created in the employees
   */
  getAlreadyExistingEmails(){
    let alreadyExistingEmails = new Array<string>();
    this.employeeService.getAll().subscribe(emps => {
      for(let emp of emps){
        alreadyExistingEmails.push(emp.Email);
      }
      this.emails = alreadyExistingEmails;
    });
  }

  /**
   * Checks if the password and passwordCheck controls have the same value.
   * It sets and error if the password is not shorter than 12 characters, or if the
   * passwords don't match
   * @param {AbstractControl} AC
   * @returns {null}
   */
  abstractValidator(AC: AbstractControl){
    let minimumPasswordLength = 12;
    let password = AC.get('password').value;
    let passwordCheck = AC.get('passwordCheck').value;
    let email = AC.get('email').value;

    if(password != passwordCheck){
      AC.get('passwordCheck').setErrors({MatchPassword: true});
    }
    if(password.length < minimumPasswordLength){
      AC.get('passwordCheck').setErrors({MinimumLength: true});
      AC.get('password').setErrors({MinimumLength: true});
    }
    if(password.length === 0){
      AC.get('password').setErrors({NotEntered: true});
    }
    if(email.length === 0){
      AC.get('email').setErrors({NotEntered: true});
    }
    else {
      return null;
    }
  }

  passwordCheckIsInvalid(controlName: string){
    const passwordCheck = this.employeeGroup.controls[controlName];
    const password = this.employeeGroup.controls['password'];
    if(passwordCheck.value != password.value){
      return passwordCheck.invalid;
    }
  }

  passwordCheckIsValid(controlName: string){
    const values = this.employeeGroup.value;
    const passwordCheck = this.employeeGroup.controls[controlName];
    if(passwordCheck.value === values.password){
      return !passwordCheck.invalid;
    }
  }

  /**
   * creates the employee based on the input values.
   * Registers the employee for authentication afterwards.
   * Resets the formGroup
   */
  createEmployee() {
    const values = this.employeeGroup.value;
    const department = this.getDepartment(this.employeeGroup.controls['department'].value);
    const employee: Employee = {FirstName: values.firstName, LastName: values.lastName,
      UserName: values.userName, Email: values.email, Password: values.password,
      EmployeeRole: values.employeeRole, Department: department, PasswordReset: false};
    if(this.doesEmailAlreadyExist(values.email)){
      let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: 'Den angivne email eksisterer allerede på en anden bruger.',
          errorHandler: 'Angiv en unik email.',
          multipleOptions: false
        }
      });
    }
    else{
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
  }

  /**
   * Checks if the email is a duplicate in the system
   * The database requires unique emails for authentication
   */
  doesEmailAlreadyExist(email: string) {
    let emailDuplicate = this.emails.find(x => x === email);
    if(emailDuplicate != null){
      return true;
    }
    else return false;
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
      return department;
    }
    else{
      const department = this.departments.find(dep => dep.Name === departmentName);
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
