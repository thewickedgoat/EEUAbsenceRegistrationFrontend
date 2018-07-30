import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Status} from '../../../entities/status';
import {StatusService} from '../../../services/status.service';
import {MatDialog} from '@angular/material';
import {StatusCreateComponent} from '../status-create/status-create.component';
import {AbsenceService} from '../../../services/absence.service';
import {Absence} from '../../../entities/absence';
import {UniversalErrorCatcherComponent} from '../../Errors/universal-error-catcher/universal-error-catcher.component';
import {StatusDeleteComponent} from '../status-delete/status-delete.component';

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusListComponent implements OnInit {

  statusList: Status[];
  absences: Absence[];

  constructor(private statusService: StatusService,
              private absenceService: AbsenceService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.initData();
    this.absenceService.getAll().subscribe( absences => {
      this.absences = absences;
    });
  }


  initData(){
    this.statusService.getAll().subscribe(statuses => {
      statuses.sort(this.sortStatusList);
      this.statusList = statuses;
    });
  }

  sortStatusList(a: Status, b: Status) {
    let statusNameA = a.StatusName.toLowerCase();
    let statusNameB = b.StatusName.toLowerCase();
    return statusNameA > statusNameB ? 1 : (statusNameA < statusNameB ? -1 : 0);
  }


  disableStatus(status: Status){
    status.IsDisabled = true;
    this.statusService.put(status).subscribe(() =>{

    });
  }

  activateStatus(status: Status){
    status.IsDisabled = false;
    this.statusService.put(status).subscribe(() =>{

    });
  }

  createStatus(){
    let dialogRef = this.dialog.open(StatusCreateComponent, {
      data: {
        statusList: this.statusList
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
        this.statusService.post(result).subscribe(() => this.initData());
      }
      else return;
    });
  }

  deleteStatus(status: Status){
    let absenceWithStatus = this.absences.find(x => x.Status.Id === status.Id);
    if(absenceWithStatus){
      let dialogRef = this.dialog.open(UniversalErrorCatcherComponent, {
        data: {
          errorMessage: '  Denne fraværskode er i brug og kan derfor ikke slettes.  ',
          errorHandler: '  Deaktiver fraværskoden i stedet.',
          multipleOptions: false
        }
      });
    }
    else {
      let dialogRef = this.dialog.open(StatusDeleteComponent);
      dialogRef.afterClosed().subscribe(result => {
        if(result === true){
          this.statusService.delete(status.Id).subscribe(() => {
            this.initData();
          });
        }
        else return;
      });
    }
  }
}
