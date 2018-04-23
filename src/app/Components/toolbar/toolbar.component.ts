import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Employee} from '../../entities/employee';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {HolidayYearSpec} from '../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../services/holidayyearspec.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit {

  loggedInUser: Employee;
  currentDate: Date;
  holidayYearSpecs: HolidayYearSpec[];
  currentHolidayYearSpec: HolidayYearSpec;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private holidayYearSpecService: HolidayYearSpecService) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.currentDate = new Date();
    this.currentDate.setFullYear(this.currentDate.getFullYear());
    this.currentDate.setMonth(this.currentDate.getMonth());
    this.holidayYearSpecService.getAll().subscribe(hys => {
      this.formatHolidayYearSpecs(hys);
      this.holidayYearSpecs = hys;
      this.getCurrentHolidayYearSpec();
    })
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

  getCurrentHolidayYearSpec(){
    const date = new Date();
    this.currentHolidayYearSpec = this.holidayYearSpecs.find(x => x.StartDate <= date && x.EndDate >= date);
  }

  formatHolidayYearSpecs(holidayYearSpecs: HolidayYearSpec[]){
    if(holidayYearSpecs != null){
      for(let holidayYearSpec of holidayYearSpecs){
        const startDateToParse = holidayYearSpec.StartDate.toString();
        const endDateToParse = holidayYearSpec.EndDate.toString();
        const startDate = new Date(Date.parse(startDateToParse));
        const endDate = new Date(Date.parse(endDateToParse));
        holidayYearSpec.StartDate = startDate;
        holidayYearSpec.EndDate = endDate;
      }
    }
  }

  toHolidayYearAdministration(){
    this.router.navigateByUrl('holidayyears');
  }

  toStats(){
    this.router.navigateByUrl('stats/' + this.currentHolidayYearSpec.StartDate.getFullYear())
  }

  /**
   * Page navigation
   */
  logOut(){
    this.authenticationService.logout(JSON.parse(sessionStorage.getItem('currentEmployee')));
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
