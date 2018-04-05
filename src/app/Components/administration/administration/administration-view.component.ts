import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-administration-view',
  templateUrl: './administration-view.component.html',
  styleUrls: ['./administration-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationViewComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;
  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;
  @Input()
  employees: Employee[];
  @Output()
  emitter = new EventEmitter();
  constructor() { }

  ngOnInit() {
    console.log(this.employees);
  }

  updateView(){
    this.emitter.emit()
  }
}
