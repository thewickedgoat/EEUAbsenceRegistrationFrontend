import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Status} from '../entities/status';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'status/';

@Injectable()
export class StatusService {

  constructor(private http: HttpClient) { }

  post(status: Status): Observable<Status> {
    return this.http.post<Status>(url + 'Post', status, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(status: Status): Observable<Status> {
    return this.http.put<Status>(url + 'Put' + '/' + status.Id, status, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<Status>{
    return this.http.get<Status>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<Status[]> {
    return this.http.get<Status[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});

  }


}
