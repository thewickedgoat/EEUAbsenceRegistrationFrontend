import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MonthViewComponent implements OnInit {

  @Input()
  employee: Employee;
  @Input()
  absencesForApprovalByEmployee: number;
  @Input()
  absencesForApprovalByChief: number;
  @Input()
  absencesForApprovalByAdmin: number;

  @Output()
  emitter = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  goToCalendar(){
    this.emitter.emit(this.employee.Id);
  }

}
