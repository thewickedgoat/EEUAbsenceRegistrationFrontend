import {Component, Input, OnInit, OnChanges, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../../entities/Employee';
import {Month} from '../../../../entities/month';
import {Status} from '../../../../entities/status';

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
  holiday: number = 0;
  holidayFreedays: number = 0;
  timeoff: number = 0;
  maternity: number = 0;
  sickness: number = 0;
  course: number = 0;
  childsFirstSickness: number = 0;
  otherAbsence: number = 0;
  seniordays: number = 0;

  constructor() { }

  ngOnInit() {
    this.sortAbsence();
  }

  ngOnChanges(){
    this.sortAbsence();
  }

  sortAbsence(){
    this.reset();
    for(let absence of this.currentMonth.AbsencesInMonth){
      this.addAbsenceToTable(absence.Status);
    }
  }
  //grim metode, skal refaktoreres senere til at være mere dynamisk
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
