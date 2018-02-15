import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {Absence} from '../../../entities/absence';
import {Month} from '../../../entities/month';
import {AbsenceService} from '../../../services/absence.service';
import {Status} from '../../../entities/status';
import {MonthService} from '../../../services/month.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarViewComponent implements OnInit {

  @Input()
  weeks: any[];
  @Input()
  datesInWeeks: any[];
  @Input()
  amountOfWeeksInCurrentMonth: number[];
  @Input()
  currentMonth: Month;
  @Input()
  isMonthLocked: boolean;
  @Input()
  status: Status;

  absencesInCurrentMonth: Absence[] = [];

  @Output()
  emitter = new EventEmitter();

  constructor(private absenceService: AbsenceService, private monthService: MonthService) { }

  ngOnInit() {
    this.getAbsencesInCurrentMonth();
  }
  /**
   * based on the day of the week it wii return the weekList in the current week the calendar is building
   * @param id
   * @param day
   * @returns {number}
   */
  getWeekList(id: number, day: number){
    let currentWeek = this.weeks[id];

    return this.getDayInWeek(currentWeek, day);

  }

  ngOnChanges(){

    this.getAbsencesInCurrentMonth();
  }

  /**
   * Returns the day value: 0 - 6
   * @param days
   * @param day
   * @returns {number}
   */
  getDayInWeek(days: number[], day: number){
    return days[day].valueOf();
  }

  /**
   * Gets the status ment for the absence statuses that will be shown on the calendar
   * @param week
   * @param day
   * @returns {any}
   */
  getStatusForDate(week: number, day: number)
  {
    let currentDate = this.convertToDate(week, day);
    let absence = this.absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
    if(absence != null)
    {
      if(absence.Status.StatusName === "GRAY" ){
        return '+';
      }
      else{
        return absence.Status.StatusCode;
      }
    }
    else {
      return '+';
    }
  }

  /**
   * Gets a date number fx 30 for a date, and places it in the calendar on the given day.
   * If the date is empty " " - then it will be blank, meaning it isn't a value in this month
   * @param week
   * @param index
   * @returns {any}
   */
  convertToDate(week: number, index: number,){
    const day = this.getDateNumbersForCalendar(week, index);
    if(day != " "){
      let date = new Date(this.currentMonth.MonthDate.getFullYear(), this.currentMonth.MonthDate.getMonth(), day);
      if(day === -1)
      {
        return null;
      }
      else return date;
    }
  }

  getDateNumbersForCalendar(week: number, index: number,){
    if(this.datesInWeeks.length > 0){
      let currentWeek = this.datesInWeeks[week];
      if(currentWeek[index].valueOf() === -1)
      {
        return " ";
      }
      else{
        return currentWeek[index].valueOf();
      }
    }
  }

  /**
   * The Date() object in typescript does not play well with the restAPI's date format.
   * Converts the absence dates in the current employee one by one.
   */
  getAbsencesInCurrentMonth(){
    if(this.currentMonth.AbsencesInMonth != null){
      this.absencesInCurrentMonth = this.currentMonth.AbsencesInMonth;
      for(let absence of this.absencesInCurrentMonth){
        const absenceToAdd = absence.Date.toString();
        const date = new Date(Date.parse(absenceToAdd));
        absence.Date = date;
      }
    }
  }

  /**
   * Creates, edits or deletes an absences depending on the requirement.
   * If there is already and absence it will be updated with the new selected value.
   * If there is no absence a new absence will be created on that date.
   *
   * @param week
   * @param day
    */
   changeAbsence(week: number, day: number){
     let absencesInCurrentMonth = this.currentMonth.AbsencesInMonth;
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null)
    {
      let currentAbsence = absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
      if(this.status != null){
        if(currentAbsence != null)
        {
          currentAbsence.Status = this.status;
          this.monthService.getById(this.currentMonth.Id).subscribe(month=> {
            currentAbsence.Month = month;
            this.absenceService.put(currentAbsence).subscribe(() => {});
          });
        }
        else{
          let absenceToCreate = ({Date: currentDate, Status: this.status, Month: this.currentMonth});
          this.absenceService.post(absenceToCreate).subscribe(() => this.refreshCalendar());
        }
      }
      else {
        if(currentAbsence != null){
          this.absenceService.delete(currentAbsence.Id).subscribe(() => {
            this.refreshCalendar();
          });
        }
      }
    }
  }

  refreshCalendar(){
     this.emitter.emit();
  }
}
