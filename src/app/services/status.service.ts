import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Status} from '../entities/status';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'status/';
const jwt = environment.jwt();

@Injectable()
export class StatusService {

  constructor(private http: HttpClient) { }

  post(status: Status): Observable<Status> {
    return this.http.post<Status>(url + 'Post', status, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(status: Status): Observable<Status> {
    return this.http.put<Status>(url + 'Put' + '/' + status.Id, status, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<Status>{
    return this.http.get<Status>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<Status[]> {
    return this.http.get<Status[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }


}
