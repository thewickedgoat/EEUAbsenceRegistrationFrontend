import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HolidayYearSpec} from '../entities/holidayYearSpec';
import {DateformatingService} from './dateformating.service';

const url = environment.apiEndPoint + 'holidayyearspec/';
const jwt = environment.jwt();

@Injectable()
export class HolidayYearSpecService {

  selectedHolidayYearSpec: HolidayYearSpec;

  constructor(
    private http: HttpClient,
    private dateformatingService: DateformatingService,
  ) { }

  post(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.post<HolidayYearSpec>(url + 'Post', holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  put(holidayYearSpec: HolidayYearSpec): Observable<HolidayYearSpec> {
    return this.http.put<HolidayYearSpec>(url + 'Put' + '/' + holidayYearSpec.Id, holidayYearSpec, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getById(id: number): Observable<HolidayYearSpec>{
    return this.http.get<HolidayYearSpec>(url + 'GetById' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  getAll(): Observable<HolidayYearSpec[]> {
    return this.http.get<HolidayYearSpec[]>(url + 'GetAll', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(url + 'Delete' + '/' + id, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + jwt)});
  }

  set(id: number){
    this.getById(id).subscribe(hys => {
      hys.StartDate = this.dateformatingService.formatDate(hys.StartDate);
      hys.EndDate = this.dateformatingService.formatDate(hys.EndDate);
      this.selectedHolidayYearSpec = hys;
      console.log(this.getSelectedHolidayYearSpec());
    });
  }

  getSelectedHolidayYearSpec(){
    return this.selectedHolidayYearSpec;
  }

}
