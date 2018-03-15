import {Month} from './month';
import {Employee} from './employee';

export class HolidayYear{
  Id: number;
  Name: string;
  StartDate: Date;
  EndDate: Date;
  Months: Month[];
  Employee: Employee;
  IsClosed: boolean;
  HolidayAvailable: number;
  HolidayFreedayAvailable: number;
  HolidaysUsed: number;
  HolidayFreedaysUsed: number;
  HolidayTransfered: number;
}
