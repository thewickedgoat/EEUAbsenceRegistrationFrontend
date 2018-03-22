import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {WorkfreeDay} from '../../../entities/workfreeDay';

@Component({
  selector: 'app-public-holiday',
  templateUrl: './public-holiday.component.html',
  styleUrls: ['./public-holiday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicHolidayComponent implements OnInit {

  @Input()
  publicHolidays: WorkfreeDay[];

  constructor() { }

  ngOnInit() {
  }

}
