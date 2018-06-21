import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {StatusService} from '../../../services/status.service';
import {Status} from '../../../entities/status';
import {Employee} from '../../../entities/Employee';
import {HolidayYear} from '../../../entities/HolidayYear';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {DateformatingService} from '../../../services/dateformating.service';

@Component({
  selector: 'app-employee-statistics-controller',
  templateUrl: './employee-statistics-controller.component.html',
  styleUrls: ['./employee-statistics-controller.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeStatisticsControllerComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
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
              private dateformatingService: DateformatingService) { }

  ngOnInit() {
    this.selectedHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
    this.toggleButtonText = 'Se månedsoversigt';
    this.statusSerivce.getAll().subscribe(statuses => {
      this.statuses = this.sortStatuses(statuses);
    });
  }

  toggleMonthYear(){
    if(this.monthView === false){
      this.monthView = true;
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

  employeeIsInCurrentHolidayYear(employee: Employee){
    const holidayYears = employee.HolidayYears;
    if(holidayYears != null){
      const holidayYear = holidayYears.find(x => x.CurrentHolidayYear.Id === this.selectedHolidayYearSpec.Id);
      if(holidayYear === null){
        return false;
      }
      else return true;
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
    const currentHolidayYear = holidayYears.find(x => x.CurrentHolidayYear.StartDate.getFullYear() === this.holidayYearStart);
    return currentHolidayYear;
  }

  sortStatuses(statuses: Status[]){
    let statusArray = new Array<Status>();
    for(let status of statuses){
      if(status.StatusCode === 'HF' || status.StatusCode === 'HFF' ||
        status.StatusCode === 'HA' || status.StatusCode === 'HS'){

      }
      else {
        statusArray.push(status);
      }
    }
    return statusArray;
  }

  formatMonthDate(holidayYear: HolidayYear){
    if(holidayYear != null){
      for(let month of holidayYear.Months){
        month.MonthDate = this.dateformatingService.formatDate(month.MonthDate);
      }
    }
  }
}
