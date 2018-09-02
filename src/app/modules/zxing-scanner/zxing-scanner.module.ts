import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ZXingScannerComponent } from './zxing-scanner.component';

export type ZXingScannerComponent = ZXingScannerComponent;

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [ZXingScannerComponent],
  exports: [ZXingScannerComponent],
})
export class ZXingScannerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZXingScannerModule
    };
  }
}
