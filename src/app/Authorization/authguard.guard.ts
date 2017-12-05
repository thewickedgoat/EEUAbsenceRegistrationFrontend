import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {EmployeeService} from '../services/employee.service';

@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private employeeService: EmployeeService, private router: Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let isLoggedIn = this.employeeService.getEmployeeLoggedIn();
    console.log(isLoggedIn);
    if(isLoggedIn === null)
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
    return true;
  }
}
