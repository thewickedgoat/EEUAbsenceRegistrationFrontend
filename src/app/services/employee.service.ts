import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Employee} from '../entities/employee';
import {environment} from '../../environments/environment';



const url = environment.apiEndPoint + 'employee';

@Injectable()
export class EmployeeService {

  private jwt () {
    const token = sessionStorage.getItem('token').slice(1, -1);;
    console.log(token);
    if(token) {
      return token;
}
  }

  constructor(private http: HttpClient) {
  }
  post(employee: Employee): Observable<Employee> {
    let headers = new Headers();

    return this.http.post<Employee>(url, employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + this.jwt())});
  }

  getById(id: number): Observable<Employee>{
    return this.http.get<Employee>(url + '/' + id);
  }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id);
  }

  getEmployeeLoggedIn(){
    return !!sessionStorage.getItem('token');
  }

  logoutEmployee(){
    sessionStorage.setItem('token', null);
  }

  loginEmployee(employee: Employee): Observable<string>{
    const requestString = "grant_type=password&username=" + employee.UserName + " &password=" + employee.Password;
    sessionStorage.setItem('currentEmployee', JSON.stringify(employee));
    return this.http.post<string>('http://localhost:51017/token', requestString);

  }




}
