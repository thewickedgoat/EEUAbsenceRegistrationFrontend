import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Department} from '../entities/department';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'department/';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  post(department: Department): Observable<Department> {
    return this.http.post<Department>(url + 'Post', department, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(department: Department): Observable<Department>{
    return this.http.put<Department>(url + 'Put'  + '/' + department.Id, department,{headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(url + 'GetById'  + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }
}
