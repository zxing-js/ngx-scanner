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
    private deviceId: string;
    private isEnumerateDevicesSuported: boolean;
    private videoInputDevices: any[];

    @ViewChild('preview')
    previewElemRef: ElementRef;

    @Input()
    start = false;

    @Input()
    device: any;

    @Input()
    cssClass: string;

    @Output()
    scanSuccess = new EventEmitter<string>();

    @Output()
    scanFailure = new EventEmitter<string>();

    @Output()
    scanError = new EventEmitter<string>();

    @Output()
    camerasFound = new EventEmitter<any[]>();

    constructor() {

        this.isEnumerateDevicesSuported = !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices);

        if (!this.isEnumerateDevicesSuported) {

            console.error('ngx-zxing', 'enumerateDevices() not supported.');

        }
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.start) {
            if (this.start) {
                this.startScan();
            } else {
                this.stopScan();
            }
        }

        if (changes.device && this.device) {

            this.stopScan();

            this.deviceId = this.device.deviceId;

            if (this.start) {
                this.startScan();
            }
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

        if (this.start) {
            this.startScan();
        }
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
            .then(stream => {

                this.getAllAudioVideoDevices((videoInputDevices: any[]) => {
                    if (videoInputDevices && videoInputDevices.length > 0) {
                        this.camerasFound.next(videoInputDevices);
                        this.deviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                    }
                });

                // Start stream so Browser can display permission-dialog ("Website wants to access your camera, allow?")
                // this.previewElemRef.nativeElement.srcObject = stream;

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

            console.log('ngx-zxing', 'result from scan: ', result);

            this.dispatchScanSuccess(result);

        }, deviceId, this.previewElemRef.nativeElement);
    }

    startScan() {
        this.scan(this.deviceId);
    }

    stopScan() {
        this.codeReader.reset();
    }

    dispatchScanSuccess(result: any) {
        if (this.start) {
            this.scanSuccess.next(result.text);
        }
    }

    getAllAudioVideoDevices(successCallback: any) {

        if (!this.isEnumerateDevicesSuported) {
            console.error('ngx-zxing', 'Can\'t enumerate Devices');
            return;
        }

        navigator.mediaDevices.enumerateDevices().then((devices: object[]) => {

            /*
             * forof and .forEach doesn't work.
             */
            for (let i = 0, len = devices.length; i < len; i++) {

                const device: any = {};

                // tslint:disable-next-line:forin
                for (const d in devices[i]) {
                    device[d] = devices[i][d];
                }

                if (device.kind === 'video') {
                    device.kind = 'videoinput';
                }

                if (!device.deviceId) {
                    device.deviceId = device.id;
                }

                if (!device.id) {
                    device.id = device.deviceId;
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
