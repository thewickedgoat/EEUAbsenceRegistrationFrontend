import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Month} from '../../../entities/month';
import {Status} from '../../../entities/status';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MonthComponent implements OnInit {

  @Input()
  holidayYear: HolidayYear;
  @Input()
  monthsInHolidayYear: Month[];
  @Input()
  statuses: Status[];
  @Input()
  loggedInUser: Employee;
  @Input()
  employee: Employee;
  @Output()
  emitter = new EventEmitter();

  constructor() {
  }
  ngOnInit() {
    console.log('im here');
    console.log(this.holidayYear);
  }

  /**
   * Refresh view
   * @param year
   */
  goToCalendar(month: number) {
    this.emitter.emit(month)
  }

}
