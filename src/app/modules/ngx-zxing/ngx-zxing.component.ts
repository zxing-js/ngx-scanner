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

import { Result } from '@barn/zxing';

import { BrowserQRCodeReader } from './browser-qr-code-reader';

@Component({
    selector: 'ngx-zxing',
    templateUrl: './ngx-zxing.component.html'
})
export class NgxZxingComponent implements AfterViewInit, OnDestroy, OnChanges {

    /**
     * I have no idea. - @odahcam
     */
    private destroyed$: Subject<any> = new Subject;
    /**
     * The ZXing code reader.
     */
    private codeReader: BrowserQRCodeReader = new BrowserQRCodeReader(1500);

    /**
     * Says if some native API is supported.
     */
    private isEnumerateDevicesSuported: boolean;

    /**
     * List of enable video-input devices.
     */
    private videoInputDevices: MediaDeviceInfo[];
    /**
     * The actual device used to scan things.
     */
    private videoInputDevice: MediaDeviceInfo;

    /**
     * Reference to the preview element, should be the `video` tag.
     */
    @ViewChild('preview')
    previewElemRef: ElementRef;

    /**
     * The scan throttling (time between scans) in milliseconds.
     */
    @Input()
    scanThrottling = 1500;

    /**
     * Allow start scan or not.
     */
    @Input()
    start = false;

    /**
     * The device that should be used to scan things.
     */
    @Input()
    device: MediaDeviceInfo;

    /**
     * The value of the HTML video's class attribute.
     */
    @Input()
    cssClass: string;

    /**
     * Emitts events when a scan is successful performed, will inject the string value of the QR-code to the callback.
     */
    @Output()
    scanSuccess = new EventEmitter<string>();

    /**
     * Emitts events when a scan fails without errors, usefull to know how much scan tries where made.
     */
    @Output()
    scanFailure = new EventEmitter<void>();

    /**
     * Emitts events when a scan throws some error, will inject the error to the callback.
     */
    @Output()
    scanError = new EventEmitter<Error>();

    /**
     * Emitts events when a scan is performed, will inject the Result value of the QR-code scan (if available) to the callback.
     */
    @Output()
    scanComplete = new EventEmitter<Result>();

    /**
     * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
     */
    @Output()
    camerasFound = new EventEmitter<MediaDeviceInfo[]>();

    /**
     * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
     */
    @Output()
    camerasNotFound = new EventEmitter<any[]>();

    /**
     * Constructor to build the object and do some DI.
     */
    constructor() {
        this.isEnumerateDevicesSuported = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);
    }

    /**
     * Manages the bindinded property changes.
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {

        if (changes.start) {
            if (!this.start) {
                this.stopScan();
            }
            this.startScan();
        }

        if (changes.device) {
            if (this.device) {
                this.changeDevice(this.device);
            } else {
                console.warn('ngx-zxing', 'device', 'Selected undefined device.');
            }
        }

        if (changes.scanThrottling) {
            this.setCodeReaderThrottling(this.scanThrottling);
        }
    }

    /**
     * Executed after the view initialization.
     */
    ngAfterViewInit(): void {

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

    /**
     * Executes some actions before destroy the component.
     */
    ngOnDestroy(): void {
        this.stopScan();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    /**
     * Starts a new QR-scanner to set a new scan throttling.
     *
     * @param throttling The scan speed in milliseconds.
     */
    setCodeReaderThrottling(throttling: number): void {
        this.codeReader = new BrowserQRCodeReader(throttling);
    }

    /**
     * Properly changes the actual target device.
     *
     * @param device
     */
    changeDevice(device: MediaDeviceInfo): void {
        this.stopScan();
        this.videoInputDevice = this.device;
        this.startScan();
    }

    /**
     * Gets and registers all cammeras.
     */
    enumerateCams(): void {
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
                this.camerasNotFound.next(error);
            });
    }

    /**
     * Starts the continuous scanning for the given device.
     *
     * @param deviceId The deviceId from the device.
     */
    scan(deviceId: string): void {
        try {

            this.codeReader.decodeFromInputVideoDevice((result: any) => {

                console.log('ngx-zxing', 'scan', 'result: ', result);

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

    /**
     * Starts the scanning if allowed.
     */
    startScan(): void {
        if (this.start) {

            if (!this.videoInputDevice) {
                console.warn('ngx-zxing', 'startScan', 'Aborted cause there is no device selected.');
                return;
            }

            this.scan(this.videoInputDevice.deviceId);
        }
    }

    /**
     * Stops the scan service.
     */
    stopScan(): void {
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
    enumarateVideoDevices(successCallback: any): void {

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
