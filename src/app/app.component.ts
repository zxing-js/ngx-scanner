import { Component, VERSION } from '@angular/core'

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
})
export class AppComponent {

    camStarted = false;
    selectedDevice = undefined;
    qrResult = "";
    availableDevices = [];

    displayCameras(cams: any[]) {
        this.availableDevices = cams;
        console.log("Devices", cams);
        if (cams && cams.length > 0) {
            this.selectedDevice = cams[0];
            this.camStarted = true;
        }
    }

    handleQrCodeResult(result: string) {
        console.log("Result", result);
        this.qrResult = result;
    }

    onChange(selectedValue: string) {
        console.log("Selection changed", selectedValue);
        this.camStarted = false;
        this.selectedDevice = selectedValue;
        this.camStarted = true;
    }
}
