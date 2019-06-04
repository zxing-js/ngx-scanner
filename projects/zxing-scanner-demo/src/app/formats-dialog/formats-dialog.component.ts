import { Component, Inject } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-formats-dialog',
  templateUrl: './formats-dialog.component.html',
  styleUrls: ['./formats-dialog.component.scss']
})
export class FormatsDialogComponent {

  formats: BarcodeFormat[];
  disabledFormats: BarcodeFormat[];

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: any,
  ) {
    this.formats = data.formats;
    this.disabledFormats = data.disabledFormats;
  }

}
