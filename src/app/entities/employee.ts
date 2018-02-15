import {EmployeeRole} from './employeeRole.enum';
import {Department} from './department';
import {HolidayYear} from './HolidayYear';
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
}





