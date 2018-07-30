import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {StatusService} from '../../../services/status.service';
import {Status} from '../../../entities/status';
import {Employee} from '../../../entities/Employee';
import {HolidayYear} from '../../../entities/HolidayYear';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {DateformatingService} from '../../../services/dateformating.service';
import {EmployeeRole} from '../../../entities/employeeRole.enum';
import {Month} from '../../../entities/month';
import {MonthService} from '../../../services/month.service';

@Component({
  selector: 'app-employee-statistics-controller',
  templateUrl: './employee-statistics-controller.component.html',
  styleUrls: ['./employee-statistics-controller.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeStatisticsControllerComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  months = [];
  @Input()
  loggedInUser: Employee;
  @Input()
  departments: Department[];
  @Input()
  holidayYearStart: number;

  selectedHolidayYearSpec: HolidayYearSpec;
  currentMonthNumber: number = 0;
  monthView: boolean = false;
  monthSelected: boolean = false;
  toggleButtonText: string;
  statuses: Status[];

  constructor(private statusSerivce: StatusService,
              private dateformatingService: DateformatingService,
              private monthService: MonthService) { }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.selectedHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    this.selectedHolidayYearSpec.StartDate = this.dateformatingService.formatDate(this.selectedHolidayYearSpec.StartDate);
    this.selectedHolidayYearSpec.EndDate = this.dateformatingService.formatDate(this.selectedHolidayYearSpec.EndDate);
    this.toggleButtonText = 'Se månedsoversigt';
    this.months = this.populateMonthList();
    this.statusSerivce.getAll().subscribe(statuses => {
      this.statuses = this.sortStatuses(statuses);
    });
  }

  toggleMonthYear(){
    if(this.monthView === false){
      this.monthView = true;
      this.monthSelected = false;
      this.toggleButtonText = 'Se årsoversigt'
    }
    else if(this.monthView === true){
      this.monthView = false;
      this.toggleButtonText = 'Se månedsoversigt'
    }
  }

  selectMonth(i){
    this.currentMonthNumber = +i;
    this.monthSelected = true;
  }

  populateMonthList(){
    let months = [];
    const startDate = new Date();
    startDate.setDate(this.selectedHolidayYearSpec.StartDate.getDate());
    startDate.setMonth(this.selectedHolidayYearSpec.StartDate.getMonth());
    startDate.setFullYear(this.selectedHolidayYearSpec.StartDate.getFullYear());
    const endDate = this.selectedHolidayYearSpec.EndDate;
    do{
      let monthDate = new Date();
      monthDate.setDate(startDate.getDate());
      monthDate.setMonth(startDate.getMonth());
      monthDate.setFullYear(startDate.getFullYear());
      startDate.setMonth(startDate.getMonth()+1);
      months.push(monthDate);
    }
    while(startDate < endDate);
    return months;
  }


  employeeIsInCurrentHolidayYear(employee: Employee){
    const holidayYears = employee.HolidayYears;
    if(holidayYears != null && holidayYears.length > 0){
      const holidayYear = holidayYears.find(x => x.CurrentHolidayYear.Id === this.selectedHolidayYearSpec.Id);
      if(holidayYear === null){
        return false;
      }
      else return true;
    }
    else {
      return false;
    }
  }

  getCurrentMonthForEmployee(employee: Employee, monthNumber: number){
    const currentHolidayYear = this.getHolidayYearForEmployee(employee);
    this.formatMonthDate(currentHolidayYear);
    const month = currentHolidayYear.Months.find(x => x.MonthDate.getMonth() === monthNumber);
    return month;
  }

  getHolidayYearForEmployee(employee: Employee){
    let holidayYears = employee.HolidayYears;
    for(let holidayYear of holidayYears){
      holidayYear.CurrentHolidayYear.StartDate = this.dateformatingService.formatDate(holidayYear.CurrentHolidayYear.StartDate);
    }
    const currentHolidayYear = holidayYears.find(x => x.CurrentHolidayYear.Id === this.selectedHolidayYearSpec.Id);
    return currentHolidayYear;
  }

  approveMonthForDepartment(department: Department){
    for(let employee of department.Employees){
      const month = this.getCurrentMonthForEmployee(employee, this.currentMonthNumber);
      if(month != null){
        if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
          const monthToUpdate = this.approveAsAdmin(employee, month);
          this.monthService.put(monthToUpdate).subscribe();
        }
        else if(this.loggedInUser.EmployeeRole === EmployeeRole.Afdelingsleder){
          const monthToUpdate = this.approveAsChief(department, employee, month);
          this.monthService.put(monthToUpdate).subscribe();
        }
      }
    }
  }


  approveAsAdmin(employee: Employee, month: Month){
    if(employee.EmployeeRole === EmployeeRole.Afdelingsleder){
      month.IsLockedByAdmin = true;
      month.IsLockedByCEO = true;
      month.IsLockedByEmployee = true;
      return month;
    }
    else if(employee.EmployeeRole === EmployeeRole.Medarbejder){
      month.IsLockedByAdmin = true;
      month.IsLockedByChief = true;
      month.IsLockedByEmployee = true;
      return month;
    }
    else if(employee.EmployeeRole === EmployeeRole.CEO){
      month.IsLockedByAdmin = true;
      month.IsLockedByCEO = true;
      month.IsLockedByEmployee = true;
      return month;
    }
    return month;
  }

  approveAsChief(department: Department, employee: Employee, month: Month){
    if(employee.EmployeeRole === EmployeeRole.Medarbejder &&
      department.Id === this.loggedInUser.Department.Id &&
      employee.Id != this.loggedInUser.Id){
      month.IsLockedByChief = true;
      month.IsLockedByEmployee = true;
      return month;
    }
    if(employee.Id === this.loggedInUser.Id){
      month.IsLockedByEmployee = true;
      return month;
    }
    return month;
  }

  sortStatuses(statuses: Status[]){
    let statusArray = new Array<Status>();
    for(let status of statuses){
      if(status.StatusCode === 'HA' || status.StatusCode === 'HS'){

      }
      else {
        statusArray.push(status);
      }
    }
    return statusArray;
  }

  isPermitted(department: Department){
    if(this.loggedInUser.Department.Id === department.Id && this.loggedInUser.EmployeeRole === EmployeeRole.Afdelingsleder){
      return true;
    }
    else if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator){
      return true;
    }
    else return false;
  }

  formatMonthDate(holidayYear: HolidayYear){
    if(holidayYear != null){
      for(let month of holidayYear.Months){
        month.MonthDate = this.dateformatingService.formatDate(month.MonthDate);
      }
    }
  }
}
