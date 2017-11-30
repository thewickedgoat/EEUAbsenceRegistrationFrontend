import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Department} from '../entities/department';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'department';

@Injectable()
export class DepartmentService {

  constructor(private http: HttpClient) { }

  post(department: Department): Observable<Department> {
    return this.http.post<Department>(url, department);
  }

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id);
  }
}
