import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AbsenceService} from '../../services/absence.service';
import {Employee} from '../../entities/Employee';
import {EmployeeRole} from '../../entities/employeeRole.enum';
import {Absence} from '../../entities/absence';

@Component({
  selector: 'app-absence-confirmation',
  templateUrl: './absence-confirmation.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AbsenceConfirmationComponent implements OnInit {

  @Input()
  employee: Employee;

  @Input()
  loggedInUser: Employee;

  @Input()
  currentMonth: Date;

  @Input()
  holidayYearStart: Date;

  @Input()
  holidayYearEnd: Date;

  @Input()
  isAdmin: boolean;

  @Input()
  isDepartmentChief: boolean;

  @Input()
  isEmployee: boolean;

  @Output()
  emitter = new EventEmitter();

  @Output()
  emitterToReopen = new EventEmitter();

  @Input()
  absencesToApprove: Absence[];

  @Input()
  isMonthApprovedByEmployee: boolean;
  @Input()
  isMonthApprovedByChief: boolean;
  @Input()
  isMonthApprovedByAdmin: boolean;


  constructor(private absenceService: AbsenceService) { }

  ngOnInit() {
  }

  /**
   * Approves all absences that are in the current currentMonth. Approval is based on the loggedInUser
   */
  approveAbsencePeriode(){
    console.log(this.loggedInUser);
    console.log('whaddup1');
    const loggedInEmployee = this.loggedInUser;
    if(loggedInEmployee.Id === this.employee.Id && !this.isDepartmentChief){
      for(let absence of this.absencesToApprove){
        absence.IsLockedByEmployee = true;
        this.absenceService.put(absence).subscribe();
      }
    }
    else if(loggedInEmployee.EmployeeRole === EmployeeRole.Afdelingsleder
      && loggedInEmployee.Department.Id === this.employee.Department.Id){
      for(let absence of this.absencesToApprove){
        absence.IsLockedByEmployee = true;
        absence.IsLockedByChief = true;
        this.absenceService.put(absence).subscribe();
      }
    }
    else if(loggedInEmployee.EmployeeRole === EmployeeRole.Administrator){
      for(let absence of this.absencesToApprove){
        absence.IsLockedByEmployee = true;
        absence.IsLockedByChief = true;
        absence.IsLockedByAdmin = true;
        this.absenceService.put(absence).subscribe();
      }
    }
    this.emitter.emit();

  }

  /**
   * Unlocks all absences in the current month
   */
  reopenMonth(){
    const loggedInEmployee = this.loggedInUser;
    if(loggedInEmployee.EmployeeRole === EmployeeRole.Administrator){
      for(let absence of this.absencesToApprove){
        absence.IsLockedByEmployee = false;
        absence.IsLockedByChief = false;
        absence.IsLockedByAdmin = false;
        this.absenceService.put(absence).subscribe();
      }
    }
    this.emitterToReopen.emit();
  }


}
