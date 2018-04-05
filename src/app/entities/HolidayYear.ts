import {Month} from './month';
import {Employee} from './employee';
import {HolidayYearSpec} from './holidayYearSpec';

export class HolidayYear{
  Id?: number;
  CurrentHolidayYear?: HolidayYearSpec;
  Months?: Month[];
  Employee: Employee;
  IsClosed: boolean;
  HolidayAvailable: number;
  HolidayFreedayAvailable: number;
  HolidaysUsed: number;
  HolidayFreedaysUsed: number;
  HolidayTransfered: number;
}
