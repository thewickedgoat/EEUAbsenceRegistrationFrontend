import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Employee} from '../entities/employee';
import {environment} from '../../environments/environment';



const url = environment.apiEndPoint + 'employee';
const jwt = environment.jwt();

@Injectable()
export class EmployeeService {

  constructor(private http: HttpClient) {
  }
  post(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(url, employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(url + '/' + employee.Id, employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<Employee>{
    return this.http.get<Employee>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }




}
