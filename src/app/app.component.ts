import { Component, VERSION } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {

    qrResult: string;

    availableDevices: MediaDeviceInfo[];
    selectedDevice: MediaDeviceInfo;

    displayCameras(cameras: MediaDeviceInfo[]) {
        console.log('Devices: ', cameras);
        this.availableDevices = cameras;
    }

    handleQrCodeResult(result: string) {
        console.log('Result: ', result);
        this.qrResult = result;
    }

    onChange(selectedValue: MediaDeviceInfo) {
        console.log('Selection changed: ', selectedValue);
        this.selectedDevice = selectedValue;
    }
}
