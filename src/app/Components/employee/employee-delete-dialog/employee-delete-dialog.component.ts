import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-employee-delete-dialog',
  templateUrl: './employee-delete-dialog.component.html',
  styleUrls: ['./employee-delete-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeDeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EmployeeDeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  delete(): void {
    this.dialogRef.close(true);
  }

}
