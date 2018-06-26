import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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

  loginError: boolean = false;
  loginGroup: FormGroup;
  employees: Employee[];
  employeeToLogin: Employee;
  loggingIn: boolean = false;
  returnUrl : string;

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
    let username = this.loginGroup.controls['userName'].value;
    let password = this.loginGroup.controls['password'].value;
    this.authenticationService.login(username, password).subscribe(data => {
      console.log(data);
      this.validateLogin($event, data);
      this.loggingIn = true;
      setTimeout(() => {
        this.employeeService.getAll().subscribe(employees => {
          let employeeToLogin = employees.find(x => x.UserName === username);
          sessionStorage.setItem('currentEmployee', JSON.stringify(employeeToLogin));
          this.setSelectedHolidayYearSpec();
          this.router.navigateByUrl(this.returnUrl);
        });
      }, 3000);
    }, error => {
      if(error.status.toString() === '400'){
        this.loginFailed();
      }
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
      console.log('ayyy');
      sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(spec));
      console.log(JSON.parse(sessionStorage.getItem('currentHolidayYearSpec')));
      console.log(spec);
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

  close(){
    this.loginError = false;
  }
}
