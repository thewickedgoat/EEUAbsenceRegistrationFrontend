import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {PublicHoliday} from '../../../entities/publicholiday';

@Component({
  selector: 'app-public-holiday-view',
  templateUrl: './public-holiday-view.component.html',
  styleUrls: ['./public-holiday-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicHolidayViewComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  publicHolidays: PublicHoliday[] = [];

  @Output()
  emitter = new EventEmitter();
  @Output()
  deleteEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
    if(this.currentHolidayYearSpec){
      this.publicHolidays = this.currentHolidayYearSpec.PublicHolidays;
    }
  }

  ngOnChanges(){
    if(this.currentHolidayYearSpec){
      this.publicHolidays = this.currentHolidayYearSpec.PublicHolidays;
    }
  }



  createPublicHoliday(){
    this.emitter.emit()
  }

  delete(id: number){
    this.deleteEmitter.emit(id);
  }

}
