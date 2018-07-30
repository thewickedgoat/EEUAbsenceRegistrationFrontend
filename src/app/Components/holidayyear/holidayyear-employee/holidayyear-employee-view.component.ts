import { Component, OnInit, OnChanges, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {HolidayYear} from '../../../entities/HolidayYear';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-holidayyear-employee-view',
  templateUrl: './holidayyear-employee-view.component.html',
  styleUrls: ['./holidayyear-employee-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearEmployeeViewComponent implements OnInit {

  @Input()
  selectedEmployee: Employee;
  @Input()
  selectedHolidayYear: HolidayYear;
  @Input()
  isNotEditable: boolean;

  name: string;

  formGroup: FormGroup;
  total: number;

  @Output()
  updateHolidayYearEmitter = new EventEmitter();
  @Output()
  toggleEmitter = new EventEmitter();
  @Output()
  deleteHolidayYearEmitter = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.name = this.selectedEmployee.FirstName + ' ' + this.selectedEmployee.LastName;
    this.total = this.selectedHolidayYear.HolidayTransfered+this.selectedHolidayYear.HolidayAvailable;
    this.createFormgroup();
  }

  ngOnChanges(){
    this.name = this.selectedEmployee.FirstName + ' ' + this.selectedEmployee.LastName;
    this.total = this.selectedHolidayYear.HolidayTransfered+this.selectedHolidayYear.HolidayAvailable;
  }

  createFormgroup(){
    this.formGroup = this.formBuilder.group({
      total: [{value: '', disabled: true}, Validators.required],
      holidayAvailable: [{value: '', disabled: this.isNotEditable}, Validators.required],
      holidayFreedaysAvailable: [{value: '', disabled: this.isNotEditable}, Validators.required],
      holidayUsed: [{value: '', disabled: true}, Validators.required],
      holidayFreedaysUsed: [{value: '', disabled: true}, Validators.required],
      holidayTransfered: [{value: '', disabled: this.isNotEditable}, Validators.required],
      name:[{value: '', disabled: true}, Validators.required],
    });
    const values = this.formGroup.value;
  }

  deleteHolidayYear(){
    this.deleteHolidayYearEmitter.emit();
  }

  updateHolidayYear(){
    const values = this.formGroup.value;
    let holidayYearToUpdate = this.selectedHolidayYear;

    let tempHolidayAvailable = values.holidayAvailable.toString();
    let holidayAvailable = tempHolidayAvailable.replace(',', '.');
    holidayAvailable = +holidayAvailable;
    holidayYearToUpdate.HolidayAvailable = holidayAvailable;

    let tempHolidayFreedayAvailable = values.holidayFreedaysAvailable.toString();
    let holidayFreedayAvailable = tempHolidayFreedayAvailable.replace(',', '.');
    holidayFreedayAvailable = +holidayFreedayAvailable;
    holidayYearToUpdate.HolidayFreedayAvailable = holidayFreedayAvailable;

    let tempHolidayTransfered = values.holidayTransfered.toString();
    let holidayTransfered = tempHolidayTransfered.replace(',', '.');
    holidayTransfered = +holidayTransfered;
    holidayYearToUpdate.HolidayTransfered = +holidayTransfered;

    this.updateHolidayYearEmitter.emit(holidayYearToUpdate);
    this.toggleEditable()
  }

  toggleEditable(){
    if(this.isNotEditable){
      this.toggleEmitter.emit();
      this.formGroup.controls['holidayAvailable'].enable();
      this.formGroup.controls['holidayFreedaysAvailable'].enable();
      this.formGroup.controls['holidayTransfered'].enable();
    }
    else if(this.isNotEditable === false){
      this.toggleEmitter.emit();
      this.formGroup.controls['holidayAvailable'].disable();
      this.formGroup.controls['holidayFreedaysAvailable'].disable();
      this.formGroup.controls['holidayTransfered'].disable();
    }
  }
}
