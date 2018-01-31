// our root app component
import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-docs',
    templateUrl: './app.component',
})
export class AppComponent {

    camStarted = false;
    selectedDevice: string;
    qrResult = '';
    availableDevices: any[];

    displayCameras(cams: any[]) {

        this.availableDevices = cams;

        console.log('Devices', cams);

        if (cams && cams.length > 0) {
            this.selectedDevice = cams[0];
            this.camStarted = true;
        }
    }

    handleQrCodeResult(result: string) {
        console.log('Result', result);
        this.qrResult = result;
    }

    onChange(selectedValue: string) {
        console.log('Selection changed', selectedValue);

        this.camStarted = false;
        this.selectedDevice = selectedValue;
        this.camStarted = true;
    }
}
