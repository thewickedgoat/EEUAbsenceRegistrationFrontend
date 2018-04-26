import { Component, EventEmitter, Output, OnInit, Input, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {Employee} from '../../../entities/Employee';
import {MatDialog} from '@angular/material';
import {HolidayyearEmployeeCreateViewComponent} from '../holidayyear-employee-create-view/holidayyear-employee-create-view.component';
import {HolidayYear} from '../../../entities/HolidayYear';

@Component({
  selector: 'app-holidayyear-administration-view',
  templateUrl: './holidayyear-administration-view.component.html',
  styleUrls: ['./holidayyear-administration-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearAdministrationViewComponent implements OnInit {

  @Input()
  selectedHolidayYearSpec: HolidayYearSpec;
  @Input()
  holidayYearSpecs: HolidayYearSpec[];
  @Input()
  employees: Employee[];
  @Input()
  selectedEmployee: Employee;
  @Input()
  selectedHolidayYear: HolidayYear;

  @Output()
  selectHolidayYearEmitter = new EventEmitter();
  @Output()
  updateEmitter = new EventEmitter();
  @Output()
  selectEmployeeEmitter = new EventEmitter();
  @Output()
  toggleEditEmitter = new EventEmitter();
  @Output()
  createHolidayYearSpecEmitter = new EventEmitter();

  constructor(private dialog: MatDialog,) { }

  ngOnInit() {
  }

  selectHolidayYear(id){
    this.selectHolidayYearEmitter.emit(id);
  }

  updateHolidayYearSpec(){
    this.updateEmitter.emit();
  }

  selectEmployee(id: number){
    this.selectEmployeeEmitter.emit(id);
  }

  toggleEdit(bool: boolean){
    this.toggleEditEmitter.emit(bool);
  }

  createHolidayYearSpec(){
    this.createHolidayYearSpecEmitter.emit();
  }

}
