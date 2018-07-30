import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-holidayyear-delete-dialog',
  templateUrl: './holidayyear-delete-dialog.component.html',
  styleUrls: ['./holidayyear-delete-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HolidayyearDeleteDialogComponent implements OnInit {

  hasData: boolean;

  constructor(public dialogRef: MatDialogRef<HolidayyearDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.hasData = this.data.hasData;
  }

  delete(){
    this.dialogRef.close(true);
  }

  cancel(){
    this.dialogRef.close(false);
  }
}
