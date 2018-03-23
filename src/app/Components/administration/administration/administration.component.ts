import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {HolidayYearSpecService} from '../../../services/holidayyearspec.service';
import {HolidayYearSpec} from '../../../entities/holidayYearSpec';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationComponent implements OnInit {

  currentHolidayYearSpec: HolidayYearSpec;

  constructor(private holidayYearSpecService: HolidayYearSpecService) { }

  ngOnInit() {
    this.getCurrentHolidayYear();
  }


  getCurrentHolidayYear(){
    const currentDate = new Date();
    this.holidayYearSpecService.getAll().subscribe(holidayYearsSpecs => {
      const formatedHolidayYearsSpecs = this.formatHolidayYearDates(holidayYearsSpecs);
      const currentHolidayYearSpec = formatedHolidayYearsSpecs.find(x => x.StartDate <= currentDate && x.EndDate >= currentDate);
      console.log(currentHolidayYearSpec);
      this.currentHolidayYearSpec = currentHolidayYearSpec;
    })
  }

  formatHolidayYearDates(holidayYearsSpecs: HolidayYearSpec[]){
    for(let holidayYearSpec of holidayYearsSpecs){
      const startDateToParse = holidayYearSpec.StartDate.toString();
      const endDateToParse = holidayYearSpec.EndDate.toString();
      const startDate = new Date(Date.parse(startDateToParse));
      const endDate = new Date(Date.parse(endDateToParse));
      holidayYearSpec.StartDate = startDate;
      holidayYearSpec.EndDate = endDate;
    }
    return holidayYearsSpecs;
  }


}
