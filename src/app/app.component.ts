import { Component, VERSION } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
})
export class AppComponent {

    cameraStarted = false;
    qrResult: string;
    selectedDevice: object;
    availableDevices: object[] = [];

    displayCameras(cameras: object[]) {

        console.log('Devices: ', cameras);

        this.availableDevices = cameras;

        if (cameras && cameras.length > 0) {
            this.selectedDevice = cameras[0];
            this.cameraStarted = true;
        }
    }

    handleQrCodeResult(result: string) {

        console.log('Result: ', result);

        this.qrResult = result;
    }

    onChange(selectedValue: object) {

        console.log('Selection changed: ', selectedValue);

        this.cameraStarted = false;
        this.selectedDevice = selectedValue;
        this.cameraStarted = true;
    }
}
