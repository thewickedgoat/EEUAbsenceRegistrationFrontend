import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Employee} from '../entities/Employee';
import {environment} from '../../environments/environment';



const url = environment.apiEndPoint + 'employee/';

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient) {
  }
  post(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(url + 'Post', employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(url + 'Put' + '/' + employee.Id, employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<Employee>{
    return this.http.get<Employee>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});

  }




}
