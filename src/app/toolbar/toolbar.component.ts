import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Employee} from '../entities/employee';
import {EmployeeRole} from '../entities/employeeRole.enum';
import {AuthenticationService} from '../services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  loggedInUser: Employee;
  currentDate: Date;

  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.currentDate = new Date();
    this.currentDate.setFullYear(this.currentDate.getFullYear());
    this.currentDate.setMonth(this.currentDate.getMonth());
  }

  isAdmin(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator)
    {
      return true;
    }
    else return false;
  }

  isChief(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Afdelingsleder){
      return true;
    }
    else return false;
  }

  /**
   * Page navigation
   */
  logOut(){
    this.authenticationService.logout();
    this.router.navigateByUrl('login');
  }
  /**
   * Page navigation
   */
  toEmployees(){
    this.router.navigateByUrl('employees');
  }
  /**
   * Page navigation
   */
  toEmployeeProfile(){
    this.router.navigateByUrl('employees/profile/' + this.loggedInUser.Id)
  }
  /**
   * Page navigation
   */
  toOverview(){
    this.router.navigateByUrl('overview/' + this.loggedInUser.Id)
  }
  /**
   * Page navigation
   */
  toCalendar(){
    this.router.navigateByUrl('calendar/' + this.loggedInUser.Id + '/' + this.currentDate.getFullYear() + '/' + this.currentDate.getMonth());
  }
  /**
   * Page navigation
   */
  toCommonCalendar(){
    this.router.navigateByUrl('common-calendar/' + this.currentDate.getFullYear() + '/' + this.currentDate.getMonth());
  }
}
