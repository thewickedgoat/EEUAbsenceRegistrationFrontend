import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/employee';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkfreeDay} from '../../../entities/workfreeDay';

@Component({
  selector: 'app-workfreedays-create-view',
  templateUrl: './workfreedays-create-view.component.html',
  styleUrls: ['./workfreedays-create-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedaysCreateViewComponent implements OnInit {

  dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

  employee: Employee;
  workfreedayGroup: FormGroup;
  dayNumber: number;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<WorkfreedaysCreateViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.workfreedayGroup = this.formBuilder.group({
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.employee = this.data.employee;
  }

  createWorkfreeDay(): void{
    console.log(this.dayNumber);
    const values = this.workfreedayGroup.value;
    const startDate = new Date(values.dateStart);
    const endDate = new Date(values.dateEnd);
    const name = this.dayNames[this.dayNumber];
    let dateToCreate = startDate;
    let datesToCreate = new Array<Date>();
    console.log(endDate.getDate());
    do{
      if(dateToCreate.getDay() === this.dayNumber){
        const workfreeDayDate = new Date(dateToCreate);
        datesToCreate.push(workfreeDayDate);
      }
      dateToCreate.setDate(dateToCreate.getDate()+1);
    }
    while (dateToCreate <= endDate);
    let workfreeDays = new Array<WorkfreeDay>();
    for(let workfreeDate of datesToCreate){
      const workfreeDay: WorkfreeDay = {Date: workfreeDate, Name: name, Employee: this.employee};
      workfreeDays.push(workfreeDay);
    }
    this.dialogRef.close(workfreeDays);
  }

  setDay(t){
    const id = parseInt(t);
    this.dayNumber = id;
  }
}
