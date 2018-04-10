import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {HolidayYear} from '../entities/HolidayYear';

const url = environment.apiEndPoint + 'holidayyear/';
const jwt = environment.jwt();

@Injectable()
export class HolidayyearService {

  constructor(private http: HttpClient) { }

  post(holidayYear: HolidayYear): Observable<HolidayYear> {
    return this.http.post<HolidayYear>(url + 'Post', holidayYear, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(holidayYear: HolidayYear): Observable<HolidayYear> {
    return this.http.put<HolidayYear>(url + 'Put' + '/' + holidayYear.Id, holidayYear, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<HolidayYear>{
    return this.http.get<HolidayYear>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<HolidayYear[]> {
    return this.http.get<HolidayYear[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }
}
