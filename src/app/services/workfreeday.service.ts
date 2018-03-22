import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {WorkfreeDay} from '../entities/workfreeDay';

const url = environment.apiEndPoint + 'workfreeday';
const jwt = environment.jwt();

@Injectable()
export class WorkfreedayService {

  constructor(private http: HttpClient) { }

  post(workfreeDay: WorkfreeDay): Observable<WorkfreeDay> {
    return this.http.post<WorkfreeDay>(url, workfreeDay, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(workfreeDay: WorkfreeDay): Observable<WorkfreeDay> {
    return this.http.put<WorkfreeDay>(url + '/' + workfreeDay.Id, workfreeDay, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<WorkfreeDay>{
    return this.http.get<WorkfreeDay>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<WorkfreeDay[]> {
    return this.http.get<WorkfreeDay[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }
}
