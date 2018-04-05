import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-universal-error-catcher',
  templateUrl: './universal-error-catcher.component.html',
  styleUrls: ['./universal-error-catcher.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UniversalErrorCatcherComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UniversalErrorCatcherComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

}
