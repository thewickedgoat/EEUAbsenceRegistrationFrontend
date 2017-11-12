import { Injectable } from '@angular/core';
import {User} from '../entities/user';
import {Absence} from '../entities/absence';
import {Role} from '../entities/role.enum';
import {Department} from '../entities/department';
import {Status} from '../entities/status.enum';

@Injectable()
export class UserService {
  users: User[];

  constructor() {
    this.users = [
      {id: 1, firstName: 'AyyLmao', lastName: '420blazeit', email: '420@blazeit.com', password: 'password',
        absences: Absence[], role: Role.administrator, department: Department[]}
    ];
  }

  getById(id: Number){
  return this.users.find(user => user.id === id);
  }

  getAll(){
    return this.users;
  }
}
