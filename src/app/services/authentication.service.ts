import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Employee} from '../entities/employee';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const url = environment.apiEndPoint + 'Account';
const jwt = environment.jwt();

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  getToken(){
    return sessionStorage.getItem('token');
  }

  logout(){
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('currentEmployee', '');
    console.log(this.getToken());

  }

  login(employee: Employee): Observable<string>{
    const requestString = "grant_type=password&username=" + employee.UserName + " &password=" + employee.Password;
    sessionStorage.setItem('currentEmployee', JSON.stringify(employee));
    console.log(sessionStorage.getItem('token'));
    return this.http.post<string>('http://localhost:51017/token', requestString);

  }

  register(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(url + '/' + 'Register', employee, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }
}
