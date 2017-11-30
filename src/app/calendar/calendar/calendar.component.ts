import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/employee';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Absence} from '../../entities/absence';
import {AbsenceService} from '../../services/absence.service';
import DateTimeFormat = Intl.DateTimeFormat;
import {Status} from '../../entities/status.enum';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  employee: Employee;
  absenceDatesInEmployee: Date[];
  absencesInEmployee: Absence[];
  statusCode: Status;
  test: Absence;

  statusses: string[];
  employees: Employee[];
  currentMonth: Date;
  daysInCurrentMonth: Date[];
  weeksInCurrentMonth: number[];
  weekendDays: number[];
  daysBeforeIndex: number[];
  firstWeek: number[];
  secondWeek: number[];
  thirdWeek: number[];
  fourthWeek: number[];
  fifthWeek: number[];
  sixthWeek: number[];
  firstWeekDates: number[];
  secondWeekDates: number[];
  thirdWeekDates: number[];
  fourthWeekDates: number[];
  fifthWeekDates: number[];
  sixthWeekDates: number[];

  constructor(private formBuilder: FormBuilder, private employeeService: EmployeeService, private absenceService: AbsenceService) {
    this.initData();
    this.getAllDatesInMonth();
    this.employeeService.getById(9).subscribe(employee => {this.employee = employee,
      this.absencesInEmployee = this.employee.Absences, this.convertDatetimesToDate(),this.getAbsencesFor();});


  }

  ngOnInit() {

  }
  initData(){
    this.initArrays();
    this.populateCalendar();
    this.aTest();
  }

  getRole(id: number)
  {
    return EmployeeRole[id];
  }

  populateCalendar(){ //test Method
    this.getDates();
    this.daysInMonth();
    const firstDayOfMonth = this.daysInCurrentMonth[0].getDay();
    this.getWeeksInMonth(firstDayOfMonth);
  }


  getAbsencesFor(){
    const dateToAdd = this.absenceDatesInEmployee.find(abs => abs.getDate() === 30 &&
    abs.getMonth() === this.currentMonth.getMonth() && abs.getFullYear() === this.currentMonth.getFullYear());
    const indexOfDate = this.absenceDatesInEmployee.findIndex(x => x.getDate() === dateToAdd.getDate() &&
    x.getMonth() === this.currentMonth.getMonth() && x.getFullYear() === this.currentMonth.getFullYear());
  }

  setGetAbsence(week: number, index: number){
    const absence = this.getAbsenceValue(week, index);
    if(absence === 0){
      return '+';
    }
    if(absence === '+'){
      console.log('aaaaay');
      return 4;
    }
  }

  bTest(){
    this.test.Status = Status.A;
  }

  aTest(){
    const status = Status.SN;
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 10);
    const employee = this.employee;
    const absence = new Absence();
    absence.Date = date;
    absence.Employee = employee;
    absence.Status = status;
    this.test = absence;
  }

  getAbsenceValue(week: number, index: number){
    const absenceDate = this.convertToDate(week, index);
    if(absenceDate === null){
      return;
    }
    else
    {
      const dateToAdd = this.absenceDatesInEmployee.find(abs => abs.getDate() === absenceDate &&
      abs.getMonth() === this.currentMonth.getMonth() && abs.getFullYear() === this.currentMonth.getFullYear());
      if(dateToAdd != null){
        const indexOfAbsence = this.absenceDatesInEmployee.findIndex(x => x === dateToAdd);
        const dateInAbsence = this.absencesInEmployee[indexOfAbsence].Status;
        return this.getStatusCode(dateInAbsence);
      }
      else return 0;
    }
  }

  getStatusCode(id: number){
      switch(id){
        case 1:
          return Status[1];
        case 2:
          return Status[2];
        case 3:
          return Status[3];
        case 4:
          return Status[4];
        case 5:
          return Status[5];
        case 6:
          return Status[6];
        case 7:
          return Status[7];
        case 8:
          return Status[8];
        case 9:
          return Status[9];
        case 10:
          return Status[10];
        case 11:
          return Status[11];
        case 12:
          return Status[12];
        case 13:
          return Status[13];
      }
  }

  setStatusCode(id: number){
    switch(id){
      case 0:
        return;
      case 1:
        this.statusCode = Status.S;
      case 2:
        this.statusCode = Status.HS;
      case 3:
        this.statusCode = Status.F;
      case 4:
        this.statusCode = Status.HF;
      case 5:
        this.statusCode = Status.FF;
      case 6:
        this.statusCode = Status.HFF;
      case 7:
        this.statusCode = Status.K;
      case 8:
        this.statusCode = Status.B;
      case 9:
        this.statusCode = Status.BS;
      case 10:
        this.statusCode = Status.AF;
      case 11:
        this.statusCode = Status.A;
      case 12:
        this.statusCode = Status.HA;
      case 13:
        this.statusCode = Status.SN;
    }
  }

  setAbsence($event){
    $event.stopPropagation();
    return "test";

  }

  convertDatetimesToDate(){
    const employeeAbsences = this.employee.Absences;
    for(let absence of employeeAbsences){
      const absenceToAdd = absence.Date.toString();
      const date = new Date(Date.parse(absenceToAdd));
      this.absenceDatesInEmployee.push(date);
    }
  }

  saveAbsence(){

  }

  nextMonth($event){
    $event.stopPropagation();
    this.currentMonth.setMonth(this.currentMonth.getMonth()+1);
  }

  previousMonth($event){
    $event.stopPropagation();
    this.currentMonth.setMonth(this.currentMonth.getMonth()-1);
  }

  convertToDate(week: number, index: number,){
    const date = this.getDateNumbersForCalendar(week, index);
    if(date === -1)
    {
      return null;
    }
    else return date;
  }
  getDateNumbersForCalendar(week: number, index: number,){
    switch(week){
      case 0:
        return this.firstWeekDates[index].valueOf();
      case 1:
        return this.secondWeekDates[index].valueOf();
      case 2:
        return this.thirdWeekDates[index].valueOf();
      case 3:
        return this.fourthWeekDates[index].valueOf();
      case 4:
        return this.fifthWeekDates[index].valueOf();
      case 5:
        if(this.sixthWeekDates.length > 0){
          return this.sixthWeekDates[index];
        }
    }
  }

  getAllDatesInMonth(){
    const notDayInCurrentMonth = -1;
    const firstDayInMonth = 1;
    let index = firstDayInMonth;
    for(let day of this.firstWeek)
    {
      if(day != -1)
      {
        day = index;
        this.firstWeekDates.push(day);
        index++;
      }
      else
      {
        day = notDayInCurrentMonth;
        this.firstWeekDates.push(day);
      }
    }
    for(let day of this.secondWeek)
    {
      if(day != -1)
      {
        day = index;
        this.secondWeekDates.push(day);
        index++;
      }
      else
      {
        day = notDayInCurrentMonth;
        this.secondWeekDates.push(day);
      }
    }
    for(let day of this.thirdWeek)
    {
      if(day != -1)
      {
        day = index;
        this.thirdWeekDates.push(day);
        index++;
      }
      else
      {
        day = notDayInCurrentMonth;
        this.thirdWeekDates.push(day);
      }
    }
    for(let day of this.fourthWeek)
    {
      if(day != -1)
      {
        day = index;
        this.fourthWeekDates.push(day);
        index++;
      }
      else
      {
        day = notDayInCurrentMonth;
        this.fourthWeekDates.push(day);
      }
    }

    for(let day of this.fifthWeek)
    {
      if(day != -1)
      {
        day = index;
        this.fifthWeekDates.push(day);
        index++;
      }
      else
      {
        day = notDayInCurrentMonth;
        this.fifthWeekDates.push(day);
      }
    }
    if(this.sixthWeek.length > 0)
    {
      for(let day of this.sixthWeek)
      {
        if(day != -1)
        {
          day = index;
          this.sixthWeekDates.push(day);
          index++;
        }
        else
        {
          day = notDayInCurrentMonth;
          this.sixthWeekDates.push(day);
        }
      }

    }
  }

  getWeekList(id: number, day: number){
    switch(id){
      case 0:
        return this.getDayInWeek(this.firstWeek, day);
      case 1:
        return this.getDayInWeek(this.secondWeek, day);
      case 2:
        return this.getDayInWeek(this.thirdWeek, day);
      case 3:
        return this.getDayInWeek(this.fourthWeek, day);
      case 4:
        return this.getDayInWeek(this.fifthWeek, day);
      case 5:
        if(this.sixthWeek.length != 0)
        {
          return this.getDayInWeek(this.sixthWeek, day);
        }
    }
  }

  getDayInWeek(days: number[], day: number){
    return days[day].valueOf();
  }


    getWeeksInMonth(index: number){
      const week = 6; //A week consist of 7 days, representing Sunday - Saturday with the values of 0 - 6
      const firstWeekIndex = this.daysInCurrentMonth[0].getDay()
      const wholeWeekIndex = week - firstWeekIndex + 1;
      const secondWeekIndex = this.daysInCurrentMonth[wholeWeekIndex].getDay();
      const secondWholeWeekIndex = week + wholeWeekIndex + 1;
      const thirdWeekIndex = this.daysInCurrentMonth[secondWholeWeekIndex].getDay();
      const thirdWholeWeekIndex = week + secondWholeWeekIndex+ 1;
      const fourthWeekIndex = this.daysInCurrentMonth[thirdWholeWeekIndex].getDay();
      const fourthWholeWeekIndex = week + thirdWholeWeekIndex+ 1;
      const fifthWeekIndex = this.daysInCurrentMonth[fourthWholeWeekIndex].getDay();
      const fifthWholeWeekIndex = week + fourthWholeWeekIndex +1;
      const lastWholeFiveWeekIndex = this.daysInCurrentMonth.length - fourthWholeWeekIndex;
      //if there is 6 whole weeks in the current month
      if (this.daysInCurrentMonth.length > 30 && index > 3 || this.daysInCurrentMonth.length > 29 && index > 4)
      {
        const sixthWeekIndex = this.daysInCurrentMonth[fifthWholeWeekIndex].getDay();
        const lastWholeSixWeekIndex = this.daysInCurrentMonth.length - fifthWholeWeekIndex;
        for(var i = 0; i <= 5; i++)
        {
          this.weeksInCurrentMonth[i] = i;
        }
        if(firstWeekIndex != 0){
          for(var i = 0; i < firstWeekIndex; i++)
          {
            this.firstWeek[i] = -1;
          }
        }
        for(var i = firstWeekIndex; i <=week; i++){
          this.firstWeek[i] = i;
        }
        for(var i = secondWeekIndex; i <=week; i++)
        {
          this.secondWeek[i] = i;
        }
        for(var i = thirdWeekIndex; i <=week; i++)
        {
          this.thirdWeek[i] = i;
        }
        for(var i = fourthWeekIndex; i <=week; i++)
        {
          this.fourthWeek[i] = i;
        }
        for(var i = fifthWeekIndex; i <= week; i++){
          this.fifthWeek[i] = i;
        }
        if(sixthWeekIndex < lastWholeSixWeekIndex)
        {
          for(var i = sixthWeekIndex; i < lastWholeSixWeekIndex; i++)
          {
            this.sixthWeek[i] = i;
          }
        }
        if(lastWholeSixWeekIndex <= week)
        {
          for(var i = fifthWeekIndex + lastWholeSixWeekIndex; i <= fifthWeekIndex + week; i++)
          {
            this.sixthWeek[i] = -1;
          }
        }
      }
      //if there is only 5 whole weeks in the current month
      else
      {
        for(var i = 0; i <= 4; i++)
        {
          this.weeksInCurrentMonth[i] = i;
        }
        if(firstWeekIndex != 0)
        {
          for(var i = 0; i < firstWeekIndex; i++)
          {
            this.firstWeek[i] = -1;
          }
        }
        for(var i = firstWeekIndex; i <=week; i++)
        {
          this.firstWeek[i] = i;
        }
        for(var i = secondWeekIndex; i <=week; i++)
        {
          this.secondWeek[i] = i;
        }
        for(var i = thirdWeekIndex; i <=week; i++)
        {
          this.thirdWeek[i] = i;
        }
        for(var i = fourthWeekIndex; i <=week; i++)
        {
          this.fourthWeek[i] = i;
        }
        if(fifthWeekIndex < lastWholeFiveWeekIndex)
        {
          for(var i = fifthWeekIndex; i < lastWholeFiveWeekIndex; i++)
          {
            this.fifthWeek[i] = i;
          }
        }
        if(lastWholeFiveWeekIndex <= week)
        {
          for(var i = fourthWeekIndex+lastWholeFiveWeekIndex; i <= fourthWeekIndex+week; i++)
          {
            this.fifthWeek[i] = -1;
          }
        }

      }
  }



  getAbsenceOnDate(day: number, date: Date, absences: Absence[]){
    const dateToCreateAbsence = new Date(date.getFullYear(), date.getMonth(), day);
    return absences.find(x=> x.Date === dateToCreateAbsence);

  }

  isAdmin(){
      if (this.employee.EmployeeRole === EmployeeRole.Administrator)
      {
        return true;
      }
  }

  isDepartmentChief(){
    if (this.employee.EmployeeRole === EmployeeRole.Afdelingschef){
      return true;
    }

  }



  initArrays(){
    this.statusses = new Array();
    this.absencesInEmployee = new Array<Absence>();
    this.absenceDatesInEmployee = new Array<Date>();
    this.daysInCurrentMonth = new Array<Date>();
    this.weeksInCurrentMonth = new Array<number>();
    this.weekendDays = new Array<number>();
    this.daysBeforeIndex = new Array<number>();
    this.firstWeek = new Array<number>();
    this.secondWeek = new Array<number>();
    this.thirdWeek = new Array<number>();
    this.fourthWeek = new Array<number>();
    this.fifthWeek = new Array<number>();
    this.sixthWeek = new Array<number>();
    this.firstWeekDates = new Array<number>();
    this.secondWeekDates = new Array<number>();
    this.thirdWeekDates = new Array<number>();
    this.fourthWeekDates = new Array<number>();
    this.fifthWeekDates = new Array<number>();
    this.sixthWeekDates = new Array<number>();
    this.statusses =[
      'Slet',
      'S - Syg',
      'HS - ½sygedag',
      'F - Ferie',
      'HF - ½feriedag',
      'FF - Feriefridag',
      'HFF - ½Feriefridag',
      'K - Kursus',
      'B - Barsel',
      'BS - Barn 1. sygedag',
      'AF - Andet fravær',
      'A - Afspadsering',
      'HA - ½afspadsering',
      'SN - Seniordag'];
  }

  getDates(){
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    this.currentMonth = firstDay;

  }

  getCurrentMonth(){
    const monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
    const currentMonth = this.currentMonth.getMonth();
    return monthNames[currentMonth];
  }

  daysInMonth(){
    var year = this.currentMonth.getFullYear();
    var month = this.currentMonth.getMonth();
    var numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    var days = new Array();
    for(var i=0;i<=numOfDays;i++)
    {
      days[i] = new Date(year, month,i+1).getDay();
      this.daysInCurrentMonth.push(new Date(year, month,i+1));
    }

//This will give you a number from 0 - 6 which represents (Sunday - Saturday)

    for(var i=0; i<=numOfDays; i++)
    {
      this.getWeekday(days[i].valueOf());
    }
  }

  getDaysInMonth(year: number, month: number){
    switch(month){
      case 0:
        return 0;
      case 1:
        if(year === 2000 || 2004 || 2008 || 2012 || 2016 || 2020 || 2024 || 2028 || 2032 || 2036 || 2040 || 2044 || 2048 || 2052 || 2056 || 2060 || 2064 || 2068){
          return -4;
        }
        else {
          return -5;
        }
      case 2:
        return 0;
      case 3:
        return -2;
      case 4:
        return 0;
      case 5:
        return -2;
      case 6:
        return 0;
      case 7:
        return 0;
      case 8:
        return -2;
      case 9:
        return 0;
      case 10:
        return -2;
      case 11:
        return 0;

    }
  }

  getWeekday(id: number) {
    switch (id) {
      case 0:
        return "Søndag";
      case 1:
        return "Mandag";
      case 2:
        return "Tirsdag";
      case 3:
        return "Onsdag";
      case 4:
        return "Torsdag";
      case 5:
        return "Friday";
      case 6:
        return "Lørdag";
    }
  }
}
