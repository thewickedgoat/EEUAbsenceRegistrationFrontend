import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {Absence} from '../../../entities/absence';
import {Month} from '../../../entities/month';
import {AbsenceService} from '../../../services/absence.service';
import {Status} from '../../../entities/status';
import {MonthService} from '../../../services/month.service';
import {PublicHoliday} from '../../../entities/publicholiday';
import {Employee} from '../../../entities/Employee';

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
  @Input()
  absencesInCurrentMonth: Absence[];
  @Input()
  vacationLimitReached: boolean;
  @Input()
  publicHolidays: PublicHoliday[];
  @Input()
  employee: Employee;
  @Input()
  initHasBeenRun: boolean;

  @Output()
  emitter = new EventEmitter();
  @Output()
  addHoliday = new EventEmitter();
  @Output()
  vacationLimitCheck = new EventEmitter();
  @Output()
  deleteHoliday = new EventEmitter();
  @Output()
  updateHoliday = new EventEmitter();

  constructor(private absenceService: AbsenceService, private monthService: MonthService) { }

  ngOnInit() {
  }

  ngOnChanges(){
  }
  /**
   * based on the day of the week it wii return the weekList in the current week the calendar is building
   * @param week
   * @param day
   * @returns {number}
   */
  isDayEditable(week: number, day: number){
    let currentWeek = this.weeks[week];
    if(this.getDayInWeek(currentWeek, day) === -1){
      return false;
    }
    else if(this.isPublicHolidayOrWorkfreeday(week, day) === true){
      return false;
    }
    else return true;
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
      return absence.Status.StatusCode;
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
          let statusCode = this.status.StatusCode;
          if(currentAbsence != null)
          {
            this.resetVacationLimit();
            this.updateRemainingVacation(currentAbsence, false, statusCode);
            setTimeout(() => {
              if(this.vacationLimit(statusCode)){
                return;
              }
              else{
                this.updateAbsence(currentAbsence);
              }
            }, 100);
          }
          else{
            this.resetVacationLimit();
            let absenceToCreate = ({Date: currentDate, Status: this.status, Month: this.currentMonth});
            this.updateRemainingVacation(absenceToCreate, true, statusCode);
            setTimeout(() => {
              if(this.vacationLimit(statusCode)){
                return;
              }
              else{
                this.createAbsence(absenceToCreate);
              }
            }, 100);
          }
        }
        else {
          let absenceStatusCode = currentAbsence.Status.StatusCode;
          if(this.isStatusVacationRelated(absenceStatusCode)){
            this.updateRemainingVacation(currentAbsence, false,null);
            this.deleteAbsence(currentAbsence);
          }
          else{
            this.deleteAbsence(currentAbsence);
          }
        }
      }
  }

  deleteAbsence(absence: Absence){
    if(absence != null){
      this.absenceService.delete(absence.Id).subscribe(() => {
        this.refreshCalendar();
      });
    }
  }

  createAbsence(absence: Absence){
    this.absenceService.post(absence).subscribe(() => {
      this.refreshCalendar();
    });
  }

  updateAbsence(absence: Absence){
    absence.Status = this.status;
    this.monthService.getById(this.currentMonth.Id).subscribe(month=> {
      absence.Month = month;
      this.absenceService.put(absence).subscribe(() => {
        this.refreshCalendar();
      });
    });
  }

  vacationLimit(statusCode: string){
     if(this.vacationLimitReached === true && statusCode === 'F' ||
       this.vacationLimitReached === true && statusCode === 'FF' ||
       this.vacationLimitReached === true && statusCode === 'HF' ||
       this.vacationLimitReached === true && statusCode === 'HFF'){
       return true;
     }
     else return false;
  }

  updateRemainingVacation(absence: Absence, newAbsence: boolean, statusCode?: string){
    if(absence != null){
      let status = absence.Status.StatusCode;
      //Deletes
      if(this.isStatusVacationRelated(status) && statusCode === null){
        this.deleteHoliday.emit(absence);
      }
      else if(this.isStatusVacationRelated(status) && !this.isStatusVacationRelated(statusCode)){
        this.deleteHoliday.emit(absence);
      }
      //Creates
      else if(this.isStatusVacationRelated(status) && statusCode != null  && newAbsence && this.isStatusVacationRelated(statusCode)){
        this.addHoliday.emit(absence);
      }
      //Updates
      else if(!this.isStatusVacationRelated(status) && statusCode != null && this.isStatusVacationRelated(statusCode)){
        this.updateHoliday.emit(absence);
      }
      else if(this.isStatusVacationRelated(status) && this.isStatusVacationRelated(statusCode)){
        if(status === statusCode){
          return;
        }
        else{
          this.updateHoliday.emit(absence);
        }
      }
    }
  }

  refreshCalendar(){
     this.emitter.emit();
  }

  resetVacationLimit(){
     this.vacationLimitCheck.emit();
  }

  isStatusVacationRelated(statusCode: string){
    if(statusCode === 'F' || statusCode === 'FF' || statusCode === 'HF' || statusCode === 'HFF'){
      return true;
    }
    else return false;
  }

  isPublicHolidayOrWorkfreeday(week: number, day: number){
    let currentDate = this.convertToDate(week, day);
    let workfreeDay = this.employee.WorkfreeDays.find(x => x.Date.getFullYear() === currentDate.getFullYear() &&
    x.Date.getMonth() === currentDate.getMonth() && x.Date.getDate() === currentDate.getDate());
    if(workfreeDay != null){
      return true;
    }
    else return false;
  }
}
