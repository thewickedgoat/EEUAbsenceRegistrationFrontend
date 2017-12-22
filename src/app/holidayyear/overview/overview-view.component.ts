import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {Router} from '@angular/router';
import {EmployeeRole} from '../../entities/employeeRole.enum';

@Component({
  selector: 'app-overview-view',
  templateUrl: './overview-view.component.html',
  styleUrls: ['./overview-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OverviewViewComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;

  @Input()
  employee: Employee;

  @Input()
  loggedInUser: Employee;

  @Input()
  monthsInHolidayYear: Date[];

  @Output()
  emitter = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToCalendar(year: number, month: number){
    if(this.loggedInUser.EmployeeRole === EmployeeRole.Administrator && this.employee.Id === this.loggedInUser.Id){
      this.router.navigateByUrl('month/' + month + '/' + this.holidayYearStart.getFullYear() + '/' + this.holidayYearEnd.getFullYear() );
    }
    else{
      this.router.navigateByUrl('calendar/' + this.employee.Id + '/' + year + '/' + month);
    }

  }

  nextHolidayYear(){
    const year = this.holidayYearStart.getFullYear()+1;
    this.emitter.emit(year);
  }

  previousHolidayYear(){
    const year = this.holidayYearStart.getFullYear()-1;
    this.emitter.emit(year);
  }

}
