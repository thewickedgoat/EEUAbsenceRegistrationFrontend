import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DepartmentService} from '../../services/department.service';
import {Department} from '../../entities/department';
import {Location} from '@angular/common';

@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentCreateComponent implements OnInit {
  departmentCreated = false;
  department: Department;
  departmentGroup: FormGroup;
  constructor(private location: Location, private departmentService: DepartmentService, private formBuilder: FormBuilder) {
    this.departmentGroup = this.formBuilder.group({
      name: ['', Validators.required],

    });
  }

  ngOnInit() {
  }

  close() {
    this.departmentCreated = false;
  }

  back(){
    this.location.back();
  }

  createDepartment(){
    const values = this.departmentGroup.value;
    const department: Department = {Name: values.name}
    this.departmentService.post(department).subscribe(() => {
      this.departmentGroup.reset();
      this.departmentCreated = true;
      setTimeout(()=> {
        this.departmentCreated = false;
      }, 3000);
    });
  }

  nameIsInvalid(controlName: string) {
    const control = this.departmentGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  nameIsValid(controlName: string) {
    const control = this.departmentGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

}
