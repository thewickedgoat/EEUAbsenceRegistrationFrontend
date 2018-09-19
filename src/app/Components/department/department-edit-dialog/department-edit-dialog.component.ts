import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DepartmentDeleteDialogComponent} from '../department-delete-dialog/department-delete-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-department-edit-dialog',
  templateUrl: './department-edit-dialog.component.html',
  styleUrls: ['./department-edit-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentEditDialogComponent implements OnInit {

  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<DepartmentDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      changeName: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  create(){
    const values = this.formGroup.value;
    if(values.changeName === '' || values.changeName === ' '){
      this.dialogRef.close();
    }
    this.dialogRef.close(values.changeName);
  }

  close(){
    this.dialogRef.close();
  }
}
