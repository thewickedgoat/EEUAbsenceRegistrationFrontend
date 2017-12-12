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

    let isLoggedInWithToken = this.employeeService.getToken();

    console.log('isLoggedInWithToken ' + isLoggedInWithToken);
    if(isLoggedInWithToken.length === 0){
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      console.log('sdfgdsfgdfg ');
      return false;

    }
    else {
      console.log('2222222222 ');
      return true;
    }
  }
}
