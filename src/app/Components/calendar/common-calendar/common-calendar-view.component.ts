import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-common-calendar-view',
  templateUrl: './common-calendar-view.component.html',
  styleUrls: ['./common-calendar-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CommonCalendarViewComponent implements OnInit {

  @Input()
  employee: Employee;

  @Input()
  daysInCurrentMonth: Date[];

  @Input()
  powerOfTwo: number;

  @Output()
  emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    //this.getAbsencesInCurrentMonth();
  }

  /**
   * Gets the absence code to put in the calendar when fetched from the given absence
   * @param year
   * @param month
   * @param date
   * @returns {any}
   *
  getAbsenceCode(year: number, month: number, date: number){
    if(this.employee.Absences.length > 0) {
      const absence = this.employee.Absences.find(
        abs => abs.Date.getFullYear() === year
      && abs.Date.getMonth() === month
      && abs.Date.getDate() === date);
      if(absence != null){
        return Status[this.statusList[absence.Status]];
      }
      else return ''
    }
    else return ''
  }*/

  /**
   * Helper method for parsing dates from a different format from the rest-API. "hack"
   *
  getAbsencesInCurrentMonth(){
    if(this.employee.Absences != null){
      for(let absence of this.employee.Absences){
        const absenceToAdd = absence.Date.toString();
        const date = new Date(Date.parse(absenceToAdd));
        absence.Date = date;
      }
    }

  }*/

  /**
   * Styling method, every line that goes up into the power of 2 will be green instead of grey
   * @returns {boolean}
   */
  isPowerOfTwo(){
    const x = this.powerOfTwo+1
    for (let i = 0; i < 50;)
    {
      i = i + 2;
      if (x === i)
      {
        return true;
      }
    }
    return false;
}

  /**
   * Page navigation
   */
  goToCalendar(){
    this.emitter.emit(this.employee.Id)
  }
}
