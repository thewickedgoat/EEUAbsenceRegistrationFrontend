import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Department} from '../entities/department';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'department';
const jwt = environment.jwt();

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  post(department: Department): Observable<Department> {
    return this.http.post<Department>(url, department, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }
}
