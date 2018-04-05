import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';

@Component({
  selector: 'app-holidayyear-administration',
  templateUrl: './holidayyear-administration.component.html',
  styleUrls: ['./holidayyear-administration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearAdministrationComponent implements OnInit {

  holidayYearSpecs: HolidayYearSpec[];
  currentHolidayYearSpec: HolidayYearSpec;

  constructor(private holidayYearSpecService: HolidayYearSpecService) { }

  ngOnInit() {
    this.initData();
  }

  initData(){
    this.getHolidayYearSpecs();
  }

  getHolidayYearSpecs(){
    this.holidayYearSpecService.getAll().subscribe(holidayYearSpecs => {
      this.holidayYearSpecs = holidayYearSpecs;
      return;
    })
  }
}
