import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppInfoDialogComponent } from './app-info-dialog/app-info-dialog.component';
import { AppInfoComponent } from './app-info/app-info.component';
import { AppComponent } from './app.component';
import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';
import { ZXingScannerDemoModule } from './zxing-scanner-demo.module';

@NgModule({
  imports: [

    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,

    // local
    ZXingScannerDemoModule,

    // Material
    MatDialogModule,
    MatListModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
  ],
  declarations: [AppComponent, FormatsDialogComponent, AppInfoComponent, AppInfoDialogComponent],
  bootstrap: [AppComponent],
  entryComponents: [FormatsDialogComponent, AppInfoDialogComponent]
})
export class AppModule { }
