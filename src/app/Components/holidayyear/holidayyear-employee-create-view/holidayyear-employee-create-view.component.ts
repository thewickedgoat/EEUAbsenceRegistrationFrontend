import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HolidayyearCreateViewComponent} from '../holidayyear-create/holidayyear-create-view.component';
import {HolidayYear} from '../../../entities/HolidayYear';

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
    const holidayAvailable = values.holidayAvailable;
    const holidayFreedaysAvailable = values.holidayFreedaysAvailable;
    const holidayTransfered = values.holidayTransfered;
    const holidayUsed = 0;
    const holidayFreedaysUsed = 0;
    const employee = this.data.Employee;
    const newHolidayYear: HolidayYear = {
      CurrentHolidayYear: null,
      Months: null,
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

}
