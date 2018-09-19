import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation, HostListener} from '@angular/core';
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
  daysInCurrentMonth: Date[];
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
  loggedInUser: Employee;
  @Input()
  initHasBeenRun: boolean;
  @Input()
  isEmployee: boolean;
  @Input()
  isChief: boolean;
  @Input()
  isCEO: boolean;
  @Input()
  isAdmin: boolean;
  @Input()
  lockDay: boolean;
  @Input()
  currentHolidayYearSpecHasChanged: boolean;

  currentWeekNumber: number;
  currentDayNumber: number;

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

  managingAbsence = false;

  constructor(private absenceService: AbsenceService, private monthService: MonthService) { }

  ngOnInit() {
    this.getWeekNumber(new Date());
  }


  @HostListener('click', ['$event']) clickEvent(event){
    event.srcElement.setAttribute('disabled', true);
    setTimeout(function() {
      event.srcElement.removeAttribute('disabled');
    }, 500);
  }

  getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo = Math.ceil(( ( (d.valueOf() - yearStart.valueOf()) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNo;
  }

  ngOnChanges(){
    if(this.managingAbsence === true){
      if(!this.isMonthLocked && !this.currentHolidayYearSpecHasChanged){
        this.changeAbsence();
      }
    }
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
   * If the day (absence is locked) returns true, otherwise false.
   * Helper method for the UI.
   * @param {number} week
   * @param {number} day
   * @returns {boolean}
   */
  dayIsLocked(week: number, day: number){
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null){
      let absence = this.absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
      if(absence != null){
        const isLockedByEmployee = absence.IsLockedByEmployee;
        const isLockedByChief = absence.IsLockedByChief;
        const isLockedByCEO = absence.IsLockedByCEO;
        const isLockedByAdmin = absence.IsLockedByAdmin;
        if(isLockedByEmployee || isLockedByChief || isLockedByCEO || isLockedByAdmin){
          return true;
        }
        else return false;
      }
    }
    else return false;
  }

  dayLockedByCurrentRole(week: number, day: number){
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null){
      let absence = this.absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
      if(absence != null) {
        const isLockedByEmployee = absence.IsLockedByEmployee;
        const isLockedByChief = absence.IsLockedByChief;
        const isLockedByCEO = absence.IsLockedByCEO;
        const isLockedByAdmin = absence.IsLockedByAdmin;
        if(this.isEmployee){
          if(this.isChief){
            if(isLockedByChief && !isLockedByCEO && !isLockedByAdmin){
              return true;
            }
            else return false;
          }
          else if(this.isCEO){
            if(isLockedByCEO && !isLockedByAdmin){
              return true;
            }
            else return false;
          }
          else {
            if(isLockedByEmployee && !isLockedByChief && !isLockedByCEO && !isLockedByAdmin){
              return true;
            }
            else return false;
          }
        }
        else if(this.isChief && !this.isEmployee){
          if(isLockedByChief && !isLockedByCEO && !isLockedByAdmin){
            return true;
          }
          else return false;
        }
        else if(this.isCEO && !this.isEmployee){
          if(isLockedByCEO && !isLockedByAdmin){
            return true;
          }
          else return false;
        }
        if(this.isAdmin){
          if(isLockedByAdmin){
            return true;
          }
        }
        else return false;
      }
    }
  }

  /**
   * The day (absence) is locked if a superior (Employee < Chief < CEO < Admin) has locked it.
   * Helper method for the UI.
   * @param {number} week
   * @param {number} day
   * @returns {boolean}
   */
  dayIsLockedBySuperior(week: number, day: number){
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null){
      let absence = this.absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
      if(absence != null){
        const isLockedByChief = absence.IsLockedByChief;
        const isLockedByCEO = absence.IsLockedByCEO;
        const isLockedByAdmin = absence.IsLockedByAdmin;
        if(this.isEmployee){
          if(this.isChief){
            if(!isLockedByCEO && !isLockedByAdmin){
              return false;
            }
            else return true;
          }
          if(this.isCEO){
            if(!isLockedByAdmin){
              return false;
            }
            else return true;
          }
          else {
            if(!isLockedByChief && !isLockedByCEO && !isLockedByAdmin){
              return false;
            }
            else return true;
          }
        }
        else if(this.isChief && !this.isEmployee){
          if(!isLockedByCEO && !isLockedByAdmin){
            return false;
          }
          else return true;
        }
        else if(this.isCEO && !this.isEmployee){
          if(!isLockedByAdmin){
            return false;
          }
          else return true;
        }
        else if(this.isAdmin){
          return false;
        }
      }
      else return false;
    }
    else return false;
  }

  /**
   * Returns the day value: 1 - 6 or -1 if day is 0 (The dates day value for sunday)
   * @param days
   * @param day
   * @returns {number}
   */
  getDayInWeek(days: number[], day: number){
    const sunday = 0;
    if(day != sunday){
      return days[day-1].valueOf();
    }
    else return -1;
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
      else {
        return date;
      }
    }
  }

  getDateNumbersForCalendar(week: number, day: number){
    const sunday = 0;
    if(this.datesInWeeks.length > 0){
      let currentWeek = this.datesInWeeks[week];
      if(day === sunday){
        if(currentWeek[currentWeek.length-1].valueOf() === -1)
        {
          return " ";
        }
        else {
          const tempIndex = currentWeek.length-1;
          return currentWeek[tempIndex].valueOf();
        }
      }
      else {
        if(currentWeek[day-1].valueOf() === -1)
        {
          return " ";
        }
        else {
          return currentWeek[day-1].valueOf();
        }
      }
    }
  }

  /**
   * Returns the weeknumber to the calendar. Return " " if blank.
   * @param {number} week
   * @param {number} day
   * @returns {number}
   */
  getWeekNumberForCalendar(week: number, day: number){
    let dateNumber = this.getDateNumbersForCalendar(week, day);
    if(dateNumber != " "){
      const date = this.daysInCurrentMonth.find(x => x.getDate() === dateNumber);
      return " / u." + this.getWeekNumber(date);
    }
    else return " ";
  }

  /**
   * Creates, edits or deletes an absences depending on the requirement.
   * If there is already and absence it will be updated with the new selected value.
   * If there is no absence a new absence will be created on that date.
   *
   * @param week
   * @param day
    */
  prepareAbsence(week: number, day: number){
    if(this.managingAbsence != true){
      this.managingAbsence = true;
      this.currentWeekNumber = week;
      this.currentDayNumber = day;
      this.refreshCalendar();
    }
  }

  deleteAbsence(absence: Absence){
    if(absence != null){
      this.absenceService.delete(absence.Id).subscribe(() => {
        this.managingAbsence = false;
        this.refreshCalendar();
      });
    }
  }

  createAbsence(absence: Absence){
    this.absenceService.post(absence).subscribe(() => {
      this.managingAbsence = false;
      this.refreshCalendar();
    });
  }

  updateAbsence(absence: Absence){
    if(this.status != null){
      absence.Status = this.status;
    }
    this.monthService.getById(this.currentMonth.Id).subscribe(month=> {
      absence.Month = month;
      this.absenceService.put(absence).subscribe(() => {
        this.managingAbsence = false;
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

  changeAbsence(){
    const week = this.currentWeekNumber;
    const day = this.currentDayNumber;
    let absencesInCurrentMonth = this.currentMonth.AbsencesInMonth;
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null)
    {
      let currentAbsence = absencesInCurrentMonth.find(x => x.Date.toDateString() === currentDate.toDateString());
      //If a status is selected, which means you are editing/changing an absence
      if(this.status != null){
        //If you want to edit an absence
        let statusCode = this.status.StatusCode;
        if(currentAbsence != null && !this.lockDay)
        {
          this.resetVacationLimit();
          this.updateRemainingVacation(currentAbsence, false, statusCode);
          setTimeout(() => {
            if(this.vacationLimit(statusCode)){
              this.managingAbsence = false;
              return;
            }
            else{
              this.updateAbsence(currentAbsence);
              return;
            }
          }, 100);
        }
        else if(currentAbsence != null && this.lockDay){
          currentAbsence.IsLockedByEmployee = this.isEmployee;
          currentAbsence.IsLockedByChief = this.isChief;
          currentAbsence.IsLockedByCEO = this.isCEO;
          currentAbsence.IsLockedByAdmin = this.isAdmin;
          this.updateAbsence(currentAbsence);
          return;
        }
        else{
          this.resetVacationLimit();
          let absenceToCreate = ({Date: currentDate, Status: this.status, Month: this.currentMonth,
            IsLockedByEmployee: false, IsLockedByChief: false, IsLockedByCEO: false, IsLockedByAdmin: false});
          this.updateRemainingVacation(absenceToCreate, true, statusCode);
          setTimeout(() => {
            if(this.vacationLimit(statusCode)){
              this.managingAbsence = false;
              return;
            }
            else{
              this.createAbsence(absenceToCreate);
              return;
            }
          }, 100);
        }
      }
      else {
        if(currentAbsence != null && this.lockDay === null){
          let absenceStatusCode = currentAbsence.Status.StatusCode;
          if(this.isStatusVacationRelated(absenceStatusCode)){
            this.updateRemainingVacation(currentAbsence, false,null);
            this.deleteAbsence(currentAbsence);
            return;
          }
          else{
            this.deleteAbsence(currentAbsence);
            return;
          }
        }
        else if(currentAbsence != null && this.lockDay){
          currentAbsence.IsLockedByEmployee = this.isEmployee;
          currentAbsence.IsLockedByChief = this.isChief;
          currentAbsence.IsLockedByCEO = this.isCEO;
          currentAbsence.IsLockedByAdmin = this.isAdmin;
          this.updateAbsence(currentAbsence);
          return;
        }
        else if(currentAbsence != null && !this.lockDay){
          if(!this.dayIsLockedBySuperior(week, day)){
            currentAbsence.IsLockedByEmployee = false;
            currentAbsence.IsLockedByChief = false;
            currentAbsence.IsLockedByCEO = false;
            currentAbsence.IsLockedByAdmin = false;
            this.updateAbsence(currentAbsence);
            return;
          }
          else {
            this.managingAbsence = false;
            return;
          }
        }
        this.managingAbsence = false;
        return;
      }
      this.managingAbsence = false;
      return;
    }
    this.managingAbsence = false;
    return;
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
    let publicHoliday = this.publicHolidays.find(x => x.Date.getFullYear() === currentDate.getFullYear() &&
      x.Date.getMonth() === currentDate.getMonth() && x.Date.getDate() === currentDate.getDate());
    if(publicHoliday != null){
      return true;
    }
    let workfreeDay = this.employee.WorkfreeDays.find(x => x.Date.getFullYear() === currentDate.getFullYear() &&
    x.Date.getMonth() === currentDate.getMonth() && x.Date.getDate() === currentDate.getDate());
    if(workfreeDay != null){
      return true;
    }
    else return false;
  }
}
