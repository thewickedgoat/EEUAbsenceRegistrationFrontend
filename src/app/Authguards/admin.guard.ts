import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {EmployeeRole} from '../entities/employeeRole.enum';

@Injectable()
export class AdminGuard implements CanActivate {


  constructor(private router: Router){

  }

  isUserAdmin(): boolean{
    let currentUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    if(currentUser === null){
      return false;
    }
    else {
      if(currentUser.EmployeeRole === EmployeeRole.Administrator){
        return true;
      }
      else return false;
    }
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.isUserAdmin()){
      return true;
    }
    else {
      this.router.navigate(['/employees']);
      return false;
    }
  }
}
