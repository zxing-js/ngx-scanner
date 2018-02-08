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
import { Result } from '@barn/zxing';

@Component({
    selector: 'ngx-zxing',
    templateUrl: './ngx-zxing.component.html'
})
export class NgxZxingComponent implements AfterViewInit, OnDestroy, OnChanges {

    private destroyed$: Subject<any> = new Subject;
    private codeReader: BrowserQRCodeReader = new BrowserQRCodeReader(1500);

    private isEnumerateDevicesSuported: boolean;

    private videoInputDevices: MediaDeviceInfo[];
    private videoInputDevice: MediaDeviceInfo;

    @ViewChild('preview')
    previewElemRef: ElementRef;

    @Input()
    scanThrottling: number = 1500;

    @Input()
    start: boolean = false;

    @Input()
    device: MediaDeviceInfo;

    @Input()
    cssClass: string;

    @Output()
    scanSuccess = new EventEmitter<string>();

    @Output()
    scanFailure = new EventEmitter<void>();

    @Output()
    scanError = new EventEmitter<Error>();

    @Output()
    scanComplete = new EventEmitter<Result>();

    @Output()
    camerasFound = new EventEmitter<MediaDeviceInfo[]>();

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
            this.changeDevice(this.device);
        }

        if (changes.scanThrottling) {
            this.setCodeReaderThrottling(this.scanThrottling);
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

        if (!this.videoInputDevices) {
            this.enumerateCams();
        }

        this.startScan();
    }

    ngOnDestroy() {
        this.stopScan();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    setCodeReaderThrottling(throttling: number) {
        this.codeReader = new BrowserQRCodeReader(throttling);
    }

    changeDevice(device: MediaDeviceInfo) {
        this.stopScan();
        this.videoInputDevice = this.device;
        this.startScan();
    }

    enumerateCams() {
        navigator
            .mediaDevices
            .getUserMedia({ audio: false, video: true })
            .then((stream: MediaStream) => {

                this.enumarateVideoDevices((videoInputDevices: MediaDeviceInfo[]) => {
                    if (videoInputDevices && videoInputDevices.length > 0) {

                        this.camerasFound.next(videoInputDevices);

                        this.changeDevice(videoInputDevices[videoInputDevices.length - 1]);

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
        try {
            this.codeReader.decodeFromInputVideoDevice((result: any) => {

                console.log('ngx-zxing', 'scan', 'result from scan: ', result);

                if (result) {
                    this.dispatchScanSuccess(result);
                } else {
                    this.dispatchScanFailure();
                }

                this.dispatchScanComplete(result);

            }, deviceId, this.previewElemRef.nativeElement);
        } catch (err) {
            this.dispatchScanError(err);
            this.dispatchScanComplete(undefined);
        }
    }

    startScan() {
        if (this.start) {
            this.scan(this.videoInputDevice.deviceId);
        }
    }

    stopScan() {
        this.codeReader.reset();
    }

    /**
     * Dispatches the scan success event.
     *
     * @param result the scan result.
     */
    dispatchScanSuccess(result: Result): void {
        this.scanSuccess.next(result.getText());
    }

    /**
     * Dispatches the scan failure event.
     */
    dispatchScanFailure(): void {
        this.scanFailure.next();
    }

    /**
     * Dispatches the scan error event.
     *
     * @param err the error thing.
     */
    dispatchScanError(error: any): void {
        this.scanError.next(error);
    }

    /**
     * Dispatches the scan event.
     *
     * @param result the scan result.
     */
    dispatchScanComplete(result: Result): void {
        this.scanComplete.next(result);
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
