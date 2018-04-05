import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-workfreeday-create-error',
  templateUrl: './workfreeday-create-error.component.html',
  styleUrls: ['./workfreeday-create-error.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class WorkfreedayCreateErrorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<WorkfreedayCreateErrorComponent>,
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
