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
    ViewChild,
    Inject,
} from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { BrowserQRCodeReader } from './browser-qr-code-reader';
import { ZXING_CONFIG, ZXingConfig } from './ngx-zxing.config';

@Component({
    selector: 'ngx-zxing',
    templateUrl: './ngx-zxing.component.html'
})
export class NgxZxingComponent implements AfterViewInit, OnDestroy, OnChanges {

    private destroyed$: Subject<any> = new Subject<any>();
    private codeReader: BrowserQRCodeReader;
    private deviceId: string;

    @ViewChild('preview')
    previewElem: ElementRef;

    @Input()
    start = false;

    @Input()
    device: any;

    @Input()
    cssClass: any;

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    onScan = new EventEmitter<string>();

    // tslint:disable-next-line:no-output-on-prefix
    @Output()
    onCamsFound = new EventEmitter<any[]>();

    constructor(@Inject(ZXING_CONFIG) private config: ZXingConfig) {
        this.codeReader = new BrowserQRCodeReader(config.defaultThrottling);
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            (<any>navigator).enumerateDevices = (callback: any) => {
                navigator.mediaDevices.enumerateDevices().then(callback);
            };
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

        if (changes.start) {
            if (this.start) {
                this.startCam();
            } else {
                this.stopCam();
            }
        }

        if (changes.device && this.device) {

            this.stopCam();
            this.deviceId = this.device.deviceId;

            if (this.start) {
                this.startCam();
            }
        }
    }

    ngAfterViewInit() {

        // Chrome 63 fix
        if (!this.previewElem) {
            console.error('Preview element not found!');
            return;
        }

        // iOS 11 Fix
        this.previewElem.nativeElement.setAttribute('autoplay', true);
        this.previewElem.nativeElement.setAttribute('muted', true);
        this.previewElem.nativeElement.setAttribute('playsinline', true);
        this.previewElem.nativeElement.setAttribute('autofocus', true);

        this.enumerateCams();

        if (this.start) {
            this.startCam();
        }
    }

    ngOnDestroy() {
        this.stopCam();
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    enumerateCams() {
        navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {

            this.getAllAudioVideoDevices((videoInputDevices: any[]) => {
                if (videoInputDevices && videoInputDevices.length > 0) {
                    this.onCamsFound.next(videoInputDevices);
                    this.deviceId = videoInputDevices[0].deviceId;
                }
            });

            // Start stream so Browser can display permission-dialog ("Website wants to access your camera, allow?")
            this.previewElem.nativeElement.srcObject = stream;

            // After permission was granted, we can stop it again
            stream.getVideoTracks().forEach(track => {
                track.stop();
            });

            stream.getAudioTracks().forEach(track => {
                track.stop();
            });

        }).catch(error => {
            console.error(error);
        });
    }

    scan(deviceId: string) {
        this.codeReader.decodeFromInputVideoDevice((result: any) => {

            console.log('ngx-zxing:', 'result from scan: ', result);

            this.scanSuccess(result);

        }, deviceId, this.previewElem.nativeElement);
    }

    startCam() {
        this.scan(this.deviceId);
    }

    stopCam() {
        this.codeReader.reset();
    }

    scanSuccess(result: any) {
        if (this.start) {
            this.onScan.next(result.text);
        }
    }

    getAllAudioVideoDevices(successCallback: any) {

        if (!(<any>navigator).enumerateDevices) {
            console.error('Can\'t enumerate Devices');
            return;
        }

        const videoInputDevices: any[] = [];

        (<any>navigator).enumerateDevices((devices: any[]) => {
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

                if (device.kind === 'videoinput' || device.kind === 'video') {
                    videoInputDevices.push(device);
                }
            }

            successCallback(videoInputDevices);
        });
    }
}
