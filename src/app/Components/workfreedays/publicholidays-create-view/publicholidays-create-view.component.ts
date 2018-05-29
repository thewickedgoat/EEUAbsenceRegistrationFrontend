import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PublicHoliday} from '../../../entities/publicholiday';

@Component({
  selector: 'app-publicholidays-create-view',
  templateUrl: './publicholidays-create-view.component.html',
  styleUrls: ['./publicholidays-create-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicholidaysCreateViewComponent implements OnInit {

  publicHolidayGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<PublicholidaysCreateViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.publicHolidayGroup = this.formBuilder.group({
      date: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  createPublicHoliday(){
    const values = this.publicHolidayGroup.value;
    const date = new Date(values.date);
    console.log(date);
    const name = values.name;
    const publicHoliday: PublicHoliday = {Date: date, Name: name, HolidayYearSpec: this.data.currentHolidayYearSpec};
    this.dialogRef.close(publicHoliday);
  }

  isInvalid(controlName: string){
    const control = this.publicHolidayGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isValid(controlName: string){
    const control = this.publicHolidayGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
