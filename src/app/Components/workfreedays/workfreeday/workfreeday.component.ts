import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {WorkfreeDay} from '../../../entities/workfreeDay';

@Component({
  selector: 'app-workfreeday',
  templateUrl: './workfreeday.component.html',
  styleUrls: ['./workfreeday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedayComponent implements OnInit {

  @Input()
  employee: Employee;

  @Input()
  workfreeDays: WorkfreeDay[];

  constructor() { }

  ngOnInit() {
  }

}
