import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-holidayyear-delete-dialog',
  templateUrl: './holidayyear-delete-dialog.component.html',
  styleUrls: ['./holidayyear-delete-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearDeleteDialogComponent implements OnInit {

  formGroup: FormGroup;
  hasData: boolean;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<HolidayyearDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
      this.formGroup = this.formBuilder.group({
        confirmDelete: ['', Validators.required]
      });
  }

  ngOnInit() {
    this.hasData = this.data.hasData;
  }

  delete(){
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }

  /**
   * Checks if delete is valid
   * @param controlName
   * @returns {boolean}
   */
  deleteIsValid(controlName: string) {
    let deleteValue = 'SLET NU';
    const control = this.formGroup.controls[controlName];
    if(control.value === deleteValue){
      return !control.invalid && (control.dirty || control.touched);
    }
  }
}
