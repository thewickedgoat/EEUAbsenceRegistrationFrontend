import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {Employee} from '../../../entities/employee';
import {EmployeeService} from '../../../services/employee.service';
import {HolidayYear} from '../../../entities/HolidayYear';
import {MatDialog} from '@angular/material';
import {WorkfreedayCreateErrorComponent} from '../../Errors/workfreeday-create-error/workfreeday-create-error.component';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {HolidayyearEmployeeCreateViewComponent} from '../holidayyear-employee-create-view/holidayyear-employee-create-view.component';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {HolidayyearCreateViewComponent} from '../holidayyear-create/holidayyear-create-view.component';
import {DateformatingService} from '../../../services/dateformating.service';

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
      tempHys = hys;
      this.currentHolidayYearSpec = tempHys;
    });
  }

  getEmployees(){
    this.employeeService.getAll().subscribe(emps => {
      this.employees = emps;
    });
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
      this.selectedEmployee = selectedEmployee;
      this.getEmployeeHolidayYear();
    }
  }

  getEmployeeHolidayYear(){
    let holidayYear = this.selectedEmployee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    console.log(holidayYear);
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
          this.createEmployeeHolidayYear();
        }
        else return;
      });
    }
    else{
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
    console.log(this.currentlyEditing);
  }

  createEmployeeHolidayYear(){
    console.log(this.currentHolidayYearSpec);
    let dialogRef = this.dialog.open(HolidayyearEmployeeCreateViewComponent, {
      data: {
        employee: this.selectedEmployee,
        holidayYearSpec: this.currentHolidayYearSpec
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != null){
        console.log(result);
        this.holidayyearService.post(result).subscribe(holidayYear => {
          this.selectedHolidayYear = holidayYear;
          this.initData();
        })
      }
    });
  }

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
            console.log(hys);
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
