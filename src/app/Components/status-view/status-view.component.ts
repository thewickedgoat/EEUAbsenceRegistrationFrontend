import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Status} from '../../entities/status';

@Component({
  selector: 'app-status-view',
  templateUrl: './status-view.component.html',
  styleUrls: ['./status-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusViewComponent implements OnInit {

  status: Status;
  @Input()
  statusList: Status[];

  @Output()
  emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  setStatus(status){
    this.emitter.emit(status)
  }

}
