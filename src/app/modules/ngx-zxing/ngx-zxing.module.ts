import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxZxingComponent } from './ngx-zxing.component';

export type NgxZxingComponent = NgxZxingComponent;

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [NgxZxingComponent],
    exports: [NgxZxingComponent],
})
export class NgxZxingModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxZxingModule
        };
    }
}
