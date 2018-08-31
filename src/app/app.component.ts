import { Component, VERSION, OnInit, ViewChild } from '@angular/core';

import { ZXingScannerComponent } from './modules/zxing-scanner/zxing-scanner.module';

import { DecodeHintType, Result } from '@zxing/library';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngVersion = VERSION.full;

  @ViewChild('scanner')
  scanner: ZXingScannerComponent;
  scannerHints: Map<DecodeHintType, any>;

  hasDevices: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;

  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo;

  constructor() {
    this.scannerHints = new Map<DecodeHintType, any>();
    this.scannerHints.set(DecodeHintType.TRY_HARDER, true);
  }

  ngOnInit(): void {

    // this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
    //     this.availableDevices = devices;

    //     // selects the devices's back camera by default
    //     for (const device of devices) {
    //         if (/back|rear|environment/gi.test(device.label)) {
    //             this.scanner.changeDevice(device);
    //             this.currentDevice = device;
    //             break;
    //         }
    //     }
    // });

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => this.availableDevices = devices);
    this.scanner.hasDevices.subscribe((has: boolean) => this.hasDevices = has);
    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
    this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
  }

  displayCameras(cameras: MediaDeviceInfo[]) {
    console.debug('Devices: ', cameras);
    this.availableDevices = cameras;
  }

  handleQrCodeResult(resultString: string) {
    console.debug('Result: ', resultString);
    this.qrResultString = resultString;
  }

  onDeviceSelectChange(selectedValue: string) {
    console.debug('Selection changed: ', selectedValue);
    this.currentDevice = this.scanner.getDeviceById(selectedValue);
  }

  stateToEmoji(state: boolean): string {

    const states = {
      // not checked
      undefined: '❔',
      // failed to check
      null: '⭕',
      // success
      true: '✔',
      // can't touch that
      false: '❌'
    };

    return states['' + state];
  }
}
