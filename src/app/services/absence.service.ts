import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Absence} from '../entities/absence';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'absence';
const jwt = environment.jwt();

@Injectable()
export class AbsenceService {

  constructor(private http: HttpClient) { }

  post(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(url, absence, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<Absence[]> {
    return this.http.get<Absence[]>(url, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(url + '/' + absence.Id, absence, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getDatesFromInterval(startDate: Date, endDate: Date): Observable<Absence[]>
  {
    return this.http.get<Absence[]>(url + '?startDate=' + startDate.toLocaleDateString('ko-KR') + '&endDate=' + endDate.toLocaleDateString('ko-KR'),
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});

  }
}
