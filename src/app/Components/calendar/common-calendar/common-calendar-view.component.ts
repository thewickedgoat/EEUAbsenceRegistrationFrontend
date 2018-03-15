import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {Month} from '../../../entities/month';
import {Absence} from '../../../entities/absence';

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
  holidayYearStartDate: Date;
  @Input()
  holidayYearEndDate: Date;
  @Input()
  absencesInCurrentMonth: Absence[];
  @Input()
  daysInCurrentMonth: Date[];

  @Input()
  powerOfTwo: number;

  @Output()
  emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }



  /**
   * Gets the absence code to put in the calendar when fetched from the given absence
   * @param year
   * @param month
   * @param date
   * @returns {any}
   */
  getAbsenceCode(year: number, month: number, date: number){
    const absenceInMonth = this.absencesInCurrentMonth;
    if(absenceInMonth.length > 0) {
      const absence = absenceInMonth.find(
        abs => abs.Date.getFullYear() === year
      && abs.Date.getMonth() === month
      && abs.Date.getDate() === date);
      if(absence != null){
        return absence.Status.StatusCode;
      }
      else return ''
    }
    else return ''
  }

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
