import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-publicholiday-create-error',
  templateUrl: './publicholiday-create-error.component.html',
  styleUrls: ['./publicholiday-create-error.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PublicholidayCreateErrorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PublicholidayCreateErrorComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  cancel(){
    this.dialogRef.close(false);
  }

  accepted(){
    this.dialogRef.close(true);
  }

}
