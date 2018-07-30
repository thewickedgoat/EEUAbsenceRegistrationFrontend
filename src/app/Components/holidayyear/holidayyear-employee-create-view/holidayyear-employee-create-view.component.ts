import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Month} from '../../../entities/month';
import {Absence} from '../../../entities/absence';

@Component({
  selector: 'app-holidayyear-employee-create-view',
  templateUrl: './holidayyear-employee-create-view.component.html',
  styleUrls: ['./holidayyear-employee-create-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearEmployeeCreateViewComponent implements OnInit {

  holidayYearGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<HolidayyearEmployeeCreateViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.holidayYearGroup = this.formBuilder.group({
      holidayAvailable: ['', Validators.required],
      holidayFreedaysAvailable: ['', Validators.required],
      holidayTransfered: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  create(){
    const values = this.holidayYearGroup.value;
    const months = this.createMonths();
    let tempHolidayAvailable = values.holidayAvailable.toString();
    let holidayAvailable = tempHolidayAvailable.replace(',', '.');
    holidayAvailable = +holidayAvailable;

    let tempHolidayFreedaysAvailable = values.holidayFreedaysAvailable.toString();
    let holidayFreedaysAvailable = tempHolidayFreedaysAvailable.replace(',', '.');
    holidayFreedaysAvailable = +holidayFreedaysAvailable;

    let tempHolidayTransfered = values.holidayTransfered.toString();
    let holidayTransfered = tempHolidayTransfered.replace(',', '.');
    holidayTransfered = +holidayTransfered;

    const holidayUsed = 0;
    const holidayFreedaysUsed = 0;
    const employee = this.data.employee;
    const currentHolidayYearSpec = this.data.holidayYearSpec;
    currentHolidayYearSpec.HolidayYears = null;
    const newHolidayYear: HolidayYear = {
      CurrentHolidayYear: currentHolidayYearSpec,
      Months: months,
      Employee: employee,
      IsClosed: false,
      HolidayAvailable: holidayAvailable,
      HolidayFreedayAvailable: holidayFreedaysAvailable,
      HolidaysUsed: holidayUsed,
      HolidayFreedaysUsed: holidayFreedaysUsed,
      HolidayTransfered: holidayTransfered
    }
    this.dialogRef.close(newHolidayYear);
  }

  createMonths(){
    let months = new Array<Month>();
    let startDate = new Date();
    startDate.setFullYear(this.data.holidayYearSpec.StartDate.getFullYear());
    startDate.setMonth(this.data.holidayYearSpec.StartDate.getMonth());
    startDate.setDate(this.data.holidayYearSpec.StartDate.getDate());
    startDate.setHours(this.data.holidayYearSpec.StartDate.getHours());
    console.log(this.data.holidayYearSpec.StartDate);
    const endDate = this.data.holidayYearSpec.EndDate;
    do{
      let monthDate = new Date();
      monthDate.setDate(startDate.getDate());
      monthDate.setMonth(startDate.getMonth());
      monthDate.setFullYear(startDate.getFullYear());
      const month: Month = {
        MonthDate: monthDate,
        AbsencesInMonth: new Array<Absence>(),
        HolidayYear: null,
        IsLockedByEmployee: false,
        IsLockedByChief: false,
        IsLockedByCEO: false,
        IsLockedByAdmin: false};
      months.push(month);
      startDate.setMonth(startDate.getMonth()+1);
    }
    while(startDate < endDate);
    console.log(this.data.holidayYearSpec.StartDate);
    return months;
  }

  cancel(){
    this.dialogRef.close();
  }
}
