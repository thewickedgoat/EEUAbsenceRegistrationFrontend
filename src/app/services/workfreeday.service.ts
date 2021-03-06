import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {WorkfreeDay} from '../entities/workfreeDay';


const url = environment.apiEndPoint + 'workfreeday/';

@Injectable()
export class WorkfreedayService {

  constructor(private http: HttpClient) { }

  post(workfreeDay: WorkfreeDay): Observable<WorkfreeDay> {
    return this.http.post<WorkfreeDay>(url + 'Post', workfreeDay, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  postList(workfreeDays: WorkfreeDay[]): Observable<WorkfreeDay[]>{
    return this.http.post<WorkfreeDay[]>(url + 'PostList', workfreeDays,{headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(workfreeDay: WorkfreeDay): Observable<WorkfreeDay> {
    return this.http.put<WorkfreeDay>(url + 'Put' + '/' + workfreeDay.Id, workfreeDay, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<WorkfreeDay>{
    return this.http.get<WorkfreeDay>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<WorkfreeDay[]> {
    return this.http.get<WorkfreeDay[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }
}
