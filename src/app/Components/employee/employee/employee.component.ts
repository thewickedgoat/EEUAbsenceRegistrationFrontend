import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Employee} from '../../../entities/Employee';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeComponent implements OnInit {

  @Input()
  employee: Employee;

  loggedInUser: Employee;

  @Output()
  emitter = new EventEmitter();

  constructor(private router: Router,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
  }

  /**
   * Sets the employeeToDelete
   */
  delete() {
    this.emitter.emit(this.employee.Id);
  }

  /**
   * Page navigation to edit
   * @param $event
   */
  edit($event){
    $event.stopPropagation();
    this.router
      .navigateByUrl('employees/profile/' + this.employee.Id);

  }

   /**
   * Page navigation
   */
  goToCalendar(){
    const date = new Date();
    if(this.isEmployeeInHolidayYear()){
      this.router
        .navigateByUrl('calendar/' + this.employee.Id + '/' + date.getFullYear() + '/' + date.getMonth());
    }
    else {
      if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
        this.dialog.open(UniversalErrorCatcherComponent, {
          data: {
            errorMessage: '  Denne medarbejder er endnu ikke tilføjet til ferieåret  ',
            errorHandler: '  For at tilføje medarbejderen gå til: "Ferieårsadministration."  ',
            multipleOptions: false
          }
        });
      }
      else {
        this.dialog.open(UniversalErrorCatcherComponent, {
          data: {
            errorMessage: '  Denne medarbejder er endnu ikke tilføjet til ferieåret.  ',
            errorHandler: '  Administrator tilføjer medarbejderen senere.  ',
            multipleOptions: false
          }
        });
      }
    }
  }

  /**
   * Checks if the employee has a holidayYear that matches the current HolidayYearSpec
   */
  isEmployeeInHolidayYear(): boolean{
    const currentHolidayYear = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    if(this.employee.HolidayYears != null){
      const holidayYear = this.employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === currentHolidayYear.Id);
      if(holidayYear != null){
        return true;
      }
      else return false;
    }
    else return false;
  }

  /**
   * Checks for admin rights prevent user access to delete
   * @returns {boolean}
   */
  isAdmin(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else return false;
  }
}


