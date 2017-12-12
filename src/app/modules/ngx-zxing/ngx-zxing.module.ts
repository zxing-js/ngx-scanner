import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxZxingComponent } from './ngx-zxing.component';

import { BrowserQRCodeReaderExt } from './browser-qr-code-reader-ext';

@NgModule({
    imports: [CommonModule],
    declarations: [
        NgxZxingComponent,
        BrowserQRCodeReaderExt,
    ],
    exports: [NgxZxingComponent],
})
export class NgxZxingModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxZxingModule
        };
    }
}
