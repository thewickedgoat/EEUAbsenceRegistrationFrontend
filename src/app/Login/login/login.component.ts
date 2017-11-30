import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../entities/employee';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.employeeService.getAll().subscribe(employees => {this.employees = employees});
    this.loginGroup = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl']||'/employees';
  }

  loginEmployee($event){
    this.employeeToLogin = this.employees.find(emp => emp.UserName === this.loginGroup.controls['userName'].value);
    this.employeeService.loginEmployee(this.employeeToLogin).subscribe(x => {this.validateLogin($event, x); this.router.navigate(['/employees'])});

  }

  validateLogin(event : any, token: any)
  {
    console.log(token);
    var bearerToken = token.access_token;
    if(bearerToken != null && bearerToken.length > 0)
    {
      sessionStorage.setItem('employee', JSON.stringify(this.employeeToLogin));
      sessionStorage.setItem('token', JSON.stringify(bearerToken));
      console.log(bearerToken);
    }
  }

  nameIsInvalid(controlName: string) {
    const control = this.loginGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  nameIsValid(controlName: string) {
    const control = this.loginGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
