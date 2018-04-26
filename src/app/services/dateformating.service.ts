import { Injectable } from '@angular/core';

@Injectable()
export class DateformatingService {


  constructor() { }

  formatDate(dateToFormat: Date){
    const date = dateToFormat.toString();
    const newDate = new Date(Date.parse(date));
    return newDate;
  }

}
