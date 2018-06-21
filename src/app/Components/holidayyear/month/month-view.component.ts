import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Status} from '../../../entities/status';
import {Month} from '../../../entities/month';
import {Router} from '@angular/router';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MonthViewComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

  @Input()
  statuses: Status[];
  @Input()
  month: Month;
  @Output()
  emitter = new EventEmitter();

  noAbsences: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    this.anyAbsence();
  }

  getAmountOfStatuses(statusname: string){
    const absences = this.month.AbsencesInMonth;
    let statusAmount = absences.filter(x => x.Status.StatusName === statusname);
    return statusAmount.length;
  }

  anyAbsence(){
    if(this.month.AbsencesInMonth.length > 0 || this.month.AbsencesInMonth === null){
      this.noAbsences = false;
    }
    else{
      this.noAbsences = true;
    }
  }
  goToCalendar(month: number){
    this.emitter.emit(month)
  }
}
