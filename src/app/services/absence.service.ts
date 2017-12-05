import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Absence} from '../entities/absence';
import {environment} from '../../environments/environment';

const url = environment.apiEndPoint + 'absence';

@Injectable()
export class AbsenceService {

  constructor(private http: HttpClient) { }

  post(absence: Absence): Observable<Absence> {
    return this.http.post<Absence>(url, absence);
  }

  getAll(): Observable<Absence[]> {
    return this.http.get<Absence[]>(url);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + '/' + id);
  }

  put(absence: Absence): Observable<Absence> {
    return this.http.put<Absence>(url + '/' + absence.Id, absence);
  }
}
