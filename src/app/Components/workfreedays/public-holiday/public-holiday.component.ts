import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material';
import {Employee} from '../../../entities/Employee';
import {WorkfreedayService} from '../../../services/workfreeday.service';
import {EmployeeService} from '../../../services/employee.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {PublicholidaysCreateViewComponent} from '../publicholidays-create-view/publicholidays-create-view.component';
import {PublicholidayService} from '../../../services/publicholiday.service';
import {Absence} from '../../../entities/absence';
import {Router} from '@angular/router';
import {PublicHoliday} from '../../../entities/publicholiday';
import {PublicholidayCreateErrorComponent} from '../../Errors/publicholiday-create-error/publicholiday-create-error.component';
import {AbsenceService} from '../../../services/absence.service';
import {DateformatingService} from '../../../services/dateformating.service';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';

@Component({
  selector: 'app-public-holiday',
  templateUrl: './public-holiday.component.html',
  styleUrls: ['./public-holiday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicHolidayComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  employees: Employee[];

  absencesInTotal: Absence[] = [];

  @Output()
  emitter = new EventEmitter();

  constructor(private absenceService: AbsenceService,
              private employeeService: EmployeeService,
              private holidayYearSpecService: HolidayYearSpecService,
              private publicHolidayService: PublicholidayService,
              private workfreedayService: WorkfreedayService,
              private dateformatingService: DateformatingService,
              private dialog: MatDialog,) {

  }

  ngOnInit() {
    this.initData();
  }

  ngOnChanges(){
    console.log('omae wa mou shindeiru');
    if(this.currentHolidayYearSpec != null){
      console.log(this.currentHolidayYearSpec.PublicHolidays);
    }
  }

  initData(){
    //this.formatAbsenceDatesForAllEmployees();
  }

  createPublicHoliday(){
    let publicHoliday;
    let dialogRef = this.dialog.open(PublicholidaysCreateViewComponent, {
      data: {
        currentHolidayYearSpec: this.currentHolidayYearSpec
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      publicHoliday = result;
      if(publicHoliday != null){
        const absencesInTotal = this.absencesInTotal;
        if(absencesInTotal.length != null){
          const absenceOnPublicHoliday = absencesInTotal.filter(x => x.Date.getFullYear() === publicHoliday.Date.getFullYear()
            && x.Date.getMonth() === publicHoliday.Date.getMonth() && x.Date.getDate() === publicHoliday.Date.getDate());
          //If the public holiday isn't within the start- or enddate of the holidayYearSpec
          if(this.isPublicHolidayNotInYear(publicHoliday) === true){
            this.publicHolidayError(absenceOnPublicHoliday, publicHoliday, 2);
            return;
          }
          //If the public holiday is overlapping with absences already created
          else if(absenceOnPublicHoliday.length > 0 ){
            this.publicHolidayError(absenceOnPublicHoliday, publicHoliday, 1);
            return;
          }
          else {
            this.updateCurrentHolidayYearSpec(publicHoliday);
          }
        }
      }
      else return;
    });
  }

  updateCurrentHolidayYearSpec(publicHoliday: PublicHoliday){
    this.publicHolidayService.post(publicHoliday).subscribe( ph => {
      this.currentHolidayYearSpec.PublicHolidays.push(ph);
      sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(this.currentHolidayYearSpec));
      this.updateView();
    });
  }

  formatAbsenceDatesForAllEmployees(){
    let absencesInTotal = [];
    for(let employee of this.employees){
      const absencesInEmployee = this.formatAbsenceDates(employee);
      for(let absence of absencesInEmployee){
        absencesInTotal.push(absence);
      }
    }
    this.absencesInTotal = absencesInTotal;
  }

  formatAbsenceDates(employee: Employee){
    let absencesInEmployee = [];
    const currentHolidayYear = employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(currentHolidayYear != null){
      if(currentHolidayYear.Months.length > 0){
        for(let month of currentHolidayYear.Months){
          if(month.AbsencesInMonth.length > 0){
            for(let absence of month.AbsencesInMonth){
              absence.Date = this.dateformatingService.formatDate(absence.Date);
              absencesInEmployee.push(absence);
            }
          }
        }
      }
      return absencesInEmployee;
    }
  }

  isPublicHolidayNotInYear(publicHoliday: PublicHoliday){
    if(publicHoliday.Date >= this.currentHolidayYearSpec.StartDate && publicHoliday.Date <= this.currentHolidayYearSpec.EndDate){
      return false;
    }
    else return true;
  }

  publicHolidayError(absences: Absence[], publicHoliday: PublicHoliday, errorNumber: number){
    let dialogRef = this.dialog.open(PublicholidayCreateErrorComponent, {
      data: {
        errorNumber: errorNumber,
        errorMessage1: 'Der blev fundet dage med fraværskoder overløbende med den angivede helligdag.',
        errorHandleMessage1: 'Vil du fjerne de ovennævnte fraværskoder',
        errorMessage2: 'Den pågælende helligdag ligger ikke i samme ferieår som det angivne.',
        errorHandleMessage2: 'Prøv igen.',
        publicHoliday: publicHoliday,
        absences: absences,
      },
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === true){
        for(let absence of absences){
          this.absenceService.delete(absence.Id).subscribe(() => {

          });
        }
        this.updateView();
      }
    });
  }

  updateView(){
    this.emitter.emit()
  }
}
