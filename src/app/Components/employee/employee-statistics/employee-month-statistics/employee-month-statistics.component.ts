import {Component, Input, OnInit, OnChanges, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../../entities/Employee';
import {Month} from '../../../../entities/month';
import {Status} from '../../../../entities/status';
import {DateformatingService} from '../../../../services/dateformating.service';
import {HolidayYear} from '../../../../entities/HolidayYear';
import {Absence} from '../../../../entities/absence';

@Component({
  selector: 'app-employee-month-statistics',
  templateUrl: './employee-month-statistics.component.html',
  styleUrls: ['./employee-month-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeMonthStatisticsComponent implements OnInit {

  @Input()
  employee: Employee;
  @Input()
  currentMonth: Month;
  @Input()
  statuses: Status[];

  holidayYear: HolidayYear;
  holiday: number = 0;
  holidayFreedays: number = 0;
  timeoff: number = 0;
  maternity: number = 0;
  sickness: number = 0;
  course: number = 0;
  childsFirstSickness: number = 0;
  otherAbsence: number = 0;
  seniordays: number = 0;

  constructor(private dateformatingService: DateformatingService) { }

  ngOnInit() {
    this.getHolidayYear();
    this.sortAbsence();
  }

  ngOnChanges(){
    this.sortAbsence();
  }

  /**
   * Gets the current holidayYearSpec from the sessionStorage and formates the date into a proper date format
   * @returns {any}
   */
  getHolidayYearSpec(){
    const currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    currentHolidayYearSpec.StartDate = this.dateformatingService.formatDate(currentHolidayYearSpec.StartDate);
    currentHolidayYearSpec.EndDate = this.dateformatingService.formatDate(currentHolidayYearSpec.EndDate);
    return currentHolidayYearSpec;
  }

  /**
   * Get the current holidayYear from the employee
   */
  getHolidayYear(){
    let holidayYearSpec = this.getHolidayYearSpec();
    const holidayYear = this.employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === holidayYearSpec.Id);
    this.holidayYear = holidayYear;
  }

  /**
   * Calculates the remaining holiday available in the current month
   */
  getRemainingHoliday(){
    const months = this.holidayYear.Months;
    const holidayAvailable = this.holidayYear.HolidayAvailable+this.holidayYear.HolidayTransfered;
    let currentMonth = this.currentMonth;
    currentMonth.MonthDate.setHours(5,0,0,0);
    let index = 0;
    let holidaysSpentInInterval = 0;
    let startMonth;
    do{
      startMonth = months[index];
      startMonth.MonthDate.setHours(5,0,0,0);
      if(startMonth.AbsencesInMonth != null || startMonth.AbsencesInMonth > 0){
        let numberOfHolidaysInMonth = this.getHolidayInMonth(startMonth.AbsencesInMonth);
        holidaysSpentInInterval = holidaysSpentInInterval+numberOfHolidaysInMonth;
      }
      index++;
    }
    while(startMonth.MonthDate < currentMonth.MonthDate);

    return holidayAvailable-holidaysSpentInInterval;
  }

  /**
   * Calculates the remaining holidayFreedays available in the current month
   */
  getRemainingHolidayFreedays(){
    const months = this.holidayYear.Months;
    const holidayFreedaysAvailable = this.holidayYear.HolidayFreedayAvailable;
    let currentMonth = this.currentMonth;
    currentMonth.MonthDate.setHours(5,0,0,0);
    let index = 0;
    let holidayFreedaysSpentInInterval = 0;
    let startMonth;
    do{
      startMonth = months[index];
      startMonth.MonthDate.setHours(5,0,0,0);
      if(startMonth.AbsencesInMonth != null || startMonth.AbsencesInMonth > 0){
        let numberOfHolidaysInMonth = this.getHolidayFreedaysInMonth(startMonth.AbsencesInMonth);
        holidayFreedaysSpentInInterval = holidayFreedaysSpentInInterval+numberOfHolidaysInMonth;
      }
      index++;
    }
    while(startMonth.MonthDate < currentMonth.MonthDate);

    return holidayFreedaysAvailable-holidayFreedaysSpentInInterval;
  }

  //Ugly method refactor later for dynamic operation later
  getHolidayInMonth(absences: Absence[]){
    let numberOfHolidays = 0;
    let holidayStatus = this.statuses.find(x => x.StatusCode === 'F');
    let halfHolidayStatus = this.statuses.find(x => x.StatusCode === 'HF');
    for(let absence of absences){
      if(absence.Status.Id === holidayStatus.Id){
        numberOfHolidays++;
      }
      else if(absence.Status.Id === halfHolidayStatus.Id){
        numberOfHolidays = numberOfHolidays+0.5;
      }
    }
    return numberOfHolidays;
  }

  //Ugly method refactor later for dynamic operation later
  getHolidayFreedaysInMonth(absences: Absence[]){
    let numberOfHolidayFreedays = 0;
    let holidayFreedayStatus = this.statuses.find(x => x.StatusCode === 'FF');
    let halfHolidayFreedayStatus = this.statuses.find(x => x.StatusCode === 'HFF');
    for(let absence of absences){
      if(absence.Status.Id === holidayFreedayStatus.Id){
        numberOfHolidayFreedays++;
      }
      else if(absence.Status.Id === halfHolidayFreedayStatus.Id){
        numberOfHolidayFreedays = numberOfHolidayFreedays+0.5;
      }
    }
    return numberOfHolidayFreedays;
  }

  sortAbsence(){
    this.reset();
    for(let absence of this.currentMonth.AbsencesInMonth){
      this.addAbsenceToTable(absence.Status);
    }
  }
  //Ugly method refactor later for dynamic operation later
  addAbsenceToTable(status: Status){
    const halfADay = 0.5;
    switch(status.StatusCode){
      case 'S':
        this.sickness++;
        return;
      case 'HS':
        this.sickness+halfADay;
        return;
      case 'F':
        this.holiday++;
        return;
      case 'HF':
        this.holiday+halfADay;
        return;
      case 'FF':
        this.holidayFreedays++;
        return;
      case 'HFF':
        this.holidayFreedays+halfADay;
        return;
      case 'A':
        this.timeoff++;
        return;
      case 'HA':
        this.timeoff+halfADay;
        return;
      case 'B':
        this.maternity++;
        return;
      case 'BS':
        this.childsFirstSickness++;
        return;
      case 'K':
        this.course++;
        return;
      case 'SN':
        this.seniordays++;
        return;
      case 'AF':
        this.otherAbsence++;
        return;
    }
  }

  reset(){
    this.holiday = 0;
    this.holidayFreedays = 0;
    this.sickness = 0;
    this.timeoff = 0;
    this.maternity = 0;
    this.childsFirstSickness = 0;
    this.course = 0;
    this.seniordays = 0;
    this.otherAbsence = 0;
  }
}
