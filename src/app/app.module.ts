import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgxZxingModule } from './modules/ngx-zxing/ngx-zxing.module';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxZxingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
