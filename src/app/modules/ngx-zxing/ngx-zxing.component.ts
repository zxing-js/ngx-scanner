import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { BrowserQRCodeReader } from './browser-qr-code-reader';

@Component({
    selector: 'ngx-zxing',
    templateUrl: './ngx-zxing.component.html'
})
export class NgxZxingComponent implements AfterViewInit, OnDestroy, OnChanges {

    private destroyed$: Subject<any> = new Subject<any>();
    private codeReader = new BrowserQRCodeReader(1500);

    private isEnumerateDevicesSuported: boolean;

    private videoInputDevices: MediaDeviceInfo[];
    private videoInputDevice: MediaDeviceInfo;

    @ViewChild('preview')
    previewElemRef: ElementRef;

    @Input()
    start = false;

    @Input()
    device: MediaDeviceInfo;

    @Input()
    cssClass: string;

    @Output()
    scanSuccess = new EventEmitter<string>();

    @Output()
    scanFailure = new EventEmitter<void>();

    @Output()
    scanError = new EventEmitter<string>();

    @Output()
    camerasFound = new EventEmitter<any[]>();

    @Output()
    camerasNotFound = new EventEmitter<void>();

    constructor() {
        this.isEnumerateDevicesSuported = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.start) {

            if (!this.start) {
                this.stopScan();
            }

            this.startScan();
        }

        if (changes.device && this.device) {

            this.stopScan();

            this.videoInputDevice = this.device;

            this.startScan();
        }
    }

    ngAfterViewInit() {

        // Chrome 63 fix
        if (!this.previewElemRef) {
            console.warn('ngx-zxing', 'Preview element not found!');
            return;
        }

        // iOS 11 Fix
        this.previewElemRef.nativeElement.setAttribute('autoplay', false);
        this.previewElemRef.nativeElement.setAttribute('muted', true);
        this.previewElemRef.nativeElement.setAttribute('playsinline', true);
        this.previewElemRef.nativeElement.setAttribute('autofocus', true);

        if (!this.videoInputDevices) this.enumerateCams();

        this.startScan();
    }

    ngOnDestroy() {
        this.stopScan();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    chooseDevice(deviceId: string) {

    }

    enumerateCams() {
        navigator
            .mediaDevices
            .getUserMedia({ audio: false, video: true })
            .then((stream: MediaStream) => {

                this.enumarateVideoDevices((videoInputDevices: MediaDeviceInfo[]) => {
                    if (videoInputDevices && videoInputDevices.length > 0) {
                        this.camerasFound.next(videoInputDevices);
                        this.videoInputDevice = videoInputDevices[videoInputDevices.length - 1];
                    } else {
                        this.camerasNotFound.next();
                    }
                });

                // Start stream so Browser can display permission-dialog ("Website wants to access your camera, allow?")
                this.previewElemRef.nativeElement.srcObject = stream;

                // After permission was granted, we can stop it again
                stream.getVideoTracks().forEach(track => {
                    track.stop();
                });

                stream.getAudioTracks().forEach(track => {
                    track.stop();
                });

            })
            .catch(error => {
                console.error('ngx-zxing', 'enumerateCams', error);
            });
    }

    scan(deviceId: string) {
        this.codeReader.decodeFromInputVideoDevice((result: any) => {

            console.log('ngx-zxing', 'scan', 'result from scan: ', result);

            this.dispatchScanSuccess(result);

        }, deviceId, this.previewElemRef.nativeElement);
    }

    startScan() {
        if (this.start) {
            this.scan(this.videoInputDevice.deviceId);
        }
    }

    stopScan() {
        this.codeReader.reset();
    }

    dispatchScanSuccess(result: any) {
        this.scanSuccess.next(result.text);
    }

    /**
     * Enumerates all the available devices.
     *
     * @param successCallback
     */
    enumarateVideoDevices(successCallback: any) {

        if (!this.isEnumerateDevicesSuported) {
            console.error('ngx-zxing', 'enumarateVideoDevices', 'Can\'t enumerate devices, method not supported.');
            return;
        }

        navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {

            this.videoInputDevices = [];

            for (const deviceI of devices) {

                const device: any = {};

                // tslint:disable-next-line:forin
                for (const key in deviceI) {
                    device[key] = deviceI[key];
                }

                if (device.kind === 'video') {
                    device.kind = 'videoinput';
                }

                if (!device.deviceId) {
                    device.deviceId = (<any>device).id;
                }

                if (!device.label) {
                    device.label = 'Camera (No Permission)';
                }

                if (device.kind === 'videoinput') {
                    this.videoInputDevices.push(device);
                }
            }

            successCallback(this.videoInputDevices);
        });
    }
}
