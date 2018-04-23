import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {Employee} from '../../../entities/employee';
import {EmployeeService} from '../../../services/employee.service';
import {HolidayYear} from '../../../entities/HolidayYear';
import {MatDialog} from '@angular/material';
import {WorkfreedayCreateErrorComponent} from '../../Errors/workfreeday-create-error/workfreeday-create-error.component';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {HolidayyearEmployeeCreateViewComponent} from '../holidayyear-employee-create-view/holidayyear-employee-create-view.component';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {HolidayyearCreateViewComponent} from '../holidayyear-create/holidayyear-create-view.component';

@Component({
  selector: 'app-holidayyear-administration',
  templateUrl: './holidayyear-administration.component.html',
  styleUrls: ['./holidayyear-administration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearAdministrationComponent implements OnInit {

  holidayYearSpecs: HolidayYearSpec[];
  selectedHolidayYearSpec: HolidayYearSpec;
  selectedEmployee: Employee;
  selectedHolidayYear: HolidayYear;
  employees: Employee[];
  currentlyEditing: boolean = false;

  constructor(
    private holidayYearSpecService: HolidayYearSpecService,
    private employeeService: EmployeeService,
    private holidayyearService: HolidayyearService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.getHolidayYearSpecs();
    this.getEmployees();

  }

  getHolidayYearSpecs(){
    this.holidayYearSpecService.getAll().subscribe(holidayYearSpecs => {
      this.holidayYearSpecs = holidayYearSpecs;
      for(let holidayYearSpec of this.holidayYearSpecs){
        this.formatHolidayYearStartEnd(holidayYearSpec);
      }
      console.log(this.holidayYearSpecs);
      console.log(this.selectedHolidayYearSpec);
    })
  }

  getCurrentHolidayYearSpec(){
    let date = new Date();
    console.log(date);
    const currentHolidayYearSpec = this.holidayYearSpecs.find(x => x.StartDate <= date && x.EndDate >= date);
    this.selectedHolidayYearSpec = currentHolidayYearSpec;
    console.log(this.selectedHolidayYearSpec);
  }

  formatHolidayYearStartEnd(holidayYearSpec: HolidayYearSpec){
    if(holidayYearSpec != null){
      const startDateToParse = holidayYearSpec.StartDate.toString();
      const endDateToParse = holidayYearSpec.EndDate.toString();
      const startDate = new Date(Date.parse(startDateToParse));
      const endDate = new Date(Date.parse(endDateToParse));
      holidayYearSpec.StartDate = startDate;
      holidayYearSpec.EndDate = endDate;
    }
  }

  selectHolidayYear(id: number){
    const index = +id;
    console.log(index);
    this.selectedHolidayYearSpec = this.holidayYearSpecs.find(x => x.Id === index);
  }

  updateHolidayYearSpec(){
    let tempHys = this.selectedHolidayYearSpec;
    this.selectedHolidayYearSpec = new HolidayYearSpec();
    this.holidayYearSpecService.getById(tempHys.Id).subscribe(hys => {
      tempHys = hys;
      this.selectedHolidayYearSpec = tempHys;
    });
  }

  getEmployees(){
    this.employeeService.getAll().subscribe(emps => {
      this.employees = emps;
      console.log(emps);
      console.log(this.employees);
    });
  }

  selectEmployee(id: number){
    if(this.currentlyEditing === true){
      this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: 'Du er i øjeblikket i gang med at redigere i en anden medarbejder.',
          errorHandler: 'Afslut redigering først.',
          multipleOptions: false
        }
      });
    }
    else {
      console.log('test');
      let selectedEmployee = this.employees.find(x => x.Id === id);
      this.selectedEmployee = selectedEmployee;
      this.getEmployeeHolidayYear();
      console.log(selectedEmployee);
    }
  }

  getEmployeeHolidayYear(){
    console.log('wut');
    let holidayYear = this.selectedEmployee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.selectedHolidayYearSpec.Id);
    console.log(holidayYear);
    if(!holidayYear){
      console.log('i should be here');
      let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: 'Der er endnu ikke oprettet specifikationer for denne medarbejder i det valgte ferieår.',
          errorHandler: 'Ønsker du at oprette specifikationerne?',
          multipleOptions: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.createEmployeeHolidayYear();
        }
        else return;
      });
    }
    else{
      this.selectedHolidayYear = holidayYear;
    }

  }

  toggleEdit(bool: boolean){
    console.log('test');
    if(bool === true){
      this.currentlyEditing = false;
    }
    else if(bool === false){
      this.currentlyEditing = true;
    }
    console.log(this.currentlyEditing);
  }

  createEmployeeHolidayYear(){
    let dialogRef = this.dialog.open(HolidayyearEmployeeCreateViewComponent, {
      data: {
        employee: this.selectedEmployee,
        holidayYearSpec: this.selectedHolidayYearSpec
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != null){
        console.log(result);
        this.holidayyearService.post(result).subscribe(holidayYear => {
          this.selectedHolidayYear = holidayYear;
        })
      }
    });
  }

  createHolidayYearSpec(){
    let dialogRef = this.dialog.open(HolidayyearCreateViewComponent, {
      data: {

      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        this.holidayYearSpecService.post(result).subscribe(hys => {
          console.log(hys);
          this.selectedHolidayYearSpec = hys;
        })
      }
    });
  }
}
