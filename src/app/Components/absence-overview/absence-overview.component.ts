import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Absence} from '../../entities/absence';
import {Status} from '../../entities/status';
import {HolidayYear} from '../../entities/HolidayYear';

@Component({
  selector: 'app-absence-overview',
  templateUrl: './absence-overview.component.html',
  styleUrls: ['./absence-overview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbsenceOverviewComponent implements OnInit {
  @Input()
  absencesWithStatus: Absence[];
  @Input()
  status: Status;
  @Input()
  holidayYear: HolidayYear;

  vacationDays: Absence[];
  halfVacationDays: Absence[];

  constructor() { }

  ngOnInit() {
    this.getVacationSpent();

  }

  daysSpent(){
    const days = this.vacationDays.length;
    const halfDays = this.halfVacationDays.length/2;
    let test = days+halfDays;
    return test;
  }


  getVacationSpent(){
    let vacationSpent = new Array<Absence>();
    let halfVacationSpent = new Array<Absence>();
    if(this.status.StatusCode === 'F'){
      for(let absence of this.absencesWithStatus){
        if(absence.Status.StatusCode === 'HF'){
          halfVacationSpent.push(absence);
        }
        else {
          vacationSpent.push(absence);
        }
      }
      this.vacationDays = vacationSpent;
      this.halfVacationDays = halfVacationSpent;
      this.daysSpent();
    }
    else if(this.status.StatusCode === 'FF'){
      for(let absence of this.absencesWithStatus){
        if(absence.Status.StatusCode === 'HFF'){
          halfVacationSpent.push(absence);
        }
        else {
          vacationSpent.push(absence);
        }
      }
      this.vacationDays = vacationSpent;
      this.halfVacationDays = halfVacationSpent;
      this.daysSpent();
    }
  }

}
