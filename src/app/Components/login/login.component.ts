import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/Employee';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {HolidayYearSpecService} from '../../services/holidayyearspec.service';
import {DateformatingService} from '../../services/dateformating.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  emailNotFound: boolean = false;
  loginError: boolean = false;
  loginGroup: FormGroup;
  changePasswordGroup: FormGroup;
  forgotPasswordGroup: FormGroup;
  employees: Employee[];
  employeeToLogin: Employee;
  changingPassword: boolean = false;
  loggingIn: boolean = false;
  returnUrl : string;
  forgotPassword: boolean = false;
  passwordIsSent: boolean;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              private holidayYearSpecService: HolidayYearSpecService,
              private dateFormatingService: DateformatingService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute) {
    this.loginGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.forgotPasswordGroup = this.formBuilder.group({
      email: ['', Validators.required]
    });
    this.changePasswordGroup = this.formBuilder.group({
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required]
    }, {validator: this.matchPassword});
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']||'/employees';
  }

  matchPassword(AC: AbstractControl){
    let minimumPasswordLength = 12;
    let password = AC.get('password').value;
    let passwordCheck = AC.get('passwordCheck').value;
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
    else {
      return null;
    }
  }

  noEmailFound(){
    this.emailNotFound = true;
    setTimeout(() => {this.emailNotFound = false}, 3000)
  }

  /**
   * Resets the password
   */
  resetPassword(){
    let email = this.forgotPasswordGroup.controls['email'].value;
    this.authenticationService.resetPassword(email).subscribe( result => {
      this.toggleForgotPassword();
      this.passwordIsSent = true;
      setTimeout(() => {this.passwordIsSent = false}, 3000)
    }, error => {
      if(error.status.toString() === '404'){
        this.noEmailFound();
      }
    });
  }

  /**
   * Toggles the boolean depending on if the view should be login or forgotPassword
   */
  toggleForgotPassword(){
    if(this.forgotPassword === false){
      this.forgotPassword = true;
    }
    else if(this.forgotPassword === true){
      this.forgotPassword = false;
    }
  }

  /**
   * Logs in the user after a loading periode, waits for token to be retrieved from the database
   * @param $event
   */
  loginEmployee($event){
    let username = this.loginGroup.controls['userName'].value.toLowerCase();
    let password = this.loginGroup.controls['password'].value;
    this.authenticationService.login(username, password).subscribe(data => {
      this.validateLogin($event, data);
      this.loggingIn = true;
      setTimeout(() => {
        this.employeeService.getAll().subscribe(employees => {
          let employeeToLogin = employees.find(x => x.UserName.toLowerCase() === username.toLowerCase());
          if(employeeToLogin.PasswordReset === true){
            this.changingPassword = true;
            this.employeeToLogin = employeeToLogin;
            this.loggingIn = false;
          }
          else {
            sessionStorage.setItem('currentEmployee', JSON.stringify(employeeToLogin));
            this.setSelectedHolidayYearSpec();
            this.router.navigate([this.returnUrl]);
          }
        });
      }, 1500);
    }, error => {
      if(error.status.toString() === '400'){
        this.loginFailed();
      }
    });
  }

  changePassword(){
    this.employeeToLogin.Password = this.changePasswordGroup.controls['password'].value;
    this.employeeToLogin.PasswordReset = false;
    this.authenticationService.update(this.employeeToLogin).subscribe(() => {
      this.loggingIn = true;
      sessionStorage.setItem('currentEmployee', JSON.stringify(this.employeeToLogin));
      setTimeout(() => {
        this.employeeService.put(this.employeeToLogin).subscribe(employee => {
          this.setSelectedHolidayYearSpec();
          this.router.navigateByUrl(this.returnUrl);
          this.loggingIn = false;
          return;
        });
      }, 1500)
    });

  }

  setSelectedHolidayYearSpec(){
    this.holidayYearSpecService.getAll().subscribe(specs => {
      let date = new Date();
      for(let spec of specs){
        spec.StartDate = this.dateFormatingService.formatDate(spec.StartDate);
        spec.EndDate = this.dateFormatingService.formatDate(spec.EndDate);
      }
      const spec = specs.find(x => x.StartDate <= date && x.EndDate >= date);
      sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(spec));
    });
  }

  loginFailed(){
    this.loginError = true;
    setTimeout(() => {this.loginError = false}, 3000)
  }

  /**
   * validates that a token was returned
   * @param event
   * @param token
   */
  validateLogin(event : any, token: any)
  {
    let bearerToken = token.access_token;
    if(bearerToken != null && bearerToken.length > 0)
    {
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

  /**
   * Input validation
   * @param controlName
   * @returns {boolean}
   */
  passwordIsValid(controlName: string){
    const control = this.changePasswordGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

  /**
   * Input validation
   * @param controlName
   * @returns {boolean}
   */
  passwordIsInvalid(controlName: string) {
    const control = this.changePasswordGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  close(){
    this.loginError = false;
  }
}
