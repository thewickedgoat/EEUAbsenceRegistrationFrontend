import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkfreeDay} from '../../../entities/workfreeDay';
import {EmployeeRole} from '../../../entities/employeeRole.enum';

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
    const values = this.workfreedayGroup.value;
    const startDate = new Date(values.dateStart);
    const endDate = new Date(values.dateEnd);
    const name = this.dayNames[this.dayNumber];
    console.log('start');
    console.log(this.employee);
    let dateToCreate = startDate;
    let datesToCreate = new Array<Date>();
    do{
      if(dateToCreate.getDay() === this.dayNumber){
        const workfreeDayDate = new Date(dateToCreate);
        datesToCreate.push(workfreeDayDate);
      }
      dateToCreate.setDate(dateToCreate.getDate()+1);
    }
    while (dateToCreate <= endDate);
    let workfreeDays = new Array<WorkfreeDay>();
    const employee: Employee = {
      Id: this.employee.Id,
      FirstName: ' ',
      LastName: ' ',
      UserName: ' ',
      Email: ' ',
      Password: ' ',
      HolidayYears: null,
      EmployeeRole: EmployeeRole.Medarbejder,
      Department: null,
      WorkfreeDays: null,
      Note: ' '
    }
    console.log('start');
    console.log(this.employee);
    for(let workfreeDate of datesToCreate){
      const workfreeDay: WorkfreeDay = {Date: workfreeDate, Name: name, Employee: employee};
      workfreeDays.push(workfreeDay);
    }

    console.log(this.employee);
    console.log(workfreeDays);
    this.dialogRef.close(workfreeDays);
  }

  setDay(t){
    const id = parseInt(t);
    this.dayNumber = id;
  }
}
