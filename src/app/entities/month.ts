import {Absence} from './absence';
import {Employee} from './employee';

export class Month{
  Id?: number;
  MonthDate: Date;
  AbsencesInMonth?: Absence[];
  Employee: Employee;
  IsLockedByEmployee: boolean;
  IsLockedByChief: boolean;
  IsLockedByCEO: boolean;
  IsLockedByAdmin: boolean;
}
