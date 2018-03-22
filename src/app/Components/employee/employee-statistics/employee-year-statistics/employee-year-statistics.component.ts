import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../../entities/Employee';
import {Status} from '../../../../entities/status';
import {HolidayYear} from '../../../../entities/HolidayYear';

@Component({
  selector: 'app-employee-year-statistics',
  templateUrl: './employee-year-statistics.component.html',
  styleUrls: ['./employee-year-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeYearStatisticsComponent implements OnInit {

  @Input()
  employee: Employee;
  @Input()
  currentHolidayYear: HolidayYear;
  @Input()
  statuses: Status[];
  holiday: number = 0;
  holidayFreedays: number = 0;
  timeoff: number = 0;
  maternity: number = 0;
  sickness: number = 0;
  course: number = 0;
  childsFirstSickness: number = 0;
  otherAbsence: number = 0;
  seniordays: number = 0;
  holidayTransfered: number = 0;
  holidayAvailable: number = 0;
  holidayFreedaysAvailable: number = 0;
  holidayLeft: number = 0;
  holidayFreedaysLeft: number = 0;

  constructor() { }

  ngOnInit() {
    this.sortAbsences();
    this.initHolidayLists();
  }

  sortAbsences(){
    this.reset();
    const holidayYear = this.currentHolidayYear;
    for(let month of holidayYear.Months){
      for(let absencse of month.AbsencesInMonth){
        this.addAbsenceToTable(absencse.Status)
      }
    }

  }

  initHolidayLists(){
    const holidayYear = this.currentHolidayYear;
    this.holidayTransfered = holidayYear.HolidayTransfered;
    this.holidayAvailable = holidayYear.HolidayAvailable;
    this.holidayLeft = holidayYear.HolidayAvailable-holidayYear.HolidaysUsed;
    this.holidayFreedaysAvailable = holidayYear.HolidayFreedayAvailable;
    this.holidayFreedaysLeft = holidayYear.HolidayFreedayAvailable-holidayYear.HolidayFreedaysUsed;
  }

  //grim metode, skal refaktoreres senere til at være mere dynamisk
  addAbsenceToTable(status: Status){
    const halfADay = 0.5;
    switch(status.StatusCode){
      case 'S':
        this.sickness++;
        return;
      case 'HS':
        this.sickness = this.sickness+halfADay;
        return;
      case 'F':
        this.holiday++;
        return;
      case 'HF':
        this.holiday = this.holiday+halfADay;
        return;
      case 'FF':
        this.holidayFreedays++;
        return;
      case 'HFF':
        this.holidayFreedays = this.holidayFreedays+halfADay;
        return;
      case 'A':
        this.timeoff++;
        return;
      case 'HA':
        this.timeoff = this.timeoff+halfADay;
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
