import {HolidayYear} from './HolidayYear';
import {PublicHoliday} from './publicholiday';

export class HolidayYearSpec {
  Id?: number;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  HolidayYears: HolidayYear[];
  PublicHolidays?: PublicHoliday[];
}
