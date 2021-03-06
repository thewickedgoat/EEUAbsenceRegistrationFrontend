import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';

@Component({
  selector: 'app-absence-confirmation-view',
  templateUrl: './absence-confirmation-view.component.html',
  styleUrls: ['./absence-confirmation-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbsenceConfirmationViewComponent implements OnInit {

  @Input()
  employee: Employee;

  @Input()
  loggedInUser: Employee;

  @Input()
  isAdmin: boolean;
  @Input()
  isCEO: boolean;
  @Input()
  isDepartmentChief: boolean;
  @Input()
  isEmployee: boolean;

  @Input()
  isMonthApprovedByEmployee: boolean;
  @Input()
  isMonthApprovedByChief: boolean;
  @Input()
  isMonthApprovedByCEO: boolean;
  @Input()
  isMonthApprovedByAdmin: boolean;

  @Output()
  emitter = new EventEmitter();

  @Output()
  emitterToReopen = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  approveMonth(){
    this.emitter.emit();
  }

  reopenMonth(){
    this.emitterToReopen.emit()
  }

}
