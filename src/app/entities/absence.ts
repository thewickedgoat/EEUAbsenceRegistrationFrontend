import {Employee} from './employee';
import {Status} from './status.enum';


export class Absence {
  Id?: number;
  Employee: Employee;
  Date: Date;
  Status: Status;
  IsLockedByEmployee?: boolean;
  IsLockedByChief?: boolean;
  IsLockedByAdmin?: boolean;
}
