import {Component, OnInit, OnChanges, ViewChild, ViewEncapsulation, NgZone} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {EmployeeService} from '../../../services/employee.service';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Absence} from '../../../entities/absence';
import {AbsenceService} from '../../../services/absence.service';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {AbsenceOverviewControllerComponent} from '../../absence-overview/absence-overview-controller.component';
import {Location} from '@angular/common';
import {Month} from '../../../entities/month';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Status} from '../../../entities/status';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {MonthService} from '../../../services/month.service';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

  @ViewChild(AbsenceOverviewControllerComponent) absenceController: AbsenceOverviewControllerComponent;

  employee: Employee;
  loggedInUser: Employee;
  vacationLimitReached: boolean = false;
  vacationLimitReachedError: boolean = false;

  status: Status;

  isEmployee: boolean;
  isDepartmentChief: boolean;
  isCEO: boolean;
  isAdmin: boolean;
  isMonthLocked: boolean;

  lastMonthInHolidayYear: boolean;
  firstMonthInHolidayYear: boolean;

  currentHolidayYearSpec: HolidayYearSpec;
  currentHolidayYear: HolidayYear;
  currentMonth: Month;
  currentDate: Date;
  daysInCurrentMonth: Date[];
  amountOfWeeksInCurrentMonth: number[];
  weekendDays: number[];
  daysBeforeIndex: number[];
  weeks: any[];
  datesInWeeks: any[];
  absencesInCurrentMonth: Absence[] = [];

  constructor(private router: Router,
              private location: Location,
              private holidayYearService: HolidayyearService,
              private holidayYearSpecSerivce: HolidayYearSpecService,
              private monthService: MonthService,
              private employeeService: EmployeeService,
              private absenceService: AbsenceService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    //call back hell - aaaaaaaahhhhhhhhh
        this.route.paramMap.subscribe(params => {
          this.employeeService.getById(+params.get('id')).subscribe( employee => {
            this.employee = employee;
            this.currentDate = this.getCurrentDate(+params.get('year'), +params.get('month'));
            this.getHolidayYear();
          });

    });
  }

  getHolidayYear(){
    let holidayYearsSpecs = [];
    console.log('1');
    this.holidayYearSpecSerivce.getAll().subscribe( specs => {
      if(specs != null){
        for(let holidayYearSpec of specs){
          const startDateToParse = holidayYearSpec.StartDate.toString();
          const endDateToParse = holidayYearSpec.EndDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          const endDate = new Date(Date.parse(endDateToParse));
          holidayYearSpec.StartDate = startDate;
          holidayYearSpec.EndDate = endDate;
        }
      }
      holidayYearsSpecs = specs;
      if(holidayYearsSpecs != null){
        const currentHolidayYearSpec = holidayYearsSpecs.find(x => x.StartDate <= this.currentDate && x.EndDate >= this.currentDate);
        if(currentHolidayYearSpec != null){
          this.currentHolidayYearSpec = currentHolidayYearSpec;
          console.log('2');
          console.log(currentHolidayYearSpec);
          console.log(this.employee);
          const currentHolidayYear = this.employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === currentHolidayYearSpec.Id);
          console.log(currentHolidayYear);
          this.currentHolidayYear = currentHolidayYear;
          this.getCurrentMonth(this.currentDate.getMonth());
          this.initData();
        }
      }
    });
  }

  initData(){
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.initArrays();
    this.populateCalendar();
    this.getAllDatesInMonth();
    this.formatAbsencesInCurrentMonth()
    this.validateApprovalPermissions();
    this.checkForApprovalPermission();
    this.withinHolidayYearInterval();
  }

  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  setStatus(status){
    this.status = status;
  }

  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  getCurrentMonth(month: number){
    let months = this.currentHolidayYear.Months;
    if(months != null){
      for(let month of months){
        const monthDateToParse = month.MonthDate.toString();
        const monthDate = new Date(Date.parse(monthDateToParse));
        month.MonthDate = monthDate;
      }
    }
    //Ugly cheat - need to re-reference some Employee include relations upon loading
    let currentMonth = months.find(x => x.MonthDate.getMonth() === month);
    this.currentMonth = currentMonth;
  }

  getCurrentDate(year: number, month: number){
    let currentDate = new Date();
    currentDate.setFullYear(year);
    currentDate.setMonth(month);
    return currentDate;
  }

  /**
   * Navigates to the next month
   * @param $event
   */
  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  nextMonth($event){
    let december = 11;
    const currentMonth = this.currentMonth.MonthDate.getMonth();
    if(currentMonth < december){
      let year = this.currentMonth.MonthDate.getFullYear();
      let month = this.currentMonth.MonthDate.getMonth()+1;
      this.router.navigate(['calendar/' + this.employee.Id + '/' + year + '/' + month]);
    }
    else if(currentMonth === december){
      let year = this.currentMonth.MonthDate.getFullYear()+1;
      let month = 0;
      this.router.navigate(['calendar/' + this.employee.Id + '/' + year + '/' + month]);
    }

  }

  /**
   * Navigates to the previous month
   * @param $event
   */
  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  previousMonth($event){
    let january = 0;
    const currentMonth = this.currentMonth.MonthDate.getMonth();
    if(currentMonth > january){
      let year = this.currentMonth.MonthDate.getFullYear();
      let month = this.currentMonth.MonthDate.getMonth()-1;
      this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + year + '/' + month);
    }
    else if(currentMonth === january){
      let year = this.currentMonth.MonthDate.getFullYear()-1;
      let month = 11;
      this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + year + '/' + month);
    }
  }

  refreshCalendar()
  {
    this.initData();
  }

  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  checkForApprovalPermission(){
    if(this.isEmployee && this.currentMonth.IsLockedByEmployee === true
      || this.isCEO && this.currentMonth.IsLockedByCEO === true
      || this.isDepartmentChief && this.currentMonth.IsLockedByChief === true
      || this.isAdmin && this.currentMonth.IsLockedByAdmin === true){
      this.isMonthLocked = true;
    }
    else if(!this.isDepartmentChief && !this.isCEO && !this.isEmployee && !this.isAdmin){
      this.isMonthLocked = true;
    }
    else{
      this.isMonthLocked = false;
    }
  }
  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  reloadHolidayYearAndMonth(){
    this.holidayYearService.getById(this.currentHolidayYear.Id).subscribe(holiday => {
      if(holiday != null){
        this.currentHolidayYear = holiday;
        let currentMonth = this.currentHolidayYear.Months.find(x => x.Id === this.currentMonth.Id);
          if(currentMonth != null){
            const dateToParse = currentMonth.MonthDate.toString();
            const monthDate = new Date(Date.parse(dateToParse));
            currentMonth.MonthDate = monthDate;
            this.currentMonth = currentMonth;
          }
      }
      this.initData();
    });
  }

  //skal flyttes til controlleren
  //nærmest identisk med delete - refaktor senere
  updateHoliday(absence: Absence){
    let holidayYear = this.currentHolidayYear;
    const absenceStatus = absence.Status.StatusCode;
    const statusCode = this.status.StatusCode;
    const holidaysUsed = holidayYear.HolidaysUsed;
    const holidayFreedaysUsed = holidayYear.HolidayFreedaysUsed;
    if(this.isHolidayFreedaysAboutToHitLimit(statusCode, absenceStatus, holidayFreedaysUsed) ||
      this.isHolidayAboutToHitLimit(statusCode, absenceStatus, holidaysUsed)){
      this.error();
      return;

    }
    else{
      this.deleteHoliday(absence);
      absence.Status = this.status;
      this.addHoliday(absence);
    }
  }

  //skal flyttes til controlleren
  addHoliday(absence: Absence){
    let holidayYear = this.currentHolidayYear;
    const status = absence.Status.StatusCode;
    const holidayUsed = holidayYear.HolidaysUsed;
    const holidayFreedaysUsed = holidayYear.HolidayFreedaysUsed;
    const halfDay = 0.5;
    const wholeDay = 1;
    let holidaySpent;
    let holidayFreedaysSpent;
    if(status === 'F'){
      holidaySpent = holidayUsed+wholeDay;
      if(this.vacationLimitHit(holidaySpent, null)){
        this.error();
        return;
      }
      holidayYear.HolidaysUsed = holidaySpent;
    }
    if(status === 'FF'){
      holidayFreedaysSpent = holidayFreedaysUsed+wholeDay;
      if(this.vacationLimitHit(null, holidayFreedaysSpent)){
        this.error();
        return;
      }
      holidayYear.HolidayFreedaysUsed = holidayFreedaysSpent;
    }
    if(status === 'HF'){
      let holidaySpent = holidayUsed+halfDay;
      if(this.vacationLimitHit(holidaySpent, null)){
        this.error();
        return;
      }
      holidayYear.HolidaysUsed = holidaySpent;
    }
    if(status === 'HFF'){
      let holidayFreedaysSpent = holidayFreedaysUsed+halfDay;
      if(this.vacationLimitHit(null, holidayFreedaysSpent)){
      this.error();
        return;
      }
      holidayYear.HolidayFreedaysUsed = holidayFreedaysSpent;
    }
    this.vacationLimitReached = false;
    this.holidayYearService.put(holidayYear).subscribe(() => {});
  }

  //skal flyttes til controlleren
  deleteHoliday(absence: Absence){
    let holidayYear = this.currentHolidayYear;
    const status = absence.Status.StatusCode;
    const vacationDaysUsed = holidayYear.HolidaysUsed;
    const vacationfreedays = holidayYear.HolidayFreedaysUsed;
    const halfDay = 0.5;
    const wholeDay = 1;
    if(status === 'F'){
      holidayYear.HolidaysUsed = vacationDaysUsed-wholeDay;
    }
    if(status === 'FF'){
      holidayYear.HolidayFreedaysUsed = vacationfreedays-wholeDay;
    }
    if(status === 'HF'){
      holidayYear.HolidaysUsed = vacationDaysUsed-halfDay;
    }
    if(status === 'HFF'){
      holidayYear.HolidayFreedaysUsed = vacationfreedays-halfDay;
    }
    this.holidayYearService.put(holidayYear).subscribe(() => {});
  }

  getEmployeeRole(employeeRole: number){
    return EmployeeRole[employeeRole];
  }
  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  withinHolidayYearInterval(){
    const april = 3;
    const may = 4;
    if(this.currentMonth.MonthDate.getMonth() === april){
      this.lastMonthInHolidayYear = true;
      this.firstMonthInHolidayYear = false;
    }
    else if(this.currentMonth.MonthDate.getMonth() === may){
      this.lastMonthInHolidayYear = false;
      this.firstMonthInHolidayYear = true;
    }
    else{
      this.lastMonthInHolidayYear = false;
      this.firstMonthInHolidayYear = false;
    }
  }

  /**
   * Goes back to the last page you visited
   */
  //skal flyttes til controlleren for alle componenterne i kalender-viewet
  back(){
    this.router.navigateByUrl('overview/' + this.employee.Id);
  }

  /**
   * A method for running the basic assembly of the calendar
   */
  populateCalendar(){
    this.daysInMonth();
    const firstDayOfMonth = this.daysInCurrentMonth[0].getDay();
    this.getWeeksInMonth(firstDayOfMonth);
  }

  //skal flyttes til kalender controller - når den engang bliver lavet....
  validateApprovalPermissions(){
    this.isAdmin = false;
    this.isCEO = false;
    this.isDepartmentChief = false;
    this.isEmployee = false;
    const loggedInEmployee = this.loggedInUser;
    if(loggedInEmployee.Id === this.employee.Id && loggedInEmployee.EmployeeRole != EmployeeRole.Afdelingsleder
      || loggedInEmployee.Id === this.employee.Id && loggedInEmployee.EmployeeRole != EmployeeRole.Direktør){
      this.isEmployee = true;
    }
    if(loggedInEmployee.Id === this.employee.Id && loggedInEmployee.EmployeeRole === EmployeeRole.Afdelingsleder){
      this.isEmployee = true;
      this.isDepartmentChief = true;
    }
    if(loggedInEmployee.EmployeeRole === EmployeeRole.Afdelingsleder
      && loggedInEmployee.Id != this.employee.Id
      && this.employee.Department.Id === loggedInEmployee.Department.Id){
      this.isDepartmentChief = true;
    }
    if(loggedInEmployee.EmployeeRole === EmployeeRole.Direktør && loggedInEmployee.Id === this.employee.Id){
      this.isEmployee = true;
      this.isCEO = true;
    }
    if(loggedInEmployee.EmployeeRole === EmployeeRole.Direktør && this.employee.EmployeeRole === EmployeeRole.Afdelingsleder){
      this.isCEO = true;
    }
    if(loggedInEmployee.EmployeeRole === EmployeeRole.Administrator){
      this.isAdmin = true;
    }
  }

  /**
   * Sorts all dates into their respective weeks they fit into
   */
  getAllDatesInMonth(){
    const notDayInCurrentMonth = -1;
    const firstDayInMonth = 1;
    let datesInWeeks = new Array<any>();
    let index = firstDayInMonth;
    for(let week of this.weeks)
    {
      let currentWeek = new Array<number>();
      for(let day of week){

        if(day != -1)
        {
          day = index;
          currentWeek.push(day);
          index++;
        }
        else
        {
          day = notDayInCurrentMonth;
          currentWeek.push(day);
        }

      }
      datesInWeeks.push(currentWeek);
    }
    this.datesInWeeks = datesInWeeks;
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
      const amountOfWeeksInCurrentMonth =  new Array<number>();
      let firstWeek = new Array<number>();
      let secondWeek = new Array<number>();
      let thirdWeek = new Array<number>();
      let fourthWeek = new Array<number>();
      let fifthWeek = new Array<number>();
      let sixthWeek = new Array<number>();
      //if there is 6 whole weeks in the current currentMonth
      if (this.daysInCurrentMonth.length > 30 && index > 4 || this.daysInCurrentMonth.length > 29 && index > 5)
      {
        const sixthWeekIndex = this.daysInCurrentMonth[fifthWholeWeekIndex].getDay();
        const lastWholeSixWeekIndex = this.daysInCurrentMonth.length - fifthWholeWeekIndex;
        for(var i = 0; i <= 5; i++)
        {
          amountOfWeeksInCurrentMonth[i] = i;
        }
        if(firstWeekIndex != 0){
          for(var i = 0; i < firstWeekIndex; i++)
          {

            firstWeek[i] = -1;
          }
        }
        for(var i = firstWeekIndex; i <=week; i++){
          firstWeek[i] = i;
        }
        for(var i = secondWeekIndex; i <=week; i++)
        {
          secondWeek[i] = i;
        }
        for(var i = thirdWeekIndex; i <=week; i++)
        {
          thirdWeek[i] = i;
        }
        for(var i = fourthWeekIndex; i <=week; i++)
        {
          fourthWeek[i] = i;
        }
        for(var i = fifthWeekIndex; i <= week; i++){
          fifthWeek[i] = i;
        }
        if(sixthWeekIndex < lastWholeSixWeekIndex)
        {
          for(var i = sixthWeekIndex; i < lastWholeSixWeekIndex; i++)
          {
            sixthWeek[i] = i;
          }
        }
        if(lastWholeSixWeekIndex <= week)
        {
          for(var i = fifthWeekIndex + lastWholeSixWeekIndex; i <= fifthWeekIndex + week; i++)
          {
            sixthWeek[i] = -1;
          }
        }
        this.weeks.push(firstWeek);
        this.weeks.push(secondWeek);
        this.weeks.push(thirdWeek);
        this.weeks.push(fourthWeek);
        this.weeks.push(fifthWeek);
        this.weeks.push(sixthWeek);
      }
      //if there is only 5 whole weeks in the current currentMonth
      else
      {
        for(var i = 0; i <= 4; i++)
        {
          amountOfWeeksInCurrentMonth[i] = i;
        }
        if(firstWeekIndex != 0)
        {
          for(var i = 0; i < firstWeekIndex; i++)
          {
            firstWeek[i] = -1;
          }
        }
        for(var i = firstWeekIndex; i <=week; i++)
        {
          firstWeek[i] = i;
        }
        for(var i = secondWeekIndex; i <=week; i++)
        {
          secondWeek[i] = i;
        }
        for(var i = thirdWeekIndex; i <=week; i++)
        {
          thirdWeek[i] = i;
        }
        for(var i = fourthWeekIndex; i <=week; i++)
        {
          fourthWeek[i] = i;
        }
        if(fifthWeekIndex < lastWholeFiveWeekIndex)
        {
          for(var i = fifthWeekIndex; i < lastWholeFiveWeekIndex; i++)
          {
            fifthWeek[i] = i;
          }
        }
        if(lastWholeFiveWeekIndex <= week)
        {
          for(var i = fourthWeekIndex+lastWholeFiveWeekIndex; i <= fourthWeekIndex+week; i++)
          {
            fifthWeek[i] = -1;
          }
        }
        this.weeks.push(firstWeek);
        this.weeks.push(secondWeek);
        this.weeks.push(thirdWeek);
        this.weeks.push(fourthWeek);
        this.weeks.push(fifthWeek);
      }

      this.amountOfWeeksInCurrentMonth = amountOfWeeksInCurrentMonth;
  }

  /**
   * Inits all arrays
   */
  initArrays(){
    this.daysInCurrentMonth = new Array<Date>();
    this.weekendDays = new Array<number>();
    this.daysBeforeIndex = new Array<number>();
    this.weeks = new Array<any>();
    this.datesInWeeks = new Array<any>();
    }

  /**
   * calculates how many days are in the current month
   */
  daysInMonth(){
    let year = this.currentMonth.MonthDate.getFullYear();
    let month = this.currentMonth.MonthDate.getMonth();
    let numOfDays = new Date(year, month, this.getDaysInMonth(year, month)).getDate();
    let days = new Array();
    for(let i=0;i<=numOfDays;i++)
    {
      days[i] = new Date(year, month,i+1).getDay();
      this.daysInCurrentMonth.push(new Date(year, month,i+1));
    }

//This will give you a number from 0 - 6 which represents (Sunday - Saturday)

    //for(var i=0; i<=numOfDays; i++)
    //{
      //this.getWeekday(days[i].valueOf());
    //}
  }

  /**
   * Supporting method for this.daysInMonth()
   * @param year
   * @param month
   * @returns {number}
   */
  //Skal flyttes til calender controlleren
  getDaysInMonth(year: number, month: number){
    let date = new Date(year, month +1, 0);
    date.setDate(date.getDate() - 1);
    return date.getDate();
  }

  /**
   * The Date() object in typescript does not play well with the restAPI's date format.
   * Converts the absence dates in the current employee one by one.
   */
  formatAbsencesInCurrentMonth(){
    if(this.currentMonth.AbsencesInMonth != null){
      this.absencesInCurrentMonth = this.currentMonth.AbsencesInMonth;
      for(let absence of this.absencesInCurrentMonth){
        const absenceToAdd = absence.Date.toString();
        const date = new Date(Date.parse(absenceToAdd));
        absence.Date = date;
      }
    }
  }

  vacationLimitHit(holidayUsed?: number, holidayFreedaysUsed?: number){
    const holidayYear = this.currentHolidayYear;
    let holidayLeft = holidayYear.HolidayAvailable;
    let holidayFreedaysLeft = holidayYear.HolidayFreedayAvailable;
    if(holidayLeft != null && holidayLeft < holidayUsed){
      return true;
    }
    if(holidayFreedaysLeft != null && holidayFreedaysLeft < holidayFreedaysUsed){
      return true;
    }
    else return false;
  }

  isHolidayAboutToHitLimit(statusCode: string, absenceStatus: string, holidayUsed: number){
    const holidayYear = this.currentHolidayYear;
    let remainingHoliday = holidayYear.HolidayAvailable-holidayUsed;
    if(absenceStatus === 'F' && statusCode === 'HF'){
      return false;
    }
    else if(absenceStatus != 'F' && statusCode ==='HF' && remainingHoliday < 0.5){
      return true;
    }
    else if(absenceStatus === 'HF' && statusCode === 'F' && remainingHoliday < 0.5){
      return true;
    }
    else if(absenceStatus != 'HF' && statusCode ==='F' && remainingHoliday < 1){
      return true;
    }
    else return false;
  }

  isHolidayFreedaysAboutToHitLimit(statusCode: string, absenceStatus: string, holidayFreedaysUsed: number){
    const holidayYear = this.currentHolidayYear;
    let remainingHoliday = holidayYear.HolidayFreedayAvailable-holidayFreedaysUsed;
    if(absenceStatus === 'FF' && statusCode === 'HFF'){
      return false;
    }
    else if(absenceStatus != 'FF' && statusCode ==='HFF' && remainingHoliday < 0.5){
      return true;
    }
    else if(absenceStatus === 'HFF' && statusCode === 'FF' && remainingHoliday < 0.5){
      return true;
    }
    else if(absenceStatus != 'HFF' && statusCode ==='FF' && remainingHoliday < 1){
      return true;
    }
    else return false;
  }

  resetVacationLimit(){
    this.vacationLimitReached = false;
  }
  close(){
    this.vacationLimitReachedError = false;
  }

  error(){
    this.vacationLimitReached = true;
    this.vacationLimitReachedError = true;
    setTimeout(()=> {
      this.vacationLimitReachedError = false;
    }, 3000);
  }
}