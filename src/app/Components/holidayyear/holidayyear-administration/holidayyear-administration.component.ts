import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {HolidayYear} from '../../../entities/HolidayYear';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {HolidayyearEmployeeCreateViewComponent} from '../holidayyear-employee-create-view/holidayyear-employee-create-view.component';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {HolidayyearCreateViewComponent} from '../holidayyear-create/holidayyear-create-view.component';
import {DateformatingService} from '../../../services/dateformating.service';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {HolidayyearDeleteDialogComponent} from '../holidayyear-delete-dialog/holidayyear-delete-dialog.component';
import {PublicHoliday} from '../../../entities/publicholiday';

@Component({
  selector: 'app-holidayyear-administration',
  templateUrl: './holidayyear-administration.component.html',
  styleUrls: ['./holidayyear-administration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearAdministrationComponent implements OnInit {

  holidayYearSpecs: HolidayYearSpec[];
  currentHolidayYearSpec: HolidayYearSpec;
  selectedEmployee: Employee;
  selectedHolidayYear: HolidayYear;
  employees: Employee[];
  currentlyEditing: boolean = false;

  constructor(
    private holidayYearSpecService: HolidayYearSpecService,
    private employeeService: EmployeeService,
    private holidayyearService: HolidayyearService,
    private dateformatingService: DateformatingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.getHolidayYearSpecs();
    this.getCurrentHolidayYearSpec();
    this.getEmployees();
  }

  getHolidayYearSpecs(){
    this.holidayYearSpecService.getAll().subscribe(holidayYearSpecs => {
      this.holidayYearSpecs = holidayYearSpecs;
      for(let holidayYearSpec of this.holidayYearSpecs){
        this.formatHolidayYearStartEnd(holidayYearSpec);
      }
    });
  }

  getCurrentHolidayYearSpec(){
    const currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    currentHolidayYearSpec.StartDate = this.dateformatingService.formatDate(currentHolidayYearSpec.StartDate);
    currentHolidayYearSpec.EndDate = this.dateformatingService.formatDate(currentHolidayYearSpec.EndDate);
    this.currentHolidayYearSpec = currentHolidayYearSpec;
  }

  formatHolidayYearStartEnd(holidayYearSpec: HolidayYearSpec){
    if(holidayYearSpec != null){
      holidayYearSpec.StartDate = this.dateformatingService.formatDate(holidayYearSpec.StartDate);
      holidayYearSpec.EndDate = this.dateformatingService.formatDate(holidayYearSpec.EndDate);
    }
  }

  updateHolidayYearSpec(){
    let tempHys = this.currentHolidayYearSpec;
    this.currentHolidayYearSpec = new HolidayYearSpec();
    this.holidayYearSpecService.getById(tempHys.Id).subscribe(hys => {
      tempHys.PublicHolidays = hys.PublicHolidays;
      tempHys.HolidayYears = hys.HolidayYears;
      tempHys.PublicHolidays.sort(this.sortPublicHolidays);
      this.currentHolidayYearSpec = tempHys;
      sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(this.currentHolidayYearSpec));
    });
  }

  sortPublicHolidays(a: PublicHoliday, b: PublicHoliday) {
    let dateOfA = a.Date;
    let dateOfB = b.Date;
    return dateOfA > dateOfB ? 1 : (dateOfA < dateOfB ? -1 : 0);
  }

  getEmployees(){
    this.employeeService.getAll().subscribe(emps => {
      let admins = emps.filter(x => x.EmployeeRole === EmployeeRole.Administrator);
      for(let emp of emps){
        if(emp.EmployeeRole === EmployeeRole.Administrator){
          emps.splice(emps.indexOf(emp), admins.length);
        }
      }
      emps.sort(this.sortEmployeesByName);
      this.employees = emps;
    });
  }

  sortEmployeesByName(a: Employee, b: Employee) {
    let nameOfA = a.FirstName;
    let nameOfB = b.FirstName;
    return nameOfA > nameOfB ? 1 : (nameOfA < nameOfB ? -1 : 0);
  }

  selectEmployee(id: number){
    if(this.currentlyEditing === true){
      this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: 'Du er i øjeblikket i gang med at redigere i en anden medarbejder.',
          errorHandler: 'Afslut redigering først.',
          multipleOptions: false
        }
      });
    }
    else {
      let selectedEmployee = this.employees.find(x => x.Id === id);
      this.getEmployeeHolidayYear(selectedEmployee);
    }
  }

  getEmployeeHolidayYear(selectedEmployee: Employee){
    let holidayYear = selectedEmployee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(!holidayYear){
      let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: 'Der er endnu ikke oprettet specifikationer for denne medarbejder i det valgte ferieår.',
          errorHandler: 'Ønsker du at oprette specifikationerne?',
          multipleOptions: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.createEmployeeHolidayYear(selectedEmployee);
          return;
        }
        else return;
      });
    }
    else{
      this.selectedEmployee = selectedEmployee;
      this.selectedHolidayYear = holidayYear;
    }

  }

  toggleEdit(bool: boolean){
    if(bool === true){
      this.currentlyEditing = false;
    }
    else if(bool === false){
      this.currentlyEditing = true;
    }
  }

  createEmployeeHolidayYear(selectedEmployee: Employee){
    const holidayYearSpec = this.currentHolidayYearSpec;
    let dialogRef = this.dialog.open(HolidayyearEmployeeCreateViewComponent, {
      data: {
        employee: selectedEmployee,
        holidayYearSpec: holidayYearSpec
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        this.selectedEmployee = selectedEmployee;
        this.holidayyearService.post(result).subscribe(holidayYear => {
          this.selectedHolidayYear = holidayYear;
          this.updateHolidayYearSpec();
          this.initData();
        })
      }
    });
  }

  deleteCurrentHolidayYearSpec(){
    let hasData: boolean;
    if(this.currentHolidayYearSpec.HolidayYears.length > 0){
      hasData = true;
    }
    else{
      hasData = false;
    }

    let dialogRef = this.dialog.open(HolidayyearDeleteDialogComponent, {
      data: {
        holidayYears: this.currentHolidayYearSpec.HolidayYears,
        hasData: hasData,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        if(this.holidayYearSpecs.length === 1){
          let dialogError = this.dialog.open(UniversalErrorCatcherComponent, {
            data: {
              errorMessage: '  Du kan ikke slette dette ferieår, da det er det eneste i databasen.  ',
              errorHandler: '  Opret et nyt ferieår og prøv igen.',
              multipleOptions: false
            }
          });
        }
        else {
          this.holidayYearSpecService.delete(this.currentHolidayYearSpec.Id).subscribe(() => {
            this.setNewHolidayYearSpec();
          });
        }
      }
    });
  }


  setNewHolidayYearSpec(){
    let newHolidayYearSpec = this.holidayYearSpecs[0];
    this.currentHolidayYearSpec = newHolidayYearSpec;
    sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(newHolidayYearSpec));
    location.reload();
    return;
  }

  /**
   * Creates a holidayYearSpec if it has the required parameters
   */
  createHolidayYearSpec(){
    let dialogRef = this.dialog.open(HolidayyearCreateViewComponent, {
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        if(this.isStartEndDateWrong(result)){
          this.wrongStartEndDateError();
          return;
        }
        //if(this.isOverlapping(result)){
        //  this.overlappingError();
        //  return;
        //}
        if(this.isMoreThanWholeYear(result)){
          this.isNotWholeYearError();
          return;
        }
        else{
          this.holidayYearSpecService.post(result).subscribe(hys => {
            this.currentHolidayYearSpec = hys;
            sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(hys));
            location.reload();
          })
        }
      }
    });
  }

  /**
   * Checks if the holidayYearSpecToCreate is overlapping with an earlier holidayYearSpec
   * @param {HolidayYearSpec} holidayYearSpecToCreate
   * @returns {boolean}
   */
  isOverlapping(holidayYearSpecToCreate: HolidayYearSpec){
    const holidayYearSpecs = this.holidayYearSpecs;
    for(let holidayYearSpec of holidayYearSpecs){
      const startDate = holidayYearSpecToCreate.StartDate;
      if(startDate > holidayYearSpec.StartDate && startDate < holidayYearSpec.EndDate){
        return true;
      }
    }
    return false;
  }

  /**
   * Returns true if the holidayYearToCreate doesn't span over no more and no less than 12 months
   * Otherwise returns false.
   * @param {HolidayYearSpec} holidayYearSpecToCreate
   * @returns {boolean}
   */
  isMoreThanWholeYear(holidayYearSpecToCreate: HolidayYearSpec){
    let numberOfMonths = 0;
    let wholeYear = 12;
    const startDate = holidayYearSpecToCreate.StartDate;
    let dateToIterate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDate = holidayYearSpecToCreate.EndDate;
    do{
      numberOfMonths++;
      dateToIterate.setMonth(dateToIterate.getMonth()+1)
    }
    while(dateToIterate < endDate);
    if(numberOfMonths > wholeYear){
      return true;
    }
    else return false;
  }

  /**
   * Returns true if the holidayYearToCreate's startDate is higher than the endDate.
   * Returns false otherwise.
   * @param {HolidayYearSpec} holidayYearSpecToCreate
   * @returns {boolean}
   */
  isStartEndDateWrong(holidayYearSpecToCreate: HolidayYearSpec){
    if(holidayYearSpecToCreate.StartDate > holidayYearSpecToCreate.EndDate){
      return true;
    }
    else return false;
  }

  wrongStartEndDateError(){
    let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
      data: {
        errorMessage: 'Start datoen skal være lavere end Slut datoen.',
        errorHandler: 'Prøv igen.',
        multipleOptions: false
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      return;
    });
  }

  overlappingError(){
    let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
      data: {
        errorMessage: 'Dette ferieår har overlappende datoer med tidligere ferieår.',
        errorHandler: 'Prøv igen.',
        multipleOptions: false
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      return;
    });
  }

  isNotWholeYearError(){
    let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
      data: {
        errorMessage: 'Et ferieår kan ikke række over mere end 12 måneder.',
        errorHandler: 'Prøv igen.',
        multipleOptions: false
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      return;
    });
  }
}
