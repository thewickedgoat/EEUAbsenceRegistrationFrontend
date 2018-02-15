import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {Absence} from '../../entities/absence';
import {AbsenceOverviewComponent} from './absence-overview.component';

@Component({
  selector: 'app-absence-overview-controller',
  templateUrl: './absence-overview-controller.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AbsenceOverviewControllerComponent implements OnInit {

  @ViewChild(AbsenceOverviewComponent) absenceOverview: AbsenceOverviewComponent;

  @Input()
  employee: Employee;

  absences: Absence[];

  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;

  vacationdays: Absence[];
  halfVacationdays: Absence[];
  vacationdaysUsed: number;
  vacationdaysLeft: number;

  vacationfreedays: Absence[];
  halfVacationfreedays: Absence[];
  vacationfreedaysUsed: number;
  vacationfreedaysLeft: number;

  constructor() {
  }

  ngOnInit() {
    //this.initData();
  }

  /**
   * inits the view

  initData(){
    this.initArrays();
    this.absences = this.employee.Absences;
    this.getVacationdays();
    this.calculateVacationdaysUsed();
    this.calculateVacationfreedaysUsed();
  }*/

  /**
   * refreshes the view
   * @param employee
   * @param holidayYearStart
   * @param holidayYearEnd

  refresh(employee: Employee, holidayYearStart: Date, holidayYearEnd: Date){
    this.employee = employee;
    this.holidayYearStart = holidayYearStart;
    this.holidayYearEnd = holidayYearEnd;
    //this.absences = this.employee.Absences;
    this.getVacationdays();
    this.calculateVacationdaysUsed();
    this.calculateVacationfreedaysUsed();
  }*/

  /**
   * calculates what the specific dates for the start and end of the holidayYear is

  getVacationdays() {
    this.vacationdays = [];
    this.halfVacationdays = [];
    this.vacationfreedays = [];
    this.halfVacationfreedays = [];
    const may = 4;
    const april = 3;
    for(let absence of this.absences)
    {
      if(absence.Status === Status.F)
      {
        if(absence.Date.getFullYear() === this.holidayYearStart.getFullYear() && absence.Date.getMonth() > may
          || absence.Date.getFullYear() === this.holidayYearEnd.getFullYear() && absence.Date.getMonth() < april)
        {
          this.vacationdays.push(absence);
        }
      }
      if(absence.Status === Status.FF)
      {
        if(absence.Date.getFullYear() === this.holidayYearStart.getFullYear() && absence.Date.getMonth() > may
          || absence.Date.getFullYear() === this.holidayYearEnd.getFullYear() && absence.Date.getMonth() < april)
        {
          this.vacationfreedays.push(absence);
        }
      }
      if(absence.Status === Status.HF)
      {
        if(absence.Date.getFullYear() === this.holidayYearStart.getFullYear() && absence.Date.getMonth() > may
          || absence.Date.getFullYear() === this.holidayYearEnd.getFullYear() && absence.Date.getMonth() < april)
        {
          this.halfVacationdays.push(absence);
        }
      }
      if(absence.Status === Status.HFF)
      {
        if(absence.Date.getFullYear() === this.holidayYearStart.getFullYear() && absence.Date.getMonth() > may
          || absence.Date.getFullYear() === this.holidayYearEnd.getFullYear() && absence.Date.getMonth() < april)
        {
          this.halfVacationfreedays.push(absence);
        }
      }
    }
  }*/

  /**
   * Calculation of vacationdays
   */
  calculateVacationdaysUsed() {
    const vacationdaysForThisYear = 25;
    const vacationDays = this.vacationdays.length;
    const halfVacationdays = this.halfVacationdays.length/2;
    const vacationdaysUsed = vacationDays + halfVacationdays;
    this.vacationdaysUsed = vacationdaysUsed;
    this.vacationdaysLeft = vacationdaysForThisYear - vacationdaysUsed;
  }

  /**
   * calculation of vacationfreedays
   */
  calculateVacationfreedaysUsed() {
    const vacationfreedaysForThisYear = 5;
    const vacationfreeDays = this.vacationfreedays.length;
    const halfVacationfreedays = this.halfVacationfreedays.length/2;
    const vacationfreedaysUsed = vacationfreeDays + halfVacationfreedays;
    this.vacationfreedaysUsed = vacationfreedaysUsed;
    this.vacationfreedaysLeft = vacationfreedaysForThisYear - vacationfreedaysUsed;
  }

  /**
   * Init arrays
   */
  initArrays(){
    this.vacationdays = new Array<Absence>();
    this.halfVacationdays = new Array<Absence>();
    this.vacationfreedays = new Array<Absence>();
    this.halfVacationfreedays = new Array<Absence>();
  }
}
