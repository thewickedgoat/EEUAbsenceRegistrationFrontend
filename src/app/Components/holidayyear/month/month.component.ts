import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterEvent} from '@angular/router';
import {Department} from '../../../entities/department';
import {DepartmentService} from '../../../services/department.service';
import {EmployeeService} from '../../../services/employee.service';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MonthComponent implements OnInit {

  monthNames = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

  employees: Employee[];
  departments: Department[];

  currentMonth: Date;
  holidayYearStart: Date;
  holidayYearEnd: Date;

  absencesForApprovalByEmployee: number[];
  absencesForApprovalByChief: number[];
  absencesForApprovalByAdmin: number[];

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService, private departmentService: DepartmentService) { }

  ngOnInit() {
    this.currentMonth = new Date();
    this.absencesForApprovalByEmployee = new Array<number>();
    this.absencesForApprovalByChief = new Array<number>();
    this.absencesForApprovalByAdmin = new Array<number>();
    this.employeeService.getAll().subscribe(employees => {
      this.employees = employees;
      //this.getAbsencesInCurrentMonth();
      this.initMonth();
    });
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
      console.log(departments)
    });

  }

  /**
   * goes without saying
   */
  initMonth(){
    this.route.paramMap.subscribe(params => {
      this.getHolidayyearAndMonth(+params.get('month'), +params.get('yearStart'), +params.get('yearEnd'));
      //this.absenceApprovedByEmployee();
      //this.absenceApprovedByChief();
      //this.absenceApprovedByAdmin();
    });
  }

  /**
   * Calculates the holidayyear start and end dates plus their months
   * @param month
   * @param yearStart
   * @param yearEnd
   */
  getHolidayyearAndMonth(month: number, yearStart: number, yearEnd: number) {
    let holidayYearStart = new Date();
    const may = 4;
    const firstDayOfMay = 1;
    holidayYearStart.setFullYear(yearStart);
    holidayYearStart.setMonth(may);
    holidayYearStart.setDate(firstDayOfMay);
    this.holidayYearStart = holidayYearStart;

    let holidayYearEnd = new Date();
    const april = 3;
    const lastDayOfApril = 30;
    holidayYearEnd.setFullYear(yearEnd);
    holidayYearEnd.setMonth(april);
    holidayYearEnd.setDate(lastDayOfApril);
    this.holidayYearEnd = holidayYearEnd;

    if(month >= may){
      this.currentMonth.setFullYear(yearStart);
      this.currentMonth.setMonth(month);
    }
    else if(month <= april){
      this.currentMonth.setFullYear(yearEnd);
      this.currentMonth.setMonth(month);
    }
  }

  /**
   * Page navigation
   * @param id
   */
  goToCurrentMonth(id: number){
    this.router.navigateByUrl('calendar/' + id + '/' + this.currentMonth.getFullYear() + '/' + this.currentMonth.getMonth())
  }

  /**
   * Checks if the current month has approval from the employee
   *
  absenceApprovedByEmployee(){
    const approved = 1;
    const notApproved = 0;
    for(let employee of this.employees)
    {
      const absences = employee.Absences;
      let absencesInMonth = new Array<Absence>();
        for(let absence of absences)
        {
          if(absences.length === 0){
            this.absencesForApprovalByEmployee.push(notApproved);
            break;
          }
          else {
            if(absence.Date.getFullYear() === this.currentMonth.getFullYear()
              && absence.Date.getMonth() === this.currentMonth.getMonth()
              && absencesInMonth.length === 0)
            {
              absencesInMonth.push(absence);
              break;
            }
          }
        }
        if(absencesInMonth.length === 0)
        {
          this.absencesForApprovalByEmployee.push(notApproved);
        }
        else if(absencesInMonth.length != 0 && absencesInMonth[0].IsLockedByEmployee === true)
        {
          this.absencesForApprovalByEmployee.push(approved);
        }
        else {
          this.absencesForApprovalByEmployee.push(notApproved);
        }
    }
  }*/

  /**
   * Checks if the current month has approval from the departmentChief
   *
  absenceApprovedByChief(){
    const approved = 1;
    const notApproved = 0;
    for(let employee of this.employees)
    {
      const absences = employee.Absences;
      let absencesInMonth = new Array<Absence>();
      for(let absence of absences)
      {
        if(absences.length === 0){
          this.absencesForApprovalByChief.push(notApproved);
          break;
        }
        else {
          if(absence.Date.getFullYear() === this.currentMonth.getFullYear()
            && absence.Date.getMonth() === this.currentMonth.getMonth()
            && absencesInMonth.length === 0)
          {
            absencesInMonth.push(absence);
            break;
          }
        }
      }
      if(absencesInMonth.length === 0)
      {
        this.absencesForApprovalByChief.push(notApproved);
      }
      else if(absencesInMonth.length != 0 && absencesInMonth[0].IsLockedByChief === true)
      {
        this.absencesForApprovalByChief.push(approved);
      }
      else {
        this.absencesForApprovalByChief.push(notApproved);
      }
    }
  }*/

  /**
   * Checks if the current month has approval from the admin
   *
  absenceApprovedByAdmin(){
    const approved = 1;
    const notApproved = 0;
    for(let employee of this.employees)
    {
      const absences = employee.Absences;
      let absencesInMonth = new Array<Absence>();
      for(let absence of absences)
      {
        if(absences.length === 0){
          this.absencesForApprovalByAdmin.push(notApproved);
          break;
        }
        else {
          if(absence.Date.getFullYear() === this.currentMonth.getFullYear()
            && absence.Date.getMonth() === this.currentMonth.getMonth()
            && absencesInMonth.length === 0)
          {
            absencesInMonth.push(absence);
            break;
          }
        }
      }
      if(absencesInMonth.length === 0)
      {
        this.absencesForApprovalByAdmin.push(notApproved);
      }
      else if(absencesInMonth.length != 0 && absencesInMonth[0].IsLockedByAdmin === true)
      {
        this.absencesForApprovalByAdmin.push(approved);
      }
      else {
        this.absencesForApprovalByAdmin.push(notApproved);
      }
    }
  }*/

  /**
   * Helper method for formatting datetimes from the restAPI that doesn't play nicely with the typescript date object
   *
  getAbsencesInCurrentMonth() {
    for(let employee of this.employees){
      if (employee.Absences != null) {
        for (let absence of employee.Absences) {
          const absenceToAdd = absence.Date.toString();
          const date = new Date(Date.parse(absenceToAdd));
          absence.Date = date;
        }
      }
    }
  }*/

}
