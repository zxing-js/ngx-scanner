import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxZxingComponent } from './ngx-zxing.component';
import { ZXING_CONFIG, ZXING_DEFAULT_CONFIG, ZXingConfig } from './ngx-zxing.config';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [NgxZxingComponent],
    exports: [NgxZxingComponent],
})
export class NgxZxingModule {
    static forRoot(config?: ZXingConfig): ModuleWithProviders {
        if (config === undefined) {
            config = ZXING_DEFAULT_CONFIG;
        }
        return {
            ngModule: NgxZxingModule,
            providers: [
                {
                    provide: ZXING_CONFIG,
                    useValue: config
                }
            ]
        };
    }
}
