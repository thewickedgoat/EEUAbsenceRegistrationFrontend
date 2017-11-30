import {Employee} from './employee';
import {Status} from './status.enum';


export class Absence {
  Id: Number;
  Employee: Employee;
  Date: Date;
  Status: Status;
}
