import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HolidayYearSpec} from '../entities/holidayYearSpec';

const url = environment.apiEndPoint + 'holidayyearspec';
const jwt = environment.jwt();

@Injectable()
export class HolidayYearSpecService {

  constructor(private http: HttpClient) { }

  post(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.post<HolidayYearSpec>(url, holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.put<HolidayYearSpec>(url + '/' + holidayYearSpec.Id, holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<HolidayYearSpec>{
    return this.http.get<HolidayYearSpec>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<HolidayYearSpec[]> {
    return this.http.get<HolidayYearSpec[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }

}
