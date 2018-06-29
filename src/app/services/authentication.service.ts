import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Employee} from '../entities/employee';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const url = environment.apiEndPoint + 'Account';
const tokenEndpoint = environment.tokenEndpoint;

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  getToken(){
    return JSON.parse(sessionStorage.getItem('token'));
  }

  delete(id): Observable<any>{
    return this.http.delete<any>(url + '/' + 'Remove' + '/' + id,{headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())})
  }

  logout(employee: Employee): Observable<any>{
    sessionStorage.setItem('token', null);
    sessionStorage.setItem('currentEmployee', null);
    console.log(this.getToken());
    return this.http.post<any>(url + '/' + 'Logout', employee);

  }

  login(username, password): Observable<string>{
    const requestString = "grant_type=password&username=" + username + "&password=" + password;
    console.log(sessionStorage.getItem('token'));
    return this.http.post<string>(tokenEndpoint, requestString);

  }

  register(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(url + '/' + 'Register', employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  update(employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(url + '/' + 'Update', employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }
}
