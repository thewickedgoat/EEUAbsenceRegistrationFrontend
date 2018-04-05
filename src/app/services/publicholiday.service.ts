import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PublicHoliday} from '../entities/publicholiday';

const url = environment.apiEndPoint + 'publicholiday';
const jwt = environment.jwt();

@Injectable()
export class PublicholidayService {

  constructor(private http: HttpClient) { }

  post(publicHoliday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(url, publicHoliday, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(publicHoliday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(url + '/' + publicHoliday.Id, publicHoliday, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<PublicHoliday>{
    return this.http.get<PublicHoliday>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }
}
