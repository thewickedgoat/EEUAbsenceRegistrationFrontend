import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-department-delete-dialog',
  templateUrl: './department-delete-dialog.component.html',
  styleUrls: ['./department-delete-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentDeleteDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DepartmentDeleteDialogComponent>,
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
