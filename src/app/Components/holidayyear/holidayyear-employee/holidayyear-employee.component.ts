import { Component, OnInit, Output, Input, EventEmitter, ViewEncapsulation } from '@angular/core';
import {HolidayYear} from '../../../entities/HolidayYear';
import {Employee} from '../../../entities/Employee';
import {HolidayyearService} from '../../../services/holidayyear.service';

@Component({
  selector: 'app-holidayyear-employee',
  templateUrl: './holidayyear-employee.component.html',
  styleUrls: ['./holidayyear-employee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearEmployeeComponent implements OnInit {

  @Input()
  selectedEmployee: Employee;
  @Input()
  selectedHolidayYear: HolidayYear;

  isNotEditable: boolean;

  @Output()
  toggleEditEmitter = new EventEmitter();

  constructor(private holidayYearService: HolidayyearService) {
    this.isNotEditable = true;
  }

  ngOnInit() {
  }

  toggleEditable(){
    let bool;
    if(this.isNotEditable === true){
      this.isNotEditable = false;
      bool = false;
    }
    else if(this.isNotEditable === false){
      this.isNotEditable = true;
      bool = true;
    }
    this.toggleEditEmitter.emit(bool);
  }

  updateHolidayYear(holidayYear: HolidayYear){
    this.holidayYearService.put(holidayYear).subscribe(res => {
      this.isNotEditable = true;
    });
  }
}
