import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-administration-view',
  templateUrl: './administration-view.component.html',
  styleUrls: ['./administration-view.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdministrationViewComponent implements OnInit {

  @Input()
  holidayYearStart: Date;
  @Input()
  holidayYearEnd: Date;

  constructor() { }

  ngOnInit() {
  }

}
