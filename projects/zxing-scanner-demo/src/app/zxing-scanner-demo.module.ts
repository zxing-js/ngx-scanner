import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '../../../zxing-scanner/src/public_api';

@NgModule({
  imports: [CommonModule, ZXingScannerModule],
  exports: [ZXingScannerModule],
})
export class ZXingScannerDemoModule { }
