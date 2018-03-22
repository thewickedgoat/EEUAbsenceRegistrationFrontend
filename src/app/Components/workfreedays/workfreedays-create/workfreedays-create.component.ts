import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkfreedayService} from '../../../services/workfreeday.service';
import {EmployeeService} from '../../../services/employee.service';
import {Employee} from '../../../entities/employee';
import {MatDialog} from '@angular/material';
import {WorkfreedaysCreateViewComponent} from '../workfreedays-create-view/workfreedays-create-view.component';
import {WorkfreeDay} from '../../../entities/workfreeDay';

@Component({
  selector: 'app-workfreedays-create',
  templateUrl: './workfreedays-create.component.html',
  styleUrls: ['./workfreedays-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedaysCreateComponent implements OnInit {

  //@Input()
  employees: Employee[];

  constructor(private employeeService: EmployeeService, private workfreedayService: WorkfreedayService, private dialog: MatDialog) {

  }

  ngOnInit() {
    this.employeeService.getAll().subscribe(emps => this.employees = emps);
  }

  createWorkfreeDay(){
    let workfreeDay = new WorkfreeDay();
    let dialogRef = this.dialog.open(WorkfreedaysCreateViewComponent, {
      data: {
        employees: this.employees
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      workfreeDay = result;
      console.log(workfreeDay);
    });
  }

  createPublicHoliday(){

  }
}
