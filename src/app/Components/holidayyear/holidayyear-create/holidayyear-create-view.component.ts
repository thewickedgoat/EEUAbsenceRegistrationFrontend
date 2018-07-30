import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HolidayYear} from '../../../entities/HolidayYear';
import {PublicHoliday} from '../../../entities/publicholiday';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';

@Component({
  selector: 'app-holidayyear-create-view',
  templateUrl: './holidayyear-create-view.component.html',
  styleUrls: ['./holidayyear-create-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearCreateViewComponent implements OnInit {

  holidayYearGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<HolidayyearCreateViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.holidayYearGroup = this.formBuilder.group({
      name: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  nameIsValid(controlName: string){
    const control = this.holidayYearGroup.controls[controlName].value;
    return !control.invalid && (control.dirty || control.touched);
  }

  nameIsInvalid(controlName: string){
    const control = this.holidayYearGroup.controls[controlName].value;
    return control.invalid && (control.dirty || control.touched);
  }

  dateIsValid(controlName: string){
    const dateToParse = this.holidayYearGroup.controls[controlName].value;
    const date = new Date(Date.parse(dateToParse));
    if(date.getDate().toString() != 'NaN' && date.getMonth().toString() != 'Nan' && date.getFullYear().toString() != 'NaN'){
      return dateToParse.invalid && (dateToParse.dirty || dateToParse.touched);
    }
  }

  dateIsInvalid(controlName: string){
    const dateToParse = this.holidayYearGroup.controls[controlName].value;
    const date = new Date(Date.parse(dateToParse));
    if(date.getDate().toString() === 'NaN' || date.getMonth().toString() === 'Nan' || date.getFullYear().toString() === 'NaN'){
      return dateToParse.invalid && (dateToParse.dirty || dateToParse.touched);
    }
  }

  create(){
    const values = this.holidayYearGroup.value;
    const startDate = new Date(values.dateStart);
    const endDate = new Date(values.dateEnd);
    const name = values.name;
    console.log(name);
    const holidayYears = new Array<HolidayYear>();
    const publicHolidays = new Array<PublicHoliday>();
    const newHolidayYear: HolidayYearSpec = {
      Name: name,
      StartDate: startDate,
      EndDate: endDate,
      HolidayYears: holidayYears,
      PublicHolidays: publicHolidays
    };
    this.dialogRef.close(newHolidayYear);
  }

  cancel(){
    this.dialogRef.close();
  }

}
