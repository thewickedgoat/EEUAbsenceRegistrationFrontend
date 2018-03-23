import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';

@Component({
  selector: 'app-administration-view',
  templateUrl: './administration-view.component.html',
  styleUrls: ['./administration-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationViewComponent implements OnInit {

  @Input()
  currentHolidayYearSpec: HolidayYearSpec;

  constructor() { }

  ngOnInit() {
  }

}
