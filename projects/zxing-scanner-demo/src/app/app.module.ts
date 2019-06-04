import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatTooltipModule,  MatButtonModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AppComponent } from './app.component';
import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ZXingScannerModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  declarations: [AppComponent, FormatsDialogComponent],
  bootstrap: [AppComponent],
  entryComponents: [FormatsDialogComponent]
})
export class AppModule { }
