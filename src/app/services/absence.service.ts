import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Absence} from '../entities/absence';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'absence/';

@Injectable()
export class AbsenceService {

  constructor(private http: HttpClient) { }

  post(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(url + 'Post', absence, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getAll(): Observable<Absence[]> {
    return this.http.get<Absence[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  put(absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(url + 'Put' + '/' + absence.Id, absence, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});
  }

  getDatesFromInterval(startDate: Date, endDate: Date): Observable<Absence[]>
  {
    return this.http.get<Absence[]>(url + 'GetInterval/' + '?startDate=' + startDate.toLocaleDateString('ko-KR') + '&endDate=' + endDate.toLocaleDateString('ko-KR'),
      {headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.jwt())});

  }
}
