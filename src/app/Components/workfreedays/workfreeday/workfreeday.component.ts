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

  currentHolidayYearSpec: HolidayYearSpec;
  holidayYearSpecs: HolidayYearSpec[];
  currentWorkfreeDayList: WorkfreeDay[] = [];

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
    this.getHolidayYearSpec();
    this.formatWorkfreeDays();
  }

  ngOnChanges()
  {
    console.log('nanie?!?')
  }

  delete(){

  }

  edit(){

  }

  selectHolidayYearSpec(id: number){
    let index = +id;
    this.currentHolidayYearSpec = this.holidayYearSpecs.find(x => x.Id === index);
    this.formatHolidayYearStartEnd(this.currentHolidayYearSpec);
    const startDate = this.currentHolidayYearSpec.StartDate;
    const endDate = this.currentHolidayYearSpec.EndDate;
    this.currentWorkfreeDayList = this.employee.WorkfreeDays.filter(x => x.Date >= startDate && x.Date <= endDate);
    console.log(this.currentWorkfreeDayList);
  }

  getHolidayYearSpec(){
    this.holidayYearSpecService.getAll().subscribe(hys => {
      this.holidayYearSpecs = hys;
    })
  }

  formatWorkfreeDays(){
    for(let workfreeDay of this.employee.WorkfreeDays){
      const dateToFormat = workfreeDay.Date.toString();
      const date = new Date(Date.parse(dateToFormat));
      workfreeDay.Date = date;
    }
  }

  formatHolidayYearStartEnd(holidayYearSpec: HolidayYearSpec){
    console.log(holidayYearSpec.StartDate);
    const startDateToParse = holidayYearSpec.StartDate.toString();
    const endDateToParse = holidayYearSpec.EndDate.toString();
    const startDate = new Date(Date.parse(startDateToParse));
    const endDate = new Date(Date.parse(endDateToParse));
    holidayYearSpec.StartDate = startDate;
    holidayYearSpec.EndDate = endDate;
    console.log(holidayYearSpec.StartDate);
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
    let workfreeDays;
    if(selectedEmployee != null){
      let dialogRef = this.dialog.open(WorkfreedaysCreateViewComponent, {
        data: {
          employee: selectedEmployee
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        workfreeDays = result;
        if(workfreeDays != null){
          const absencesInEmployee = this.formatAbsenceDates(selectedEmployee);
          const absenceDaysToList = [];
          for(let workfreeDay of workfreeDays){
            const absenceOnWorkfreeDay = absencesInEmployee.find(x => x.Date.getFullYear() === workfreeDay.Date.getFullYear()
              && x.Date.getMonth() === workfreeDay.Date.getMonth() && x.Date.getDate() === workfreeDay.Date.getDate());
            if(absenceOnWorkfreeDay != null){
              absenceDaysToList.push(absenceOnWorkfreeDay);
            }
          }
          if(absenceDaysToList.length > 0){
            this.workfreeDayError(absenceDaysToList, selectedEmployee);
            return;
          }
          else{
            this.createWorkfreeDays(workfreeDays);
          }
        }
        else return;
      });
    }
  }

  createWorkfreeDays(workfreeDays: WorkfreeDay[]){
    this.workfreedayService.postList(workfreeDays).subscribe(wfd => {
      for(let workfreeDay of workfreeDays){
        this.currentWorkfreeDayList.push(workfreeDay);
        console.log(this.currentWorkfreeDayList)
      }
      this.updateView();
    });
  }

  workfreeDayError(absences: Absence[], selectedEmployee: Employee){
    const date = absences[0].Date;
    let dialogRef = this.dialog.open(WorkfreedayCreateErrorComponent, {
      data: {
        errorMessage: 'Der blev fundet dage med fraværskoder overløbende med en eller flere af de arbejdsfridage.',
        errorHandleMessage: 'Vil du gå til måneden for den første dato?',
        absences: absences
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
    });
  }

  updateView(){
    this.emitter.emit();
  }
}
