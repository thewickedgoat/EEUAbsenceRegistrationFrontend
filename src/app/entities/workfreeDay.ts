import {Employee} from './employee';
import {WorkFreedayType} from './workFreedayType.enum';

export class WorkfreeDay {
  Id?: number;
  Date: Date;
  Name?: string;
  Employee: Employee;
  Type: WorkFreedayType;
}
