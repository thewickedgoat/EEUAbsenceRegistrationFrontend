import {HolidayYear} from './HolidayYear';
import {WorkfreeDay} from './workfreeDay';

export class HolidayYearSpec {
  Id?: number;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  HolidayYears: HolidayYear[];
  PublicHolidays?: WorkfreeDay[];
}
