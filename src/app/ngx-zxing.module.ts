import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxZxingComponent } from './ngx-zxing.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NgxZxingComponent,
  ],
  exports: [
    NgxZxingComponent
  ]
})
export class NgxZxingModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxZxingModule
    };
  }
}
