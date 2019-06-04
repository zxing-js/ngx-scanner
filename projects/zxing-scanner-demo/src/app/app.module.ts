import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AppComponent } from './app.component';
import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ZXingScannerModule.forRoot(),
    BrowserAnimationsModule,
    MatDialogModule,
  ],
  declarations: [AppComponent, FormatsDialogComponent],
  bootstrap: [AppComponent],
  entryComponents: [FormatsDialogComponent]
})
export class AppModule { }
