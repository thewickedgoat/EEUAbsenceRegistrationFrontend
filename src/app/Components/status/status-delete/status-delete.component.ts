import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-status-delete',
  templateUrl: './status-delete.component.html',
  styleUrls: ['./status-delete.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StatusDeleteComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StatusDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close(false);
  }

  delete(){
    this.dialogRef.close(true);
  }
}
