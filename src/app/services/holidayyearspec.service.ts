import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HolidayYearSpec} from '../entities/holidayYearSpec';

const url = environment.apiEndPoint + 'holidayyearspec/';

@Injectable()
export class HolidayYearSpecService {

  constructor(
    private http: HttpClient
  ) { }

  post(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.post<HolidayYearSpec>(url + 'Post', holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.put<HolidayYearSpec>(url + 'Put' + '/' + holidayYearSpec.Id, holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<HolidayYearSpec>{
    return this.http.get<HolidayYearSpec>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<HolidayYearSpec[]> {
    return this.http.get<HolidayYearSpec[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

}
