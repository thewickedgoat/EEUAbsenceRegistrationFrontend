import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
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

@Component({
  selector: 'app-workfreedays',
  templateUrl: './workfreedays.component.html',
  styleUrls: ['./workfreedays.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedaysComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;
  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;
  @Input()
  employees: Employee[];

  absencesInTotal: Absence[] = [];

  @Output()
  emitter = new EventEmitter();

  constructor(private absenceService: AbsenceService,
              private employeeService: EmployeeService,
              private publicHolidayService: PublicholidayService,
              private workfreedayService: WorkfreedayService,
              private dateformatingService: DateformatingService,
              private dialog: MatDialog,
              private router: Router) {

  }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.formatAbsenceDatesForAllEmployees();
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
          if(absenceOnPublicHoliday.length > 0){
            this.publicHolidayError(absenceOnPublicHoliday, publicHoliday);
            return;
          }
          else {
            this.publicHolidayService.post(publicHoliday).subscribe( ph => {
              this.updateView();
            });
          }
        }
      }
      else return;
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

  publicHolidayError(absences: Absence[], publicHoliday: PublicHoliday){
    let dialogRef = this.dialog.open(PublicholidayCreateErrorComponent, {
      data: {
        errorMessage: 'Der blev fundet dage med fraværskoder overløbende med den angivede helligdag.',
        errorHandleMessage: 'Vil du fjerne de ovennævnte fraværskoder',
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
