import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {Month} from '../entities/month';

const url = environment.apiEndPoint + 'month/';
const jwt = environment.jwt();

@Injectable()
export class MonthService {


  constructor(private http: HttpClient) { }

  post(month: Month): Observable<Month> {
    return this.http.post<Month>(url + 'Post', month, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  postList(months: Month[]): Observable<Month[]>{
    return this.http.post<Month[]>(url + 'PostList', months, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(month: Month): Observable<Month> {
    return this.http.put<Month>(url + 'Put' + '/' + month.Id, month, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<Month>{
    return this.http.get<Month>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<Month[]> {
    return this.http.get<Month[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }

}
