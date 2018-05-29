import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {Absence} from '../../entities/absence';
import {AbsenceOverviewComponent} from './absence-overview.component';
import {Status} from '../../entities/status';
import {StatusService} from '../../services/status.service';
import {HolidayYear} from '../../entities/HolidayYear';
import {HolidayYearSpec} from '../../entities/holidayYearSpec';

@Component({
  selector: 'app-absence-overview-controller',
  templateUrl: './absence-overview-controller.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AbsenceOverviewControllerComponent implements OnInit {

  @ViewChild(AbsenceOverviewComponent) absenceOverview: AbsenceOverviewComponent;

  @Input()
  employee: Employee;
  @Input()
  absencesInCurrentMonth: Absence[];
  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;
  @Input()
  holidayYear: HolidayYear;
  @Input()
  holidayYearSpecs: HolidayYearSpec[];
  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  @Output()
  emitter = new EventEmitter();

  statuses: Status[];

  absenceStatusGroup: any[] = [];

  constructor(private statusService: StatusService) {

  }

  ngOnInit() {
    this.initData();
  }


  ngOnChanges(){
    this.initData();
  }

  /**
   * inits the view
   */
  initData(){
    this.statusService.getAll().subscribe(statuses => {
      this.statuses = statuses;
      this.getAllAbsencesInStatusGroup();
    });
  }

  getAllAbsencesInStatusGroup(){
    this.absenceStatusGroup = [];
    const absences = this.absencesInCurrentMonth;
    for(let status of this.statuses){
      let absencesInStatusGroup = new Array<Absence>();
      if(status.StatusCode === 'F'){
        for(let absence of absences){
          if(absence.Status.StatusCode === 'F' || absence.Status.StatusCode === 'HF'){
            absencesInStatusGroup.push(absence)
          }
        }
      }
      else if(status.StatusCode === 'FF'){
        for(let absence of absences){
          if(absence.Status.StatusCode === 'FF' || absence.Status.StatusCode === 'HFF'){
            absencesInStatusGroup.push(absence)
          }
        }
      }
      else {
        for(let absence of absences){
          if(absence.Status.Id === status.Id){
            absencesInStatusGroup.push(absence)
          }
        }
      }
      this.absenceStatusGroup.push(absencesInStatusGroup);
    }
   }

  getAbsenceWithStatus(index: number){
    let absencesWithStatus = this.absenceStatusGroup[index];
    return absencesWithStatus;

  }

  vacationSpent(){
    const vacationAvailable = this.holidayYear.HolidayAvailable+this.holidayYear.HolidayTransfered;
    const vacationSpent = this.holidayYear.HolidaysUsed;
    let remainingVacation = vacationAvailable-vacationSpent;
    return remainingVacation;
  }

  vacationfreedaysSpent(){
    const vacationAvailable = this.holidayYear.HolidayFreedayAvailable;
    const vacationSpent = this.holidayYear.HolidayFreedaysUsed;
    let remainingVacationFreedays = vacationAvailable-vacationSpent;
    return remainingVacationFreedays;
  }


}
