import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {EmployeeService} from '../../services/employee.service';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Absence} from '../../entities/absence';
import {AbsenceService} from '../../services/absence.service';
import DateTimeFormat = Intl.DateTimeFormat;
import {Status} from '../../entities/status.enum';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {AbsenceOverviewControllerComponent} from '../../absence/absence-overview/absence-overview-controller.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

  @ViewChild(AbsenceOverviewControllerComponent) absenceController: AbsenceOverviewControllerComponent;

  employee: Employee;
  loggedInUser: Employee;

  holidayYearStart: Date;
  holidayYearEnd: Date;

  isMonthApprovedByEmployee: boolean;
  isMonthApprovedByChief: boolean;
  isMonthApprovedByAdmin: boolean;

  absencesInEmployee: Absence[];
  statusCode: Status;

  statusses: string[];
  employees: Employee[];
  absencesToApprove: Absence[];
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
  statusList: Status[];

  constructor(private router: Router,
              private location: Location,
              private employeeService: EmployeeService,
              private absenceService: AbsenceService,
              private route: ActivatedRoute) {

  }

  ngOnInit() {
        this.route.paramMap.subscribe(params => {
          this.getDates(+params.get('year'), +params.get('month'));
          console.log(this.currentMonth);
          this.initData();
    });
  }
  initData(){
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.isAdmin();
    this.isChief();
    this.isEmployee();
    this.initArrays();
    this.populateCalendar();
    this.initStatusList();
    this.route.paramMap.switchMap(params => this.employeeService.getById(+params.get('id')))
      .subscribe(employee => {
        this.employee = employee;
        this.convertDatetimesToDate();
        this.getAllDatesInMonth();
        this.getHolidayYearStartAndEnd();
        this.absencesForApproval(employee);
        this.checkForApproval()
      });
  }

  updateAbsenceController(employee: Employee){
    if(!this.isMonthLocked()){
      const holidayYearStart = this.holidayYearStart;
      const holidayYearEnd = this.holidayYearEnd;
      this.absenceController.refresh(employee, holidayYearStart, holidayYearEnd);
    }

  }

  refreshCalendar()
  {
    console.log("Refreshing");
    this.employeeService.getById(this.employee.Id)
      .subscribe(employee => {
        console.log(employee);
          this.employee = employee;
        this.convertDatetimesToDate();
        this.getAllDatesInMonth();
        this.updateAbsenceController(employee);
        this.absencesForApproval(employee);
        this.checkForApproval()
      });
    console.log('Refreshed');
  }

  getEmployee(){
    return this.employee;
  }

  /**
   * Identifies which absences on the current employee to approve is in the current currentMonth
   */
  absencesForApproval(employee: Employee){
    this.absencesToApprove = [];
    const absences = employee.Absences;
    for(let absence of absences){
      if(absence.Date.getFullYear() === this.currentMonth.getFullYear() && absence.Date.getMonth() === this.currentMonth.getMonth()){
        this.absencesToApprove.push(absence);
      }
    }
  }

  /**
   * Checks if any sort of approval have already found place
   */
  checkForApproval(){
    this.isApprovedByEmployee();
    this.isApprovedByChief();
    this.isApprovedByAdmin();
  }


  /**
   * Checks if the current currentMonth already have been approved by the employee
   */
  isApprovedByEmployee(){
    const confirmedDates = [];
    const unconfirmedDates = [];
    for(let absence of this.absencesToApprove)
    {
      if(absence.IsLockedByEmployee === true && absence.Date.getFullYear() === this.currentMonth.getFullYear() && absence.Date.getMonth() === this.currentMonth.getMonth())
      {
        confirmedDates.push(absence);
      }
      else {
        unconfirmedDates.push(absence);
      }
    }
    if(unconfirmedDates.length > 0 || this.absencesToApprove.length === 0){
      this.isMonthApprovedByEmployee = false;
    }
    else {
      this.isMonthApprovedByEmployee = true;
    }
  }

  /**
   * Checks if the current currentMonth already have been approved by the departmentChief
   */
  isApprovedByChief(){
    const confirmedDates = [];
    const unconfirmedDates = [];
    for(let absence of this.absencesToApprove)
    {
      if(absence.IsLockedByChief === true && absence.Date.getFullYear() === this.currentMonth.getFullYear() && absence.Date.getMonth() === this.currentMonth.getMonth())
      {
        confirmedDates.push(absence);
      }
      else {
        unconfirmedDates.push(absence);
      }
    }
    if(unconfirmedDates.length > 0 || this.absencesToApprove.length === 0){
      this.isMonthApprovedByChief = false;
    }
    else {
      this.isMonthApprovedByChief = true;
    }
  }

  /**
   * Checks if the current currentMonth already have been approved by the admin
   */
  isApprovedByAdmin(){
    const confirmedDates = [];
    const unconfirmedDates = [];
    for(let absence of this.absencesToApprove)
    {
      if(absence.IsLockedByAdmin === true && absence.Date.getFullYear() === this.currentMonth.getFullYear() && absence.Date.getMonth() === this.currentMonth.getMonth())
      {
        confirmedDates.push(absence);
      }
      else {
        unconfirmedDates.push(absence);
      }
    }
    if(unconfirmedDates.length > 0  || this.absencesToApprove.length === 0){
      this.isMonthApprovedByAdmin = false;
    }
    else {
      this.isMonthApprovedByAdmin = true;
    }
  }

  /**
   * Approves all absences in the current month. If no absences exist in the current month, a single "empty" absence is created
   * instead and is then approved instead.
   */
  approveAbsencesInMonth(){
    const absencesToApprove = this.absencesToApprove;
    const loggedInEmployee = this.loggedInUser;
    if(absencesToApprove.length === 0){
      for(let day of this.daysInCurrentMonth){
        let date = new Date();
        date.setFullYear(this.currentMonth.getFullYear());
        date.setMonth(this.currentMonth.getMonth());
        date.setDate(day.getDate());
        if(loggedInEmployee.Id === this.employee.Id && !this.isChief())
        {
          let absence: Absence = {
            Employee: this.employee,
            Date: date,
            Status: Status.GRAY,
            IsLockedByEmployee: true,
            IsLockedByChief: false,
            IsLockedByAdmin: false
          }
          this.absenceService.post(absence).subscribe(abs => {
            this.refreshCalendar();
          });
        }
        else if(loggedInEmployee.EmployeeRole === EmployeeRole.Afdelingsleder
          && loggedInEmployee.Department.Id === this.employee.Department.Id){
          let absence: Absence = {
            Employee: this.employee,
            Date: date,
            Status: Status.GRAY,
            IsLockedByEmployee: true,
            IsLockedByChief: true,
            IsLockedByAdmin: false
          }
          this.absenceService.post(absence).subscribe(abs => {
            this.refreshCalendar();
          });
        }
        else if(loggedInEmployee.EmployeeRole === EmployeeRole.Administrator){
          let absence: Absence = {
            Employee: this.employee,
            Date: date,
            Status: Status.GRAY,
            IsLockedByEmployee: true,
            IsLockedByChief: true,
            IsLockedByAdmin: true
          }
          this.absenceService.post(absence).subscribe(abs => {
            this.refreshCalendar();
          });
        }
      }
    }
    else{
      setTimeout(() => {
        this.refreshCalendar();
      }, 1250);

    }
  }

  reopenMonth(){
    setTimeout(() => {
      this.refreshCalendar();
    }, 500);

  }

  /**
   * Checks if the current month is locked for editing, either because its already approved
   * or because the loggedInUser don't have have permissions to use edit it
   * @returns {boolean}
   */
  isMonthLocked(){
    const loggedInUser = this.loggedInUser;
    if(loggedInUser.Id === this.employee.Id && this.isMonthApprovedByEmployee === true
      || loggedInUser.Id === this.employee.Id && this.isMonthApprovedByChief === true
      || loggedInUser.Id === this.employee.Id && this.isMonthApprovedByAdmin === true){
      return true;

    }
    else if(loggedInUser.EmployeeRole === EmployeeRole.Afdelingsleder
      && loggedInUser.Department.Id === this.employee.Department.Id
      && this.isMonthApprovedByChief === true){
      return true;
    }
    else if(loggedInUser.EmployeeRole === EmployeeRole.Administrator && this.isMonthApprovedByAdmin === true)
    {
      return true;
    }
    else if(loggedInUser.Department.Id != this.employee.Department.Id && this.isChief()){
      return true;
    }
    else if(loggedInUser.EmployeeRole === EmployeeRole.Administrator && this.isMonthApprovedByAdmin === false){
      return false;
    }
    else if(this.isEmployee() && loggedInUser.Id != this.employee.Id)
    {
      return true;
    }
    else return false;
  }

  /**
   * return the employeeRoles enum value on the given Id
   * @param id
   * @returns {any}
   */
  getRole(id: number)
  {
    return EmployeeRole[id];
  }

  /**
   * Goes back to the last page you visited
   */
  back(){
    this.location.back();
  }

  /**
   * A method for running the basic assembly of the calendar
   */
  populateCalendar(){
    this.daysInMonth();
    const firstDayOfMonth = this.daysInCurrentMonth[0].getDay();
    this.getWeeksInMonth(firstDayOfMonth);
  }

  /**
   * Gets the status ment for the absence statusses that will be shown on the calendar
   * @param week
   * @param day
   * @returns {any}
   */
  getStatusForDate(week: number, day: number)
  {
    let currentDate = this.convertToDate(week, day);
    let absence = this.absencesInEmployee.find(x => x.Date.toDateString() === currentDate.toDateString());
    if(absence != null)
    {
      if(absence.Status === Status.GRAY){
        return '+';
      }
      else{
        return Status[this.statusList[absence.Status]];
      }
    }
    else {
      return '+';
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
    let currentDate = this.convertToDate(week, day);
    if(currentDate != null)
    {
      let currentAbsence = this.absencesInEmployee.find(x => x.Date.toDateString() === currentDate.toDateString());
      if(this.statusCode != null){

        if(currentAbsence != null)
        {
          currentAbsence.Status = this.statusCode;
          this.absenceService.put(currentAbsence).subscribe(() => this.refreshCalendar());
        }
        else{
          currentAbsence = ({Date: currentDate, Employee: this.employee, Status: this.statusCode});
          //this.absencesInEmployee.push(currentAbsence);
          this.absenceService.post(currentAbsence).subscribe(() => this.refreshCalendar());
        }
      }
      else {
        if(currentAbsence != null){
          this.absenceService.delete(currentAbsence.Id).subscribe(() => {
            this.refreshCalendar();
          }
          )
        }
      }
    }
  }

  initStatusList(){
    this.statusList = [
      Status.S,
      Status.HS,
      Status.F,
      Status.HF,
      Status.FF,
      Status.HFF,
      Status.K,
      Status.B,
      Status.BS,
      Status.AF,
      Status.A,
      Status.HA,
      Status.SN
    ]
  }

  /**
   * Sets the status code when selecting an option in the radiobutton div
   * @param status
   */
  setStatusCode(status: any){
    if(status === 'slet'){
      this.statusCode = null;
    }
    else
    {
        this.statusCode = status;
    }
  }

  /**
   * The Date() object in typescript does not play well with the restAPI's date format.
   * Converts the absence dates in the current employee one by one.
   */
  convertDatetimesToDate(){
    if(this.employee.Absences != null){
      this.absencesInEmployee = this.employee.Absences;
      for(let absence of this.employee.Absences){
        const absenceToAdd = absence.Date.toString();
        const date = new Date(Date.parse(absenceToAdd));
        absence.Date = date;
      }
    }

  }

  /**
   * Navigates to the next month
   * @param $event
   */
  nextMonth($event){
    let year = this.currentMonth.getFullYear();
    let month = this.currentMonth.getMonth()+1;
    this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + year + '/' + month);
    $event.stopPropagation();

  }

  /**
   * Navigates to the previous month
   * @param $event
   */
  previousMonth($event){
    let year = this.currentMonth.getFullYear();
    let month = this.currentMonth.getMonth()-1;
    this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + year + '/' + month);
    $event.stopPropagation();
  }

  /**
   * Gets a date number fx 30 for a date, and places it in the calendar on the given day.
   * If the date is emplty " " - then it will be blank, meaning it isn't a value in this month
   * @param week
   * @param index
   * @returns {any}
   */
  convertToDate(week: number, index: number,){
    const day = this.getDateNumbersForCalendar(week, index);
    if(day != " "){
      let date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      if(day === -1)
      {
        return null;
      }
      else return date;
    }
  }

  /**
   * Gets the exact date value from each weekList.
   * If the date is -1 it means its not a day in this month, and therefore returns blank
   * @param week
   * @param index
   * @returns {any}
   */
  getDateNumbersForCalendar(week: number, index: number,){
    switch(week){
      case 0:
        if(this.firstWeekDates.length > 0){
          if(this.firstWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.firstWeekDates[index].valueOf();
          }
        }
      case 1:
        if(this.secondWeekDates.length > 0){
          if(this.secondWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.secondWeekDates[index].valueOf();
          }
        }
      case 2:
        if(this.thirdWeekDates.length > 0){
          if(this.thirdWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.thirdWeekDates[index].valueOf();
          }
        }
      case 3:
        if(this.fourthWeekDates.length > 0){
          if(this.fourthWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.fourthWeekDates[index].valueOf();
          }
        }
      case 4:
        if(this.fifthWeekDates.length > 0){
          if(this.fifthWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.fifthWeekDates[index].valueOf();
          }
        }
      case 5:
        if(this.sixthWeekDates.length > 0){
          if(this.sixthWeekDates[index].valueOf() === -1)
          {
            return " ";
          }
          else{
            return this.sixthWeekDates[index].valueOf();
          }
        }
    }
  }

  /**
   * Sorts all dates into their respective weeks they fit into
   */
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

  /**
   * based on the day of the week it wii return the weekList in the current week the calendar is building
   * @param id
   * @param day
   * @returns {number}
   */
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
   * Calculates how many weeks there is in the current month, and then pushes the days into the weeks
   * @param index
   */
    getWeeksInMonth(index: number){
      const week = 6; //A week consists of 7 days, representing Sunday - Saturday with the values of 0 - 6
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
      const weeksInCurrentMonthTemp =  new Array<number>();
      //if there is 6 whole weeks in the current currentMonth
      if (this.daysInCurrentMonth.length > 30 && index > 4 || this.daysInCurrentMonth.length > 29 && index > 5)
      {
        const sixthWeekIndex = this.daysInCurrentMonth[fifthWholeWeekIndex].getDay();
        const lastWholeSixWeekIndex = this.daysInCurrentMonth.length - fifthWholeWeekIndex;
        for(var i = 0; i <= 5; i++)
        {
          weeksInCurrentMonthTemp[i] = i;
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
      //if there is only 5 whole weeks in the current currentMonth
      else
      {
        for(var i = 0; i <= 4; i++)
        {
          weeksInCurrentMonthTemp[i] = i;
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
      this.weeksInCurrentMonth = weeksInCurrentMonthTemp;
  }

  /**
   * Inits all arrays
   */
  initArrays(){
    this.statusses = new Array();
    this.absencesInEmployee = new Array<Absence>();
    this.daysInCurrentMonth = new Array<Date>();
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
    this.statusList = new Array<Status>();
    this.statusses =[
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
      'SN - Seniordag',
      'Slet'];
  }

  /**
   * finds the date of the current month
   * @param year
   * @param month
   */
  getDates(year: number, month: number){
    const firstDay = new Date(year, month, 1);
    this.currentMonth = firstDay;

  }

  /**
   * calculates how many days are in the current month
   */
  daysInMonth(){
    let year = this.currentMonth.getFullYear();
    let month = this.currentMonth.getMonth();
    let numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    let days = new Array();
    for(let i=0;i<=numOfDays;i++)
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

  /**
   * Supporting method for this.daysInMonth()
   * @param year
   * @param month
   * @returns {number}
   */
  getDaysInMonth(year: number, month: number){
    let date = new Date(year, month +1, 0);
    date.setDate(date.getDate() - 1);
    return date.getDate();
  }

  /**
   * Used for building the calendar
   * @param id
   * @returns {any}
   */
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


  /**
   * Checks for admin rights
   * @returns {boolean}
   */
  isAdmin() {
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else {
      return false;
    }

  }

  /**
   * checks for DepartmentChief priviledge
   * @returns {boolean}
   */
  isChief(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Afdelingsleder){
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Checks if you are an employee
   * @returns {boolean}
   */
  isEmployee(){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Medarbejder){
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Calcualtes when the holidayYear starts and ends
   */
  getHolidayYearStartAndEnd() {

    let currentDate = new Date();
    currentDate.setFullYear(this.currentMonth.getFullYear());
    currentDate.setMonth(this.currentMonth.getMonth());

    const may = 4;
    const april = 3;
    const firstDayOfMay = 1;
    const lastDayOfApril = 30;

    if(currentDate.getMonth() >= may){
      let holidayYearStart = new Date(
        currentDate.getFullYear(),
        may,
        firstDayOfMay);
      let holidayYearEnd = new Date(
        currentDate.getFullYear()+1,
        april,
        lastDayOfApril);
      this.holidayYearStart = holidayYearStart;
      this.holidayYearEnd = holidayYearEnd;
    }
    else if(currentDate.getMonth() <= april){
      let holidayYearStart = new Date(
        currentDate.getFullYear()-1,
        may,
        firstDayOfMay);
      let holidayYearEnd = new Date(
        currentDate.getFullYear(),
        april,
        lastDayOfApril);
      this.holidayYearStart = holidayYearStart;
      this.holidayYearEnd = holidayYearEnd;

    }
  }
}
