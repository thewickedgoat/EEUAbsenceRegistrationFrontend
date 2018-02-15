import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Absence} from '../../entities/absence';

@Component({
  selector: 'app-absence-overview',
  templateUrl: './absence-overview.component.html',
  styleUrls: ['./absence-overview.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbsenceOverviewComponent implements OnInit {

  @Input()
  holidayyearStart: Date;
  @Input()
  holidayyearEnd: Date;
  @Input()
  vacationdays: Absence[];
  @Input()
  halfVacationdays: Absence[];
  @Input()
  vacationdaysUsed: number;
  @Input()
  vacationdaysLeft: number;
  @Input()
  vacationfreedays: Absence[];
  @Input()
  halfVacationfreedays: Absence[];
  @Input()
  vacationfreedaysUsed: number;
  @Input()
  vacationfreedaysLeft: number;

  constructor() { }

  ngOnInit() {
  }
}
