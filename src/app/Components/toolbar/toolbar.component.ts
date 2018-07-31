import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Employee} from '../../entities/Employee';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {HolidayYearSpec} from '../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../services/holidayyearspec.service';
import {DateformatingService} from '../../services/dateformating.service';
import {Status} from '../../entities/status';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../Errors/universal-error-catcher/universal-error-catcher.component';

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
    private holidayYearSpecService: HolidayYearSpecService,
    private dateformatingService: DateformatingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.currentDate = new Date();
    this.currentDate.setFullYear(this.currentDate.getFullYear());
    this.currentDate.setMonth(this.currentDate.getMonth());
    this.holidayYearSpecService.getAll().subscribe(hys => {
      this.formatHolidayYearSpecs(hys);
      this.setHolidayYearSpecList(hys);
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

  getCurrentHolidayYearSpec(){
    let currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    currentHolidayYearSpec.StartDate = this.dateformatingService.formatDate(currentHolidayYearSpec.StartDate);
    currentHolidayYearSpec.EndDate = this.dateformatingService.formatDate(currentHolidayYearSpec.EndDate);
    this.currentHolidayYearSpec = currentHolidayYearSpec;
  }

  formatHolidayYearSpecs(holidayYearSpecs: HolidayYearSpec[]){
    if(holidayYearSpecs != null){
      for(let holidayYearSpec of holidayYearSpecs){
        holidayYearSpec.StartDate = this.dateformatingService.formatDate(holidayYearSpec.StartDate);
        holidayYearSpec.EndDate = this.dateformatingService.formatDate(holidayYearSpec.EndDate);
      }
    }
  }

  /**
   * Sets the list of HolidayYearSpecs depending on the loggedInUser being admin or not.
   * Admins should be able to see all HolidayYearSpecs, but 'normal' users should only
   * be able to see those who they have a HolidayYear reference with.
   */
  setHolidayYearSpecList(holidayYearSpecs: HolidayYearSpec[]){
    const holidayYearsInUser = this.loggedInUser.HolidayYears;
    let holidayYearSpecsMatched = new Array<HolidayYearSpec>();
    if(this.isAdmin()){
      holidayYearSpecs.sort(this.sortHolidayYearSpec);
      this.holidayYearSpecs = holidayYearSpecs;
    }
    else {
      for(let holidayYearSpec of holidayYearSpecs){
        const matchedHolidayYear = holidayYearsInUser.find(x => x.CurrentHolidayYear.Id === holidayYearSpec.Id);
        if(matchedHolidayYear != null){
          holidayYearSpecsMatched.push(holidayYearSpec);
        }
      }
      holidayYearSpecsMatched.sort(this.sortHolidayYearSpec);
      this.holidayYearSpecs = holidayYearSpecsMatched;
    }
  }

  sortHolidayYearSpec(a: HolidayYearSpec, b: HolidayYearSpec) {
    let idOfA = a.Id;
    let idOfB = b.Id;
    return idOfA > idOfB ? 1 : (idOfA < idOfB ? -1 : 0);
  }

  isCurrentHolidayYearSpec(id: number){
    const currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    if(currentHolidayYearSpec.Id === id){
      return true;
    }
    else return false;
  }

  selectHolidayYear(id: number){
    const index = +id;
    this.holidayYearSpecService.getById(index).subscribe(hys => {
      sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(hys));
      location.reload();
    });
  }

  toHolidayYearAdministration(){
    this.router.navigateByUrl('holidayyears');
  }

  toStats(){
    this.router.navigateByUrl('stats/' + this.currentHolidayYearSpec.StartDate.getFullYear());
  }

  toStatusAdministration(){
    this.router.navigateByUrl('status');
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
    this.router.navigateByUrl('employees/profile/' + this.loggedInUser.Id);
  }

  /**
   * Page navigation
   */
  toCalendar(){
    const currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    const employeeHolidayYear = this.loggedInUser.HolidayYears.find(x => x.CurrentHolidayYear.Id === currentHolidayYearSpec.Id);
    if(!employeeHolidayYear){
      this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: '  Du er i øjeblikket ikke oprettet i det valgte ferieår.  ',
          errorHandler: '  Kontakt administratoren for at blive tilføjet.  ',
          multipleOptions: false
        }
      });
    }
    else{
      this.router.navigateByUrl('calendar/' + this.loggedInUser.Id + '/' + this.currentDate.getFullYear() + '/' + this.currentDate.getMonth());
    }
  }

  /**
   * Page navigation
   */
  toPublicCalendar(){
    this.router.navigateByUrl('public-calendar/' + this.currentDate.getMonth());
  }
}
