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

import { Result, DecodeHintType, BarcodeFormat, ArgumentException } from '@zxing/library';

import { BrowserMultiFormatContinuousReader } from './browser-multi-format-continuous-reader';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'zxing-scanner',
  templateUrl: './zxing-scanner.component.html',
  styleUrls: ['./zxing-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZXingScannerComponent implements AfterViewInit, OnDestroy, OnChanges {

  /**
   * Supported Hints map.
   */
  private _hints: Map<DecodeHintType, any>;

  /**
   * The ZXing code reader.
   */
  private codeReader: BrowserMultiFormatContinuousReader;

  /**
   * The device that should be used to scan things.
   */
  private _device: MediaDeviceInfo;


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
   * If the user-agent allowed the use of the camera or not.
   */
  private hasPermission: boolean;

  /**
   * Reference to the preview element, should be the `video` tag.
   */
  @ViewChild('preview')
  previewElemRef: ElementRef;

  /**
   * Allow start scan or not.
   */
  @Input()
  scannerEnabled = true;

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
   * Emitts events when the torch compatibility is changed.
   */
  @Output()
  torchCompatible: EventEmitter<boolean>;

  /**
   * Emitts events when a scan is successful performed, will inject the string value of the QR-code to the callback.
   */
  @Output()
  scanSuccess: EventEmitter<string>;

  /**
   * Emitts events when a scan fails without errors, usefull to know how much scan tries where made.
   */
  @Output()
  scanFailure: EventEmitter<void>;

  /**
   * Emitts events when a scan throws some error, will inject the error to the callback.
   */
  @Output()
  scanError: EventEmitter<Error>;

  /**
   * Emitts events when a scan is performed, will inject the Result value of the QR-code scan (if available) to the callback.
   */
  @Output()
  scanComplete: EventEmitter<Result>;

  /**
   * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
   */
  @Output()
  camerasFound: EventEmitter<MediaDeviceInfo[]>;

  /**
   * Emitts events when no cameras are found, will inject an exception (if available) to the callback.
   */
  @Output()
  camerasNotFound: EventEmitter<any>;

  /**
   * Emitts events when the users answers for permission.
   */
  @Output()
  permissionResponse: EventEmitter<boolean>;

  /**
   * Emitts events when has devices status is update.
   */
  @Output()
  hasDevices: EventEmitter<boolean>;

  /**
   * User device input
   */
  @Input()
  set device(device: MediaDeviceInfo|null) {

    if (this.isAlreadyDefinedDevice(device)) {
      return;
    }

    // in order to change the device the codeReader gotta be reseted
    this.scannerStop();

    if (!device && device !== null) {
      throw new ArgumentException('The `device` must be a valid MediaDeviceInfo or null.');
    }

    if (!!device) {
      // starts if enabled and set the current device
      this.startScan(device);
    }
  }

  @Output()
  deviceChange: EventEmitter<MediaDeviceInfo>;

  /**
   * User device acessor.
   */
  get device() {
    return this._device;
  }

  /**
   * Returns all the registered formats.
   */
  get formats(): BarcodeFormat[] {
    return this.hints.get(DecodeHintType.POSSIBLE_FORMATS);
  }

  /**
   * Registers formats the scanner should support.
   *
   * @param input BarcodeFormat or case-insensitive string array.
   */
  @Input()
  set formats(input: BarcodeFormat[]) {

    if (typeof input === 'string') {
      throw new Error('Invalid formats, make sure the [formats] input is a binding.');
    }

    // formats may be set from html template as BarcodeFormat or string array
    const formats = input.map(f => this.getBarcodeFormatOrFail(f));

    // updates the hints
    this.hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

    // new instance with new hints.
    this.scannerRestart();
  }

  /**
   * Returns all the registered hints.
   */
  get hints() {
    return this._hints;
  }

  /**
   * Allow start scan or not.
   */
  @Input()
  set torch(on: boolean) {
    this.codeReader.setTorch(on);
  }

  /**
   * If is `tryHarder` enabled.
   */
  get tryHarder(): boolean {
    return this.hints.get(DecodeHintType.TRY_HARDER);
  }

  /**
   * Enable/disable tryHarder hint.
   */
  @Input()
  set tryHarder(enable: boolean) {
    if (enable) {
      this.hints.set(DecodeHintType.TRY_HARDER, true);
    } else {
      this.hints.delete(DecodeHintType.TRY_HARDER);
    }

    // new instance with new hints.
    this.scannerRestart();
  }

  /**
   * Constructor to build the object and do some DI.
   */
  constructor() {
    // instance based emitters
    this.torchCompatible = new EventEmitter<boolean>();
    this.scanSuccess = new EventEmitter<string>();
    this.scanFailure = new EventEmitter<void>();
    this.scanError = new EventEmitter<Error>();
    this.scanComplete = new EventEmitter<Result>();
    this.camerasFound = new EventEmitter<MediaDeviceInfo[]>();
    this.camerasNotFound = new EventEmitter<any>();
    this.permissionResponse = new EventEmitter<boolean>();
    this.hasDevices = new EventEmitter<boolean>();
    this.deviceChange = new EventEmitter<MediaDeviceInfo>();

    // computed data
    this._hints = new Map<DecodeHintType, any>();
    this.hasNavigator = typeof navigator !== 'undefined';
    this.isMediaDevicesSuported = this.hasNavigator && !!navigator.mediaDevices;
    this.isEnumerateDevicesSuported = !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);

    // will start codeReader if needed.
    this.formats = [BarcodeFormat.QR_CODE];
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
   * Initializes the component without starting the scanner.
   */
  async initAutostartOff(): Promise<void> {

    // do not ask for permission when autostart is off

    // just update devices information
    await this.updateVideoInputDevices();
  }

  /**
   * Initializes the component and starts the scanner.
   * Permissions are asked to accomplish that.
   */
  async initAutostartOn(): Promise<void> {

    // Asks for permission before enumerating devices so it can get all the device's info
    const hasPermission = await this.askForPermission();

    const devices = await this.updateVideoInputDevices();

    // from this point, things gonna need permissions
    if (hasPermission !== true) {
      // so we can return if we don't have'em
      return;
    }

    this.autostartScan(devices);
  }

  /**
   * Checks if the given device is the current defined one.
   */
  isAlreadyDefinedDevice(device: MediaDeviceInfo) {
    return this._device && device && device.deviceId === this._device.deviceId;
  }

  /**
   * Executed after the view initialization.
   */
  async ngAfterViewInit(): Promise<void> {

    const refStatus = !this.setupPreviewRef(this.previewElemRef);

    if (refStatus) {
      console.warn('zxing-scanner', 'Preview element not found!');
      return;
    }

    // makes torch availability information available to user
    this.codeReader.torchAvailable.subscribe((x: boolean) => this.torchCompatible.emit(x));

    if (!this.autostartScan) {
      console.warn('New feature \'autostart\' disabled, be careful. Permissions and devices recovery has to be run manually.');

      // does the necessary configuration without autostarting
      this.initAutostartOff();

      return;
    }

    // configurates the component and starts the scanner
    this.initAutostartOn();
  }

  /**
   * Manages the bindinded property changes.
   */
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.scannerEnabled) {
      if (!this.scannerEnabled) {
        this.scannerStop();
      } else if (this._device) {
        this.scannerStart(this._device.deviceId);
      }
    }

  }

  /**
   * Executes some actions before destroy the component.
   */
  ngOnDestroy(): void {
    this.scannerStop();
  }

  /**
   * Stops and starts back the scan.
   */
  restartScan(): void {
    // @todo check if it's scanning
    this.scannerStop();
    this.startScan(this._device);
  }

  /**
   * Starts scanning if allowed.
   *
   * @param device The device to be used in the scan.
   */
  startScan(device: MediaDeviceInfo): void {

    if (!device) {
      throw new Error('Unable to start scan on invalid device!');
    }

    const deviceId = device.deviceId;

    if (this.isAlreadyDefinedDevice(device)) {
      // no device change
      return;
    }

    if (this.scannerEnabled) {
      this.setDevice(device);
      this.scannerStart(deviceId);
    }
  }

  /**
   *
   */
  setupPreviewRef(previewElemRef: ElementRef<any>): boolean {

    // Chrome 63 fix
    if (!previewElemRef) {
      return false;
    }

    const el = previewElemRef.nativeElement;

    // iOS 11 Fix
    el.setAttribute('autoplay', false);
    el.setAttribute('muted', true);
    el.setAttribute('playsinline', true);
    el.setAttribute('autofocus', this.autofocusEnabled);

    return true;
  }

  /**
   * Discovers and updates known video input devices.
   */
  async updateVideoInputDevices(): Promise<MediaDeviceInfo[]> {

    // permissions aren't needed to get devices, but to access them and their info
    const devices = await this.discoverVideoInputDevices();

    // stores discovered devices and updates information
    this.setVideoInputDevices(devices);

    return devices;
  }

  /**
   * Starts the scanner with the first available device.
   */
  private autostartScan(devices: MediaDeviceInfo[]) {
    const firstDevice = devices.find(device => !!device);

    if (!firstDevice) {
      throw new Error('Implossible to autostart, no device available.');
    }

    this.startScan(firstDevice);
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
  private async discoverVideoInputDevices(): Promise<MediaDeviceInfo[]> {

    if (!this.hasNavigator) {
      console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, navigator is not present.');
      return;
    }

    if (!this.isEnumerateDevicesSuported) {
      console.error('zxing-scanner', 'enumarateVideoDevices', 'Can\'t enumerate devices, method not supported.');
      return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    const videoInputDevices = [];

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
        videoInputDevices.push(videoDevice);
      }
    }

    return videoInputDevices;
  }

  /**
   * Returns the filtered permission.
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
        this.hasDevices.next(null);
        break;

      // user denied permission
      case 'NotAllowedError':
        console.warn('@zxing/ngx-scanner', err.message);
        // claimed and denied permission
        permission = false;
        // this means that input devices exists
        this.hasDevices.next(true);
        break;

      // the device has no attached input devices
      case 'NotFoundError':
        console.warn('@zxing/ngx-scanner', err.message);
        // no permissions claimed
        permission = null;
        // because there was no devices
        this.hasDevices.next(false);
        // tells the listener about the error
        this.camerasNotFound.next(err);
        break;

      case 'NotReadableError':
        console.warn('@zxing/ngx-scanner', 'Couldn\'t read the device(s)\'s stream, it\'s probably in use by another app.');
        // no permissions claimed
        permission = null;
        // there are devices, which I couldn't use
        this.hasDevices.next(false);
        // tells the listener about the error
        this.camerasNotFound.next(err);
        break;

      default:
        console.warn('@zxing/ngx-scanner', 'I was not able to define if I have permissions for camera or not.', err);
        // unknown
        permission = null;
        // this.hasDevices.next(undefined;
        break;

    }

    this.setPermission(permission);

    // tells the listener about the error
    this.permissionResponse.error(err);

    return permission;
  }

  /**
   * Returns a valid BarcodeFormat or fails.
   */
  private getBarcodeFormatOrFail(format: string | BarcodeFormat): BarcodeFormat {
    return typeof format === 'string'
      ? BarcodeFormat[format.trim().toUpperCase()]
      : format;
  }

  /**
   * Stops old `codeReader` and starts scanning in a new one.
   */
  private scannerRestart(): void {

    let prevDevice: MediaDeviceInfo;

    if (!this._device) {
      prevDevice = this.scannerStop();
    }

    this.codeReader = new BrowserMultiFormatContinuousReader(this.hints);

    if (prevDevice) {
      this.scannerStart(prevDevice.deviceId);
    }
  }

  /**
   * Starts the continuous scanning for the given device.
   *
   * @param deviceId The deviceId from the device.
   */
  private scannerStart(deviceId: string): void {
    try {

      this.codeReader.continuousDecodeFromInputVideoDevice((result: Result) => {

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
   * Stops the code reader and returns the previous selected device.
   */
  private scannerStop(): MediaDeviceInfo {

    if (!this.codeReader) {
      return;
    }

    const device = this._device;

    this.setDevice(null);

    this.codeReader.stop();

    return device;
  }

  /**
   * Sets the private _device value and emits a change event.
   */
  private setDevice(device: MediaDeviceInfo): void {
    device = device || null;
    this._device = device;
    this.deviceChange.emit(device);
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
   * Sets the video input devices and the observables that depends on it.
   */
  private setVideoInputDevices(devices: MediaDeviceInfo[]) {

    if (devices && devices.length > 0) {
      this.hasDevices.next(true);
      this.camerasFound.next(devices);
    } else {
      this.hasDevices.next(false);
      this.camerasNotFound.next();
    }

    this.videoInputDevices = devices;
  }
}
