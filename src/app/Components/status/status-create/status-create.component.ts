import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Status} from '../../../entities/status';

@Component({
  selector: 'app-status-create',
  templateUrl: './status-create.component.html',
  styleUrls: ['./status-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusCreateComponent implements OnInit {

  statusList: Status[] = this.data.statusList;
  statusGroup: FormGroup;

  constructor(private formbuilder: FormBuilder,
              public dialogRef: MatDialogRef<StatusCreateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.statusGroup = this.formbuilder.group({
      statusName: ['', Validators.required],
      statusCode: ['', Validators.required],
    });
  }

  ngOnInit() {
  }


  close(){
    this.dialogRef.close(null);
  }

  createStatus(){
    const values = this.statusGroup.value;
    let status: Status = {
      StatusName: values.statusName,
      StatusCode: values.statusCode,
      IsDisabled: false
    };
    console.log(status);
    this.dialogRef.close(status);
  }

  nameIsValid(controlName: string){
    const control = this.statusGroup.controls[controlName];
    return !control.invalid && (control.dirty || control.touched);
  }

  nameIsInvalid(controlName: string){
    const control = this.statusGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  statusCodeIsInvalid(controlName: string){
    const statusCode = this.statusGroup.controls[controlName];
    if(this.statusList != null || this.statusList.length <= 0){
      let value = statusCode.value;
      console.log(value);
      const duplicateCode = this.statusList.find(x => x.StatusCode === value);
      console.log(duplicateCode);
      if(duplicateCode === undefined){
        return false;
      }
      else {
        return true;
      }
    }
    return false;
  }

  statusCodeLengthIsInvalid(controlName: string){
    const statusCode = this.statusGroup.controls[controlName];
    const maxLength = 3;
    if(statusCode.value.length > maxLength){
      return true;
    }
    else return false;
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
