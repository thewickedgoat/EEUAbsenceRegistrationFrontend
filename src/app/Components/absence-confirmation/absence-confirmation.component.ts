import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../entities/Employee';
import {Month} from '../../entities/month';
import {MonthService} from '../../services/month.service';

@Component({
  selector: 'app-absence-confirmation',
  templateUrl: './absence-confirmation.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AbsenceConfirmationComponent implements OnInit {

  @Input()
  employee: Employee;
  @Input()
  loggedInEmployee: Employee;
  @Input()
  currentMonth: Month;
  @Input()
  isAdmin: boolean;
  @Input()
  isCEO: boolean;
  @Input()
  isDepartmentChief: boolean;
  @Input()
  isEmployee: boolean;

  @Output()
  emitter = new EventEmitter();

  @Output()
  emitterToReopen = new EventEmitter();

  isMonthApprovedByEmployee: boolean;
  isMonthApprovedByChief: boolean;
  isMonthApprovedByCEO: boolean;
  isMonthApprovedByAdmin: boolean;


  constructor(private monthService: MonthService) {

  }

  ngOnInit() {
    this.monthApprovalCheck();
  }

  ngOnChanges(){
    this.monthApprovalCheck();
  }


  /**
   * Approves all absences that are in the current currentMonth. Approval is based on the loggedInEmployee
   */
  approveAbsencePeriod(){
    if(this.isEmployee){
      this.currentMonth.IsLockedByEmployee = true;
      this.monthService.put(this.currentMonth).subscribe(() =>
        this.isMonthApprovedByEmployee = true);
    }
    else if(this.isDepartmentChief && !this.isEmployee){
      this.currentMonth.IsLockedByEmployee = true;
      this.currentMonth.IsLockedByChief = true;
      this.monthService.put(this.currentMonth).subscribe(() => {
        this.isMonthApprovedByEmployee = true;
        this.isMonthApprovedByChief = true;
      });
    }
    else if(this.isCEO && !this.isEmployee){
      this.currentMonth.IsLockedByEmployee = true;
      this.currentMonth.IsLockedByCEO = true;
      this.monthService.put(this.currentMonth).subscribe(() => {
        this.isMonthApprovedByEmployee = true;
        this.isMonthApprovedByCEO = true;
      });
    }
    else if(this.isAdmin){
      this.currentMonth.IsLockedByEmployee = true;
      this.currentMonth.IsLockedByChief = true;
      this.currentMonth.IsLockedByCEO = true;
      this.currentMonth.IsLockedByAdmin = true;
      this.monthService.put(this.currentMonth).subscribe(() => {
        this.isMonthApprovedByEmployee = true;
        this.isMonthApprovedByChief = true;
        this.isMonthApprovedByCEO = true;
        this.isMonthApprovedByAdmin = true;
      });
    }
    this.emitter.emit();
  }

  monthApprovalCheck(){
    if(this.currentMonth.IsLockedByEmployee){
      this.isMonthApprovedByEmployee = true;
    }
    else if(!this.currentMonth.IsLockedByEmployee){
      this.isMonthApprovedByEmployee = false;
    }
    if(this.currentMonth.IsLockedByChief){
      this.isMonthApprovedByChief = true;
    }
    else if(!this.currentMonth.IsLockedByChief) {
      this.isMonthApprovedByChief = false;
    }
    if(this.currentMonth.IsLockedByCEO){
      this.isMonthApprovedByCEO = true;
    }
    else if(!this.currentMonth.IsLockedByCEO) {
      this.isMonthApprovedByCEO = false;
    }
    if(this.currentMonth.IsLockedByAdmin){
      this.isMonthApprovedByAdmin = true;
    }
    else if(!this.currentMonth.IsLockedByAdmin) {
      this.isMonthApprovedByAdmin = false;
    }
  }

  /**
   * Unlocks all absences in the current month
   */
  reopenMonth(){
    this.currentMonth.IsLockedByEmployee = false;
    this.currentMonth.IsLockedByChief = false;
    this.currentMonth.IsLockedByCEO = false;
    this.currentMonth.IsLockedByAdmin = false;
    this.monthService.put(this.currentMonth).subscribe(() => {
      this.isMonthApprovedByAdmin = false;
      this.isMonthApprovedByCEO = false;
      this.isMonthApprovedByChief = false;
      this.isMonthApprovedByEmployee = false;
      this.emitterToReopen.emit();
    });
  }


}
