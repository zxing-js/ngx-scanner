import {
  AfterViewInit,
  ChangeDetectionStrategy,
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

import { Result, DecodeHintType, BarcodeFormat, QRCodeReader } from '@zxing/library';

import { BrowserMultiFormatReader } from './browser-multi-format-reader';
import { BrowserCodeReader } from './browser-code-reader';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'zxing-scanner',
  templateUrl: './zxing-scanner.component.html',
  styleUrls: ['./zxing-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZXingScannerComponent implements AfterViewInit, OnDestroy, OnChanges {

  /**
   * The ZXing code reader.
   */
  private codeReader: BrowserCodeReader;

  /**
   * Has `navigator` access.
   */
  private hasNavigator: boolean;


  /**
   * Says if some native API is supported.
   */
  private isMediaDevicesSuported: boolean;

  /**
   * Says if some native API is supported.
   */
  private isEnumerateDevicesSuported: boolean;

  /**
   * List of enable video-input devices.
   */
  private videoInputDevices: MediaDeviceInfo[];
  /**
   * The current device used to scan things.
   */
  private videoInputDevice: MediaDeviceInfo;

  /**
   * If the user-agent allowed the use of the camera or not.
   */
  private hasPermission: boolean;

  /**
   * If any media device were found.
   */
  private set _hasDevices(hasDevice: boolean) {
    this.hasDevices.next(hasDevice);
  }

  /**
   * Reference to the preview element, should be the `video` tag.
   */
  @ViewChild('preview')
  previewElemRef: ElementRef;

  /**
   * Barcode formats to scan
   */
  private _formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

  get formats() {
    return this._formats;
  }

  @Input()
  set formats(formatsInput: BarcodeFormat[]) {
    if (typeof formatsInput === 'string') {
      throw new Error('Formats shouldn\'t be a string, make sure the [formats] input is a binding.');
    }
    // formats may be set from html template as BarcodeFormat or string array
    const formats = <(string | BarcodeFormat)[]>formatsInput;
    this._formats = formats.map(f => (typeof f === 'string') ? BarcodeFormat[f.trim()] : f);
  }

  /**
   * Allow start scan or not.
   */
  @Input()
  scannerEnabled = true;

  /**
   * The device that should be used to scan things.
   */
  @Input()
  device: MediaDeviceInfo;

  /**
   * Enable or disable autofocus of the camera (might have an impact on performance)
   */
  @Input()
  autofocusEnabled = true;

  /**
   * How the preview element shoud be fit inside the :host container.
   */
  @Input()
  previewFitMode: 'fill' | 'contain' | 'cover' | 'scale-down' | 'none' = 'cover';

  /**
   * Allow start scan or not.
   */
  @Input()
  set torch(on: boolean) {
    this.codeReader.setTorch(on);
  }

  /**
   * Emitts events when the torch compatibility is changed.
   */
  @Output()
  torchCompatible = new EventEmitter<boolean>();

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
  camerasNotFound = new EventEmitter<any>();

  /**
   * Emitts events when the users answers for permission.
   */
  @Output()
  permissionResponse = new EventEmitter<boolean>();

  /**
   * Emitts events when has devices status is update.
   */
  @Output()
  hasDevices = new EventEmitter<boolean>();

  /**
   * Constructor to build the object and do some DI.
   */
  constructor() {
    this.codeReader = new BrowserCodeReader(new QRCodeReader(), 500);
    this.hasNavigator = typeof navigator !== 'undefined';
    this.isMediaDevicesSuported = this.hasNavigator && !!navigator.mediaDevices;
    this.isEnumerateDevicesSuported = !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);
  }

  /**
   * Manages the bindinded property changes.
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.scannerEnabled) {
      if (!this.scannerEnabled) {
        this.resetScan();
      } else if (this.videoInputDevice) {
        this.scan(this.videoInputDevice.deviceId);
      }
    }

    if (changes.device) {
      if (this.device) {
        this.changeDevice(this.device);
      } else {
        console.warn('zxing-scanner', 'device', 'Unselected device.');
        this.resetScan();
      }
    }

    if (changes.formats !== undefined) {
      this.setFormats(this.formats);
    }
  }

  /**
   * Executed after the view initialization.
   */
  async ngAfterViewInit(): Promise<void> {

    // Chrome 63 fix
    if (!this.previewElemRef) {
      console.warn('zxing-scanner', 'Preview element not found!');
      return;
    }

    // iOS 11 Fix
    this.previewElemRef.nativeElement.setAttribute('autoplay', false);
    this.previewElemRef.nativeElement.setAttribute('muted', true);
    this.previewElemRef.nativeElement.setAttribute('playsinline', true);
    this.previewElemRef.nativeElement.setAttribute('autofocus', this.autofocusEnabled);

    // Asks for permission before enumerating devices so it can get all the device's info
    const hasPermission = await this.askForPermission();

    // gets and enumerates all video devices
    this.enumarateVideoDevices().then((videoInputDevices: MediaDeviceInfo[]) => {

      if (videoInputDevices && videoInputDevices.length > 0) {
        this._hasDevices = true;
        this.camerasFound.next(videoInputDevices);
      } else {
        this._hasDevices = false;
        this.camerasNotFound.next();
      }

    });

    // There's nothin' to do anymore if we don't have permissions.
    if (hasPermission !== true) {
      return;
    }

    this.startScan(this.videoInputDevice);

    this.codeReader.torchAvailable.subscribe((value: boolean) => {
      this.torchCompatible.emit(value);
    });
  }

  /**
   * Executes some actions before destroy the component.
   */
  ngOnDestroy(): void {
    this.codeReader.destroy();
  }

  /**
   * Changes the supported code formats.
   * @param formats The formats to support.
   */
  setFormats(formats: BarcodeFormat[]): void {

    this.formats = formats;

    const hints = new Map<DecodeHintType, any>();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    this.codeReader = new BrowserMultiFormatReader(hints);

    this.restartScan();
  }

  /**
   * Properly changes the current target device.
   *
   * @param device
   */
  changeDevice(device: MediaDeviceInfo): void {
    this.videoInputDevice = device;
    this.startScan(device);
  }

  /**
   * Properly changes the current target device using it's deviceId.
   *
   * @param deviceId
   */
  changeDeviceById(deviceId: string): void {
    this.changeDevice(this.getDeviceById(deviceId));
  }

  /**
   * Properly returns the target device using it's deviceId.
   *
   * @param deviceId
   */
  getDeviceById(deviceId: string): MediaDeviceInfo {
    return this.videoInputDevices.find(device => device.deviceId === deviceId);
  }

  /**
   * Sets the permission value and emmits the event.
   */
  private setPermission(hasPermission: boolean | null) {
    this.hasPermission = hasPermission;
    this.permissionResponse.next(hasPermission);
    return this.permissionResponse;
  }

  /**
   * Gets and registers all cammeras.
   *
   * @todo Return a Promise.
   */
  async askForPermission(): Promise<boolean> {

    if (!this.hasNavigator) {
      console.error('zxing-scanner', 'askForPermission', 'Can\'t ask permission, navigator is not present.');
      this.setPermission(null);
      return this.hasPermission;
    }

    if (!this.isMediaDevicesSuported) {
      console.error('zxing-scanner', 'askForPermission', 'Can\'t get user media, this is not supported.');
      this.setPermission(null);
      return this.hasPermission;
    }

    let stream: MediaStream;

    try {
      // Will try to ask for permission
      stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    } catch (err) {
      return this.handlePermissionException(err);
    }

    let permission: boolean;

    try {

      // Start stream so Browser can display its permission-dialog
      this.codeReader.bindVideoSrc(this.previewElemRef.nativeElement, stream);

      // After permission was granted, we can stop it again
      stream.getVideoTracks().forEach(track => {
        track.stop();
      });

      // should stop the opened stream
      this.codeReader.unbindVideoSrc(this.previewElemRef.nativeElement);

      // if the scripts lives until here, that's only one mean:

      // permission granted
      permission = true;
      this.setPermission(permission);

    } catch (err) {

      console.error('zxing-scanner', 'askForPermission', err);

      // permission aborted
      permission = null;
      this.setPermission(permission);
    }

    // Returns the event emitter, so the dev can subscribe to it
    return permission;
  }

  /**
   * Returns the filtered permission.
   *
   * @param err
   */
  private handlePermissionException(err: DOMException): boolean {

    // failed to grant permission to video input

    console.warn('zxing-scanner', 'askForPermission', err);

    let permission: boolean;

    switch (err.name) {

      // usually caused by not secure origins
      case 'NotSupportedError':
        console.warn('@zxing/ngx-scanner', err.message);
        // could not claim
        permission = null;
        // can't check devices
        this._hasDevices = null;
        break;

      // user denied permission
      case 'NotAllowedError':
        console.warn('@zxing/ngx-scanner', err.message);
        // claimed and denied permission
        permission = false;
        // this means that input devices exists
        this._hasDevices = true;
        break;

      // the device has no attached input devices
      case 'NotFoundError':
        console.warn('@zxing/ngx-scanner', err.message);
        // no permissions claimed
        permission = null;
        // because there was no devices
        this._hasDevices = false;
        // tells the listener about the error
        this.camerasNotFound.next(err);
        break;

      case 'NotReadableError':
        console.warn('@zxing/ngx-scanner', 'Couldn\'t read the device(s)\'s stream, it\'s probably in use by another app.');
        // no permissions claimed
        permission = null;
        // there are devices, which I couldn't use
        this._hasDevices = false;
        // tells the listener about the error
        this.camerasNotFound.next(err);
        break;

      default:
        console.warn('@zxing/ngx-scanner', 'I was not able to define if I have permissions for camera or not.', err);
        // unknown
        permission = null;
        // this._hasDevices = undefined;
        break;

    }

    this.setPermission(permission);

    // tells the listener about the error
    this.permissionResponse.error(err);

    return permission;
  }

  /**
   * Starts the continuous scanning for the given device.
   *
   * @param deviceId The deviceId from the device.
   */
  scan(deviceId: string): void {
    try {
      const onDecodeComplete = ((result: Result) => {

        if (result) {
          this.dispatchScanSuccess(result);
        } else {
          this.dispatchScanFailure();
        }

        this.dispatchScanComplete(result);

      });
      
      this.codeReader.setDecodeCompleteCallback(onDecodeComplete);
      this.codeReader.decodeFromInputVideoDevice(deviceId, this.previewElemRef.nativeElement);

    } catch (err) {
      this.dispatchScanError(err);
      this.dispatchScanComplete(undefined);
    }
  }

  /**
   * Starts the scanning if allowed.
   *
   * @param device The device to be used in the scan.
   */
  startScan(device: MediaDeviceInfo): void {
    if (this.scannerEnabled && device) {
      this.scan(device.deviceId);
    }
  }

  /**
   * Stops the scan service.
   */
  resetScan(): void {
    this.codeReader.reset();
  }

  /**
   * Stops and starts back the scan.
   */
  restartScan(): void {
    this.resetScan();
    this.startScan(this.device);
  }

  /**
   * Dispatches the scan success event.
   *
   * @param result the scan result.
   */
  private dispatchScanSuccess(result: Result): void {
    this.scanSuccess.next(result.getText());
  }

  /**
   * Dispatches the scan failure event.
   */
  private dispatchScanFailure(): void {
    this.scanFailure.next();
  }

  /**
   * Dispatches the scan error event.
   *
   * @param err the error thing.
   */
  private dispatchScanError(error: any): void {
    this.scanError.next(error);
  }

  /**
   * Dispatches the scan event.
   *
   * @param result the scan result.
   */
  private dispatchScanComplete(result: Result): void {
    this.scanComplete.next(result);
  }

  /**
   * Enumerates all the available devices.
   */
  private async enumarateVideoDevices(): Promise<MediaDeviceInfo[]> {

    if (!this.hasNavigator) {
      console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, navigator is not present.');
      return;
    }

    if (!this.isEnumerateDevicesSuported) {
      console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, method not supported.');
      return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    this.videoInputDevices = [];

    for (const device of devices) {

      // @todo type this as `MediaDeviceInfo`
      const videoDevice: any = {};

      // tslint:disable-next-line:forin
      for (const key in device) {
        videoDevice[key] = device[key];
      }

      if (videoDevice.kind === 'video') {
        videoDevice.kind = 'videoinput';
      }

      if (!videoDevice.deviceId) {
        videoDevice.deviceId = (<any>videoDevice).id;
      }

      if (!videoDevice.label) {
        videoDevice.label = 'Camera (no permission 🚫)';
      }

      if (videoDevice.kind === 'videoinput') {
        this.videoInputDevices.push(videoDevice);
      }
    }

    return this.videoInputDevices;
  }
}
