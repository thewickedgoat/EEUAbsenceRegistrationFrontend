import {EmployeeRole} from './employeeRole.enum';
import {Department} from './department';
import {HolidayYear} from './HolidayYear';
import {WorkfreeDay} from './workfreeDay';
export class Employee {
  Id?: number;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  Password: string;
  HolidayYears?: HolidayYear[];
  Department: Department;
  EmployeeRole: EmployeeRole;
  WorkfreeDays?: WorkfreeDay[];
  Note?: string;
}





