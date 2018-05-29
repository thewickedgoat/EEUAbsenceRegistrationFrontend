import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PublicHoliday} from '../entities/publicholiday';

const url = environment.apiEndPoint + 'publicholiday/';

@Injectable()
export class PublicholidayService {

  constructor(private http: HttpClient) { }

  post(publicHoliday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.post<PublicHoliday>(url + 'Post', publicHoliday, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(publicHoliday: PublicHoliday): Observable<PublicHoliday> {
    return this.http.put<PublicHoliday>(url + 'Put' + '/' + publicHoliday.Id, publicHoliday, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getById(id: number): Observable<PublicHoliday>{
    return this.http.get<PublicHoliday>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<PublicHoliday[]> {
    return this.http.get<PublicHoliday[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }
}
