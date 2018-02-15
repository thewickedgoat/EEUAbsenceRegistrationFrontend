import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Status} from '../../entities/status';
import {StatusService} from '../../services/status.service';

@Component({
  selector: 'app-status-controller',
  templateUrl: './status-controller.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StatusControllerComponent implements OnInit {

  statusList: Status[];

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
    console.log(status);
    this.emitter.emit(status);
  }
}
