import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Status} from '../../entities/status';
import {StatusService} from '../../services/status.service';

@Component({
  selector: 'app-status-controller',
  templateUrl: './status-controller.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StatusControllerComponent implements OnInit {

  statusList: Status[];

  @Input()
  isLockedForEdit: boolean;
  @Output()
  emitter = new EventEmitter();

  constructor(private statusService: StatusService) { }

  ngOnInit() {
    this.importStatuses();
  }

  importStatuses(){
    this.statusService.getAll().subscribe(statuses => this.statusList = statuses);
  }

  setStatus(status){
    if(status != null){
      this.emitter.emit(status);
    }
    else  {
      this.emitter.emit(null);
    }

  }
}
