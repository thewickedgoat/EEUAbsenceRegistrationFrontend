import {Component, EventEmitter, Input, OnInit, OnChanges, Output, ViewEncapsulation} from '@angular/core';
import {Employee} from '../../../entities/Employee';

@Component({
  selector: 'app-workfreeday',
  templateUrl: './workfreeday.component.html',
  styleUrls: ['./workfreeday.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedayComponent implements OnInit {

  @Input()
  employees: Employee[];

  selectedEmployee: Employee;

  @Output()
  emitter = new EventEmitter();

  constructor() {
  }

  ngOnInit() {

  }

  ngOnChanges()
  {

    console.log('nanie?!?')
  }

  selectEmployee(value: string){
    const id = parseInt(value);
    const selectedEmployee = this.employees.find(x => x.Id === id);
    this.selectedEmployee = selectedEmployee;
  }

  createWorkfreeDay(){
    this.emitter.emit(this.selectedEmployee);
  }

  delete(){

  }

  edit(){

  }

  test(){
    console.log('nani?!');
  }
}
