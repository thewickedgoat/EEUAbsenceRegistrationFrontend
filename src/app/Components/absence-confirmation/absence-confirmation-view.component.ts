import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
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
  reopenAsEmployee = new EventEmitter();
  @Output()
  reopenAsChief = new EventEmitter();
  @Output()
  reopenAsCEO = new EventEmitter();
  @Output()
  reopenAsAdmin = new EventEmitter();

  approvingReopening = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(){
    this.approvingReopening = false;
  }

  approveMonth(){
    if(this.approvingReopening != true){
      this.approvingReopening = true;
      this.emitter.emit();
    }
  }

  reopenMonthAsEmployee(){
    if(this.approvingReopening != true){
      this.approvingReopening = true;
      this.reopenAsEmployee.emit();
    }
  }

  reopenMonthAsChief(){
    if(this.approvingReopening != true){
      this.approvingReopening = true;
      this.reopenAsChief.emit();
    }
  }

  reopenMonthAsCEO(){
    if(this.approvingReopening != true){
      this.approvingReopening = true;
      this.reopenAsCEO.emit();
    }
  }

  reopenMonthAsAdmin(){
    if(this.approvingReopening != true){
      this.approvingReopening = true;
      this.reopenAsAdmin.emit();
    }
  }

}
