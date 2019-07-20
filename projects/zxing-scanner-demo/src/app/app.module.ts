import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppInfoDialogComponent } from './app-info-dialog/app-info-dialog.component';
import { AppInfoComponent } from './app-info/app-info.component';
import { AppUiModule } from './app-ui.module';
import { AppComponent } from './app.component';
import { FormatsDialogComponent } from './formats-dialog/formats-dialog.component';


@NgModule({
  imports: [

    // Angular
    BrowserModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),

    // Local
    AppUiModule,

  ],
  declarations: [AppComponent, FormatsDialogComponent, AppInfoComponent, AppInfoDialogComponent],
  bootstrap: [AppComponent],
  entryComponents: [FormatsDialogComponent, AppInfoDialogComponent]
})
export class AppModule { }
