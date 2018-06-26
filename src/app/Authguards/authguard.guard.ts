import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router){

  }
  isAuthenticated(): boolean{
    let loginToken = this.authenticationService.getToken();
    if(loginToken === null || loginToken.length === 0){
      return false;
    }
    else return true;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.isAuthenticated()){
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
    }
    else {
      return true;
    }
  }

}
