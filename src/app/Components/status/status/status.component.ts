import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Status} from '../../../entities/status';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusComponent implements OnInit {

  @Input()
  status: Status;

  constructor() { }

  ngOnInit() {
  }

}
