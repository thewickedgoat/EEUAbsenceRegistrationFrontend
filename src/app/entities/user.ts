import {Month} from './month';
import {Absence} from './absence';
import {Role} from './role.enum';
import {Department} from './department';
export class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  months: Month[];
  absences: Absence[];
  role: Role;
  department: Department;
}
