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
import {DateformatingService} from '../../../services/dateformating.service';

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
    private dateformatingService: DateformatingService,
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
    });
  }

  getCurrentHolidayYearSpec(){
    let date = new Date();
    const currentHolidayYearSpec = this.holidayYearSpecs.find(x => x.StartDate <= date && x.EndDate >= date);
    this.selectedHolidayYearSpec = currentHolidayYearSpec;
  }

  formatHolidayYearStartEnd(holidayYearSpec: HolidayYearSpec){
    if(holidayYearSpec != null){
      holidayYearSpec.StartDate = this.dateformatingService.formatDate(holidayYearSpec.StartDate);
      holidayYearSpec.EndDate = this.dateformatingService.formatDate(holidayYearSpec.EndDate);
    }
  }

  selectHolidayYear(id: number){
    const index = +id;
    this.holidayYearSpecService.set(index);
    this.selectedHolidayYearSpec = this.holidayYearSpecService.getSelectedHolidayYearSpec();
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
      let selectedEmployee = this.employees.find(x => x.Id === id);
      this.selectedEmployee = selectedEmployee;
      this.getEmployeeHolidayYear();
    }
  }

  getEmployeeHolidayYear(){
    let holidayYear = this.selectedEmployee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.selectedHolidayYearSpec.Id);
    if(!holidayYear){
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
