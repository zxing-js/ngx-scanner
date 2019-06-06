import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerComponent } from './zxing-scanner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ZXingScannerComponent],
  exports: [ZXingScannerComponent],
})
export class ZXingScannerModule { }
