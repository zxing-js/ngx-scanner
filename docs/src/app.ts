//our root app component
import {Component, NgModule, VERSION} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {CommonModule} from '@angular/common';
import {NgxZxingModule} from 'ngx-zxing';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'my-app',
  template: `
    <div>
    <select (change)="onChange($event.target.value)">
      <option *ngFor="let device of availableDevices" value="{{device.deviceId}}">{{device.label}}</option>
    </select>
    <br>
      <ngx-zxing
          [start]="camStarted"
          [device]="selectedDevice"
          (onCamsFound)="displayCameras($event)"
          (onScan)="handleQrCodeResult($event)"
      ></ngx-zxing>
      <br>
      <span>Result: <strong>{{qrResult}}</strong></span>
    </div>
  `,
})
export class App {
  
  camStarted = false;
  selectedDevice = undefined;
  qrResult = "";
  availableDevices = [];
   
  displayCameras(cams: any[]) {
    this.availableDevices = cams;
    console.log("Devices",cams);
    if(cams && cams.length > 0) {
      this.selectedDevice = cams[0];
      this.camStarted = true;
    }
  }
  
  handleQrCodeResult(result: string) {
    console.log("Result", result);
    this.qrResult = result;
  }
  
  onChange(selectedValue: string){
    console.log("Selection changed",selectedValue);
    this.camStarted = false;
    this.selectedDevice = selectedValue;
    this.camStarted = true;
  }
}

@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule,
    NgxZxingModule.forRoot()
  ],
  declarations: [ App ],
  bootstrap: [ App ]
})
export class AppModule {}