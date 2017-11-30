import {Absence} from './absence';
import {EmployeeRole} from './employeeRole.enum';
import {Department} from './department';
export class Employee {
  Id?: number;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  Password: string;
  Absences?: Absence[];
  Department?: Department;
  EmployeeRole?: EmployeeRole;
}





