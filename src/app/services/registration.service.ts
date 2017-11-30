import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Employee} from '../entities/employee';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'account';

@Injectable()
export class RegistrationService {


  constructor(private http: HttpClient) { }

  registerEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(url + '/register', employee);
  }

}
