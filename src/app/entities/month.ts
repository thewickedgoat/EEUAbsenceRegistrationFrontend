import {Absence} from './absence';
import {HolidayYear} from './HolidayYear';

export class Month{
  Id?: number;
  MonthDate: Date;
  AbsencesInMonth?: Absence[];
  HolidayYear: HolidayYear;
  IsLockedByEmployee: boolean;
  IsLockedByChief: boolean;
  IsLockedByCEO: boolean;
  IsLockedByAdmin: boolean;
}
