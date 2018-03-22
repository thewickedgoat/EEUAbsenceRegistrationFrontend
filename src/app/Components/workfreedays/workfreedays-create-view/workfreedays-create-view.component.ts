import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/employee';
import {WorkFreedayType} from '../../../entities/workFreedayType.enum';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeDeleteDialogComponent} from '../../employee/employee-delete-dialog/employee-delete-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-workfreedays-create-view',
  templateUrl: './workfreedays-create-view.component.html',
  styleUrls: ['./workfreedays-create-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedaysCreateViewComponent implements OnInit {

  employees: Employee[];

  publicHoliday: boolean = false;
  workfreedayGroup: FormGroup;

  @Output()
  emitter = new EventEmitter();

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EmployeeDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.workfreedayGroup = this.formBuilder.group({
      date: ['', Validators.required],
      employee: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.employees = this.data.employees;
    console.log(this.employees);
  }

  getType(id: number){
    return WorkFreedayType[id]
  }

  createWorkfreeDay(){
    const values = this.workfreedayGroup.value;

  }

  setPublicHoliday(){
    this.publicHoliday = true;
    console.log(this.workfreedayGroup.controls['date'].value);
  }

  setWorkfreeday(){
    this.publicHoliday = false;
    console.log(this.workfreedayGroup.controls['date'].value);
  }

}
