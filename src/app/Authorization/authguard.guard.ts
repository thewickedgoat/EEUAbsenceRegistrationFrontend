import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthguardGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router){

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /**
     * If the current session has a token attached, authentication will be approved
     * @type {string}
     */
    let isLoggedInWithToken = this.authenticationService.getToken();
    if(isLoggedInWithToken === null || isLoggedInWithToken.length === 0){
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;

    }
    else {
      return true;
    }
  }
}
