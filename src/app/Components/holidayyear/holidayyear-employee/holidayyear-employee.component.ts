import { Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Employee} from '../../../entities/Employee';
import {HolidayyearService} from '../../../services/holidayyear.service';
import {MatDialog} from '@angular/material';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';

@Component({
  selector: 'app-holidayyear-employee',
  templateUrl: './holidayyear-employee.component.html',
  styleUrls: ['./holidayyear-employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearEmployeeComponent implements OnInit {

  @Input()
  selectedEmployee: Employee;
  @Input()
  selectedHolidayYear: HolidayYear;

  isNotEditable: boolean;

  @Output()
  toggleEditEmitter = new EventEmitter();
  @Output()
  updateEmitter = new EventEmitter();

  constructor(private holidayYearService: HolidayyearService,
              private dialog: MatDialog) {
    this.isNotEditable = true;
  }

  ngOnInit() {
  }

  toggleEditable(){
    let bool;
    if(this.isNotEditable === true){
      this.isNotEditable = false;
      bool = false;
    }
    else if(this.isNotEditable === false){
      this.isNotEditable = true;
      bool = true;
    }
    this.toggleEditEmitter.emit(bool);
  }

  deleteHolidayYear(){
    let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
      data: {
        errorMessage: 'Du er ved at slette alle oprettede specifikationer samt al indberettet fravær.',
        errorHandler: 'Er du sikker på du vil fortsætte?.',
        multipleOptions: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      let currentHolidayYearSpec = JSON.parse(sessionStorage.getItem('currentHolidayYearSpec'));
      console.log(currentHolidayYearSpec);
      if(result === true){
        this.holidayYearService.delete(this.selectedHolidayYear.Id).subscribe( () => {
          let holidayYearSpecToDelete = currentHolidayYearSpec.HolidayYears.find(x => x.Id === this.selectedHolidayYear.Id);
          currentHolidayYearSpec.HolidayYears.splice(currentHolidayYearSpec.HolidayYears.indexOf(holidayYearSpecToDelete));
          sessionStorage.setItem('currentHolidayYearSpec', JSON.stringify(currentHolidayYearSpec));
          location.reload();
        });
      }
    });
  }

  updateHolidayYear(holidayYear: HolidayYear){
    this.holidayYearService.put(holidayYear).subscribe(res => {
      this.updateEmitter.emit();
      this.isNotEditable = true;
    });
  }
}
