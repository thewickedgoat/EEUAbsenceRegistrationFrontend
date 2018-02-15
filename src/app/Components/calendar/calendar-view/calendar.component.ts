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

  status: Status;

  isEmployee: boolean;
  isDepartmentChief: boolean;
  isCEO: boolean;
  isAdmin: boolean;
  isMonthLocked: boolean;

  lastMonthInHolidayYear: boolean;
  firstMonthInHolidayYear: boolean;

  currentHolidayYear: HolidayYear;

  absencesInCurrentMonth: Absence[];

  employees: Employee[];
  currentMonth: Month;
  daysInCurrentMonth: Date[];
  amountOfWeeksInCurrentMonth: number[];
  weekendDays: number[];
  daysBeforeIndex: number[];
  weeks: any[];
  datesInWeeks: any[];

  constructor(private router: Router,
              private location: Location,
              private holidayYearService: HolidayyearService,
              private monthService: MonthService,
              private employeeService: EmployeeService,
              private absenceService: AbsenceService,
              private route: ActivatedRoute,
              private zone: NgZone) {

  }

  ngOnInit() {
    //call back hell - aaaaaaaahhhhhhhhh
        this.route.paramMap.subscribe(params => {
          this.employeeService.getById(+params.get('id')).subscribe( employee => {
            this.employee = employee;
            this.getHolidayYear(+params.get('year'), +params.get('month'));
            console.log('i mean...what? ' + this.currentMonth);
          });

    });
  }

  initData(){
    this.loggedInUser = JSON.parse(sessionStorage.getItem('currentEmployee'));
    this.initArrays();
    this.populateCalendar();
    this.getAllDatesInMonth();
    this.validateApprovalPermissions();
    this.checkForLockedMonth();
    this.withinHolidayYearInterval();
  }

  setStatus(status){
    this.status = status;
  }

  getHolidayYear(year: number, month: number){
    let holidayYears = new Array();
    let holidayYearsInEmployee = new Array();
    this.holidayYearService.getAll().subscribe(holidays => {
      holidayYears = holidays;
      holidayYearsInEmployee = holidayYears.filter(x => x.Employee.Id === this.employee.Id);
      if(holidayYearsInEmployee != null){
        for(let holidayYear of holidayYearsInEmployee){
          const startDateToParse = holidayYear.StartDate.toString();
          const endDateToParse = holidayYear.EndDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          const endDate = new Date(Date.parse(endDateToParse));
          holidayYear.StartDate = startDate;
          holidayYear.EndDate = endDate;
        }
      }
      const april = 3;
      const may = 4;
      if(month >= may){
        this.currentHolidayYear = holidayYears.find(x => x.EndDate.getFullYear() === year+1
          && x.StartDate.getFullYear() === year);
      }
      else if(month <= april){
        this.currentHolidayYear = holidayYears.find(x => x.StartDate.getFullYear() === year-1
          && x.EndDate.getFullYear() === year);
      }
      this.getCurrentMonth(month);
      this.initData();
    });
  }

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
    console.log(this.currentMonth);
  }

  /**
   * Navigates to the next month
   * @param $event
   */
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
    console.log("Refreshing");
    /**this.holidayYearService.getById(this.currentHolidayYear.Id).subscribe(holiday => {
      this.currentHolidayYear = holiday;
      this.getCurrentMonth(this.currentMonth.MonthDate.getMonth());
      this.initData();
    });*/
    this.initData();
    console.log('Refreshed');
  }

  checkForLockedMonth(){
    if(this.isAdmin && this.currentMonth.IsLockedByAdmin === true){
      this.isMonthLocked = true;
    }
    else if(this.isDepartmentChief && this.currentMonth.IsLockedByChief === true){
      this.isMonthLocked = true;
    }
    else if(this.isCEO && this.currentMonth.IsLockedByCEO === true){
      this.isMonthLocked = true;
    }
    else if(this.isEmployee && this.currentMonth.IsLockedByEmployee === true){
      this.isMonthLocked = true;
    }
    else{
      this.isMonthLocked = false;
    }
  }

  updateHolidayAndMonth(){
    this.holidayYearService.getById(this.currentHolidayYear.Id).subscribe(holiday => {
      if(holiday != null){
          const startDateToParse = holiday.StartDate.toString();
          const endDateToParse = holiday.EndDate.toString();
          const startDate = new Date(Date.parse(startDateToParse));
          const endDate = new Date(Date.parse(endDateToParse));
          holiday.StartDate = startDate;
          holiday.EndDate = endDate;
          this.currentHolidayYear = holiday;

          let currentMonth = this.currentHolidayYear.Months.find(x => x.Id === this.currentMonth.Id);
          if(currentMonth != null){
            const dateToParse = currentMonth.MonthDate.toString();
            const monthDate = new Date(Date.parse(dateToParse));
            currentMonth.MonthDate = monthDate;
            this.currentMonth = currentMonth;
          }
      }
      console.log(this.currentMonth);
      this.initData();
    });
  }

  withinHolidayYearInterval(){
    if(this.currentMonth.MonthDate.getMonth() === 3){
      this.lastMonthInHolidayYear = true;
      this.firstMonthInHolidayYear = false;
    }
    else if(this.currentMonth.MonthDate.getMonth() === 4){
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

  validateApprovalPermissions(){
    this.isAdmin = false;
    this.isCEO = false;
    this.isDepartmentChief = false;
    this.isEmployee = false;
    const loggedInEmployee = this.loggedInUser;
    if(loggedInEmployee.Id === this.employee.Id && loggedInEmployee.EmployeeRole != EmployeeRole.Afdelingsleder){
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
    this.absencesInCurrentMonth = new Array<Absence>();
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
}
