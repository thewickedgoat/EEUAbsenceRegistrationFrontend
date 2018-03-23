import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkfreedaysCreateViewComponent} from '../workfreedays-create-view/workfreedays-create-view.component';
import {MatDialog} from '@angular/material';
import {Employee} from '../../../entities/employee';
import {WorkfreedayService} from '../../../services/workfreeday.service';
import {WorkfreeDay} from '../../../entities/workfreeDay';
import {EmployeeService} from '../../../services/employee.service';
import {WorkFreedayType} from '../../../entities/workFreedayType.enum';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';

@Component({
  selector: 'app-workfreedays',
  templateUrl: './workfreedays.component.html',
  styleUrls: ['./workfreedays.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedaysComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  holidayYearStart: Date;
  holidayYearEnd: Date;


  employees: Employee[];
  selectedEmployee: Employee;
  publicHolidays: WorkfreeDay[] = [];

  constructor(private employeeService: EmployeeService,
              private workfreedayService: WorkfreedayService,
              private dialog: MatDialog) {

  }

  ngOnInit() {
    this.employeeService.getAll().subscribe(emps => {
      this.employees = emps;
      this.getHolidayYearStartEnd();
    });
  }

  createWorkfreeDay(){
    let workfreeDay = new WorkfreeDay();
    let dialogRef = this.dialog.open(WorkfreedaysCreateViewComponent, {
      data: {
        employees: this.employees
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      workfreeDay = result;
    });
  }

  createPublicHoliday(){

  }

  getHolidayYearStartEnd(){
    this.holidayYearStart = this.currentHolidayYearSpec.StartDate;
    this.holidayYearEnd = this.currentHolidayYearSpec.EndDate;
  }

  getEmployee(){
    return this.selectedEmployee;
  }

  selectEmployee(value: string){
    const id = parseInt(value);
    const selectedEmployee = this.employees.find(x => x.Id === id);
    this.selectedEmployee = selectedEmployee;
  }

  getWorkfreeDaysOfEmployee(employee: Employee){
    if(employee != null){
      if(employee.WorkfreeDays != null){
        const workfreeDays = employee.WorkfreeDays.filter(x => x.Type === WorkFreedayType.Arbejdsfridag);
        return workfreeDays;
      }
    }
  }

  getPublicHolidays(){
    let publicHolidays = [];
    this.workfreedayService.getAll().subscribe(workfreeDays => {
      publicHolidays = workfreeDays.filter(x => x.Type === WorkFreedayType.Helligdag);
      this.sortPublicHolidays(publicHolidays);
    });
  }

  sortPublicHolidays(publicHolidays: WorkfreeDay[]){
    let sortedPublicHolidayList = [];
    let holidayName = null;
    for(let publicHoliday of publicHolidays){
      if(publicHoliday.Name != holidayName){
        sortedPublicHolidayList.push(publicHoliday);
        holidayName = publicHoliday.Name;
      }
    }
  }
}
