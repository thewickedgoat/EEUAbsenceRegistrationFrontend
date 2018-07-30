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
    this.statusService.getAll().subscribe(statuses => {
      const activeStatuses = statuses.filter(x => x.IsDisabled === false);
      this.statusList = activeStatuses;
    });
  }

  /**
   * Sets the selected status
   * @param status
   */
  setStatus(status){
    if(status != null && status != true && status != false){
      console.log('test');
      this.emitter.emit(status);
    }
    else  {
      this.emitter.emit(null);
    }
    if(status === true){
      this.emitter.emit(true);
    }
    if(status === false){
      this.emitter.emit(false);
    }
  }

}
