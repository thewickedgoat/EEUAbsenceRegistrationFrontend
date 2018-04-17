import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';
import {WorkfreedaysCreateViewComponent} from '../workfreedays-create-view/workfreedays-create-view.component';
import {MatDialog} from '@angular/material';
import {WorkfreedayCreateErrorComponent} from '../../Errors/workfreeday-create-error/workfreeday-create-error.component';
import {Absence} from '../../../entities/absence';
import {WorkfreedayService} from '../../../services/workfreeday.service';
import {Router} from '@angular/router';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {WorkfreeDay} from '../../../entities/workfreeDay';


@Component({
  selector: 'app-workfreeday',
  templateUrl: './workfreeday.component.html',
  styleUrls: ['./workfreeday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedayComponent implements OnInit {

  currentHolidayYearSpec: HolidayYearSpec = null;
  holidayYearSpecs: HolidayYearSpec[];
  currentWorkfreeDayList: WorkfreeDay[] = [];
  currentIndex: number;

  @Input()
  employee: Employee;

  @Output()
  emitter = new EventEmitter();

  constructor( private dialog: MatDialog,
               private router: Router,
               private holidayYearSpecService: HolidayYearSpecService,
               private workfreedayService: WorkfreedayService) {
  }

  ngOnInit() {
    console.log("diller");
    console.log(this.currentHolidayYearSpec);
    if(this.currentHolidayYearSpec === null) {
      this.getHolidayYearSpec();
      this.formatWorkfreeDays();
      console.log(this.employee.WorkfreeDays);
    }
  }

  ngOnChanges(){
    console.log('damnit ryan');
    console.log(this.currentHolidayYearSpec);
    if(this.currentHolidayYearSpec != null){
      this.formatWorkfreeDays();
      this.selectHolidayYearSpec(this.currentIndex);
    }
    console.log(this.employee.WorkfreeDays);
  }

  delete(){

  }

  edit(){

  }

  selectHolidayYearSpec(id: number){
    if(this.employee.WorkfreeDays != null) {
      this.currentWorkfreeDayList = [];
      let index = +id;
      console.log(index);
      this.currentHolidayYearSpec = this.holidayYearSpecs.find(x => x.Id === index);
      this.formatHolidayYearStartEnd(this.currentHolidayYearSpec);
      const startDate = this.currentHolidayYearSpec.StartDate;
      const endDate = this.currentHolidayYearSpec.EndDate;
      this.currentWorkfreeDayList = this.employee.WorkfreeDays.filter(x => x.Date >= startDate && x.Date <= endDate);
      this.currentIndex = index;
      console.log('nani?!');
    }
  }

  getHolidayYearSpec(){
    this.holidayYearSpecService.getAll().subscribe(hys => {
      this.holidayYearSpecs = hys;
    })
  }

  formatWorkfreeDays(){
    if(this.employee.WorkfreeDays != null) {
      for (let workfreeDay of this.employee.WorkfreeDays) {
        const dateToFormat = workfreeDay.Date.toString();
        const date = new Date(Date.parse(dateToFormat));
        workfreeDay.Date = date;
      }
    }
  }

  formatHolidayYearStartEnd(holidayYearSpec: HolidayYearSpec){
    const startDateToParse = holidayYearSpec.StartDate.toString();
    const endDateToParse = holidayYearSpec.EndDate.toString();
    const startDate = new Date(Date.parse(startDateToParse));
    const endDate = new Date(Date.parse(endDateToParse));
    holidayYearSpec.StartDate = startDate;
    holidayYearSpec.EndDate = endDate;
  }

  formatAbsenceDates(employee: Employee){
    let absencesInEmployee = [];
    const currentHolidayYear = employee.HolidayYears.find(x => x.CurrentHolidayYear.Id === this.currentHolidayYearSpec.Id);
    if(currentHolidayYear != null){
      if(currentHolidayYear.Months.length > 0){
        for(let month of currentHolidayYear.Months){
          if(month.AbsencesInMonth.length > 0){
            for(let absence of month.AbsencesInMonth){
              const dateToFormat = absence.Date.toString();
              const date = new Date(Date.parse(dateToFormat));
              absence.Date = date;
              absencesInEmployee.push(absence);
            }
          }
        }
      }
      return absencesInEmployee;
    }
  }

  create(selectedEmployee: Employee){
    let workfreeDays = [];
    console.log('sss');
    console.log(this.employee);
    if(selectedEmployee != null){
      let dialogRef = this.dialog.open(WorkfreedaysCreateViewComponent, {
        data: {
          employee: selectedEmployee
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        workfreeDays = result;
        if(workfreeDays.length > 0){
          const workfreeDaysNotInRange = this.workfreedaysNotInRange(workfreeDays);
          const absenceDaysToList = this.getOverlappingAbsences(selectedEmployee, workfreeDays);
          const overlappingWorkfreeDays = this.getOverlappingWorkfreeDays(workfreeDays);
          if(workfreeDaysNotInRange.length > 0){
            this.workfreeDayError(selectedEmployee, null,null, null, workfreeDaysNotInRange);
            return;
          }
          else{
            if(absenceDaysToList.length > 0){
              this.workfreeDayError(selectedEmployee, null,null, absenceDaysToList, null);
              return;
            }
            else if(overlappingWorkfreeDays.length > 0){
              this.workfreeDayError(selectedEmployee, workfreeDays, overlappingWorkfreeDays, null, null);
              this.updateView();
              return;
            }
            else{
              console.log('1');
              console.log(this.employee);
              this.workfreedayService.postList(workfreeDays).subscribe(wfd => {
                console.log(this.employee);
                console.log(wfd);
                console.log('2');
                this.updateView();
              });
            }
          }
        }
        else return;
      });
    }
  }

  getOverlappingWorkfreeDays(workfreeDays: WorkfreeDay[]){
    let overlappingWorkfreeDays = [];
    if(workfreeDays.length > 0){
      for(let workfreeDay of workfreeDays){
        const overlappingWorkfreeDay = this.currentWorkfreeDayList.find(x => x.Date.getFullYear() === workfreeDay.Date.getFullYear()
          && x.Date.getMonth() === workfreeDay.Date.getMonth() && x.Date.getDate() === workfreeDay.Date.getDate());
        if(overlappingWorkfreeDay != null){
          overlappingWorkfreeDays.push(overlappingWorkfreeDay)
        }
      }
    }
    return overlappingWorkfreeDays;
  }

  getOverlappingAbsences(selectedEmployee: Employee, workfreeDays: WorkfreeDay[]){
    const absencesInEmployee = this.formatAbsenceDates(selectedEmployee);
    const absenceDaysToList = [];
    for(let workfreeDay of workfreeDays){
      const absenceOnWorkfreeDay = absencesInEmployee.find(x => x.Date.getFullYear() === workfreeDay.Date.getFullYear()
        && x.Date.getMonth() === workfreeDay.Date.getMonth() && x.Date.getDate() === workfreeDay.Date.getDate());
      if(absenceOnWorkfreeDay != null){
        absenceDaysToList.push(absenceOnWorkfreeDay);
      }
    }
    return absenceDaysToList;
  }

  async createWorkfreeDays(workfreeDays: WorkfreeDay[]){
    console.log('toast');
  }

  workfreedaysNotInRange(workfreeDays: WorkfreeDay[]){
    const workfreeDaysNotInRange = [];
    if(workfreeDays.length > 0){
      const endDate = this.currentHolidayYearSpec.EndDate;
      for(let workfreeDay of workfreeDays){
        const workfreeDayNotInRange = workfreeDays.find(x=> x.Date > endDate);
        if(workfreeDayNotInRange != null){
          workfreeDaysNotInRange.push(workfreeDayNotInRange);
        }
      }
    }
    return workfreeDaysNotInRange;
  }

  workfreeDayError(selectedEmployee: Employee, workfreeDays?: WorkfreeDay[],  overlappingWorkfreeDays?: WorkfreeDay[], absences?: Absence[], workfreeDaysNotInRange?: WorkfreeDay[]){
    if(overlappingWorkfreeDays === null && absences != null && workfreeDaysNotInRange === null){
      const date = absences[0].Date;
      let dialogRef = this.dialog.open(WorkfreedayCreateErrorComponent, {
        data: {
          errorMessage: 'Der blev fundet dage med fraværskoder overløbende med en eller flere af de arbejdsfridage.',
          errorHandleMessage: 'Vil du gå til måneden for den første dato?',
          objects: absences,
          isAbsence: true
        },
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          const year = date.getFullYear();
          const month = date.getMonth();
          this.router.navigate(['calendar/' + selectedEmployee.Id + '/' + year + '/' + month]);
          this.updateView();
        }
        else return;
      });
    }
    else if(overlappingWorkfreeDays != null && absences === null && workfreeDaysNotInRange === null){
      let dialogRef = this.dialog.open(WorkfreedayCreateErrorComponent, {
        data: {
          errorMessage: 'Der blev fundet arbejdsfridage som allerede er oprettet.',
          errorHandleMessage: 'Vil slette dem og oprette de nye?',
          objects: overlappingWorkfreeDays,
          isAbsence: false
        },
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.deleteWorkfreeDays(overlappingWorkfreeDays);
          this.createWorkfreeDays(workfreeDays);
        }
        else return;
      });
    }
    else if(overlappingWorkfreeDays === null && absences === null && workfreeDaysNotInRange != null){
      let dialogRef = this.dialog.open(WorkfreedayCreateErrorComponent, {
        data: {
          errorMessage: 'Nogle af de angivne arbejdsfridage indgår ikke i det valgte ferieår.',
          errorHandleMessage: 'Det nuværende ferieår starter: ' + '"' + this.currentHolidayYearSpec.StartDate
          + '"' + 'og slutter: ' + '"' + this.currentHolidayYearSpec.EndDate + '"' + 'Prøv igen.',
          objects: workfreeDaysNotInRange,
          isAbsence: false
        },
        width: '400px'
      });
      dialogRef.afterClosed().subscribe(result => {
        return;
      });
    }
  }

  deleteWorkfreeDays(workfreeDaysToBeDeleted: WorkfreeDay[]){
    for(let workfreeDay of workfreeDaysToBeDeleted){
      this.workfreedayService.delete(workfreeDay.Id).subscribe(res => {

      });
    }
    return;
  }

  updateView(){
    this.emitter.emit();
  }
}
