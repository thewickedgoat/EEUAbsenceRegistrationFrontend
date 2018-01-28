import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/employee';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {EmployeeRole} from '../../entities/employeeRole.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginGroup: FormGroup;
  employees: Employee[];
  employeeToLogin: Employee;

  returnUrl : string;

  constructor(private router: Router, private authenticationService: AuthenticationService, private employeeService: EmployeeService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.employeeService.getAll().subscribe(employees => {this.employees = employees});
    this.loginGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    console.log(this.authenticationService.getToken());
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']||'/employees';
  }

  /**
   * Logs in the user after a loading periode, waits for token to be retrieved from the database
   * @param $event
   */
  loginEmployee($event){
    this.employeeToLogin = this.employees.find(emp => emp.UserName === this.loginGroup.controls['userName'].value);
    if(this.employeeToLogin.EmployeeRole === EmployeeRole.Administrator){
      this.authenticationService.login(this.employeeToLogin).subscribe(x => {
        this.validateLogin($event, x);
          this.router.navigate(['employees']);
      });
    }
    else {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      this.authenticationService.login(this.employeeToLogin).subscribe(x => {this.validateLogin($event, x);
        this.router.navigate(['common-calendar/' + year + '/' + month]);
      });
    }


  }


  /**
   * validates that a token was returned
   * @param event
   * @param token
   */
  validateLogin(event : any, token: any)
  {
    console.log(token);
    var bearerToken = token.access_token;
    if(bearerToken != null && bearerToken.length > 0)
    {
      sessionStorage.setItem('employee', JSON.stringify(this.employeeToLogin));
      sessionStorage.setItem('token', JSON.stringify(bearerToken));
    }
  }

  /**
   * Checks for input validation
   * @param controlName
   * @returns {boolean}
   */
  nameIsInvalid(controlName: string) {
    const control = this.loginGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * Checks for input validation
   * @param controlName
   * @returns {boolean}
   */
  nameIsValid(controlName: string) {
    const control = this.loginGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
