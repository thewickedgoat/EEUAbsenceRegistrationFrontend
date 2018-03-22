import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Department} from '../../../entities/department';
import {Employee} from '../../../entities/Employee';
import {StatusService} from '../../../services/status.service';
import {Status} from '../../../entities/status';

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
  currentMonthNumber: number = 0;
  buttonClicked: boolean = false;
  toggleButtonText: string;
  statuses: Status[];

  constructor(private statusSerivce: StatusService) { }

  ngOnInit() {
    this.toggleButtonText = 'Se månedsoversigt';
    this.statusSerivce.getAll().subscribe(statuses => {
      this.statuses = this.sortStatuses(statuses);
    });
  }

  toggleMonthYear(){
    console.log('clicked');
    if(this.buttonClicked === false){
      this.buttonClicked = true;
      this.toggleButtonText = 'Se årsoversigt'
    }
    else if(this.buttonClicked === true){
      this.buttonClicked = false;
      this.toggleButtonText = 'Se månedsoversigt'
    }
  }

  test(i){
    console.log(+i);
    this.currentMonthNumber = +i;
  }

  /*getCurrentMonthForEmployee(employee: Employee, monthNumber: number){
    const currentHolidayYear = this.getHolidayYearForEmployee(employee);
    const month = currentHolidayYear.Months.find(x => x.MonthDate.getMonth() === monthNumber);
    return month;
  }*/

  /*getHolidayYearForEmployee(employee: Employee){
    let holidayYears = employee.HolidayYears;
    for(let currentHolidayYear of holidayYears){
      if(currentHolidayYear.StartDate.getFullYear() === this.holidayYearStart){
        return currentHolidayYear;
      }
    }
  }*/

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

}
