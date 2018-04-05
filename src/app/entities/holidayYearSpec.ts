import {HolidayYear} from './HolidayYear';
import {WorkfreeDay} from './workfreeDay';
import {PublicHoliday} from './publicholiday';

export class HolidayYearSpec {
  Id?: number;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  HolidayYears: HolidayYear[];
  PublicHolidays?: PublicHoliday[];
}
