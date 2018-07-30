import {Status} from './status';
import {Month} from './month';


export class Absence {
  Id?: number;
  Date: Date;
  Status: Status;
  Month?: Month;
  IsLockedByEmployee: boolean;
  IsLockedByChief: boolean;
  IsLockedByCEO: boolean;
  IsLockedByAdmin: boolean;
}
