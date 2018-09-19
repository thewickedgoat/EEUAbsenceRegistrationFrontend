import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Status} from '../../../entities/status';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusEditComponent implements OnInit {

  statusGroup: FormGroup;
  statusList: Status[];
  status: Status;

  constructor(private formbuilder: FormBuilder,
              public dialogRef: MatDialogRef<StatusEditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.statusList = this.data.statusList;
    this.status = this.data.status;
    this.statusGroup = this.formbuilder.group({
      statusName: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  close(){
    this.dialogRef.close(null);
  }

  editStatus(){
    const values = this.statusGroup.value;
    this.status.StatusName = values.statusName;
    this.dialogRef.close(this.status);
  }

  nameIsValid(controlName: string){
    const control = this.statusGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

  nameIsInvalid(controlName: string){
    const control = this.statusGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  statusNameIsInvalid(controlName: string){
    const statusName = this.statusGroup.controls[controlName];
    if(this.statusList != null || this.statusList.length <= 0){
      let value = statusName.value;
      let duplicateName = this.statusList.find(x => x.StatusName === value);
      if(duplicateName === undefined){
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }
}
