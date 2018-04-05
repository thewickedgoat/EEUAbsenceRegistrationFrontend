import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {PublicHoliday} from '../../../entities/publicholiday';

@Component({
  selector: 'app-public-holiday',
  templateUrl: './public-holiday.component.html',
  styleUrls: ['./public-holiday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicHolidayComponent implements OnInit {


  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  publicHolidays: PublicHoliday[];

  @Output()
  emitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.publicHolidays = this.currentHolidayYearSpec.PublicHolidays;
  }

  ngOnChanges(){
    this.publicHolidays = this.currentHolidayYearSpec.PublicHolidays;
  }

  createPublicHoliday(){
    this.emitter.emit()
  }

}
