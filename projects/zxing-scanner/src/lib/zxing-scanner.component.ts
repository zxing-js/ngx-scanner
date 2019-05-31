import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

import {
  ArgumentException,
  BarcodeFormat,
  ChecksumException,
  DecodeHintType,
  Exception,
  FormatException,
  NotFoundException,
  Result
} from '@zxing/library';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrowserMultiFormatContinuousReader } from './browser-multi-format-continuous-reader';

@Component({
  selector: 'zxing-scanner',
  templateUrl: './zxing-scanner.component.html',
  styleUrls: ['./zxing-scanner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZXingScannerComponent implements AfterViewInit, OnDestroy {

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
   * The device that should be used to scan things.
   */
  private _scannerEnabled = true;

  /**
   * Has `navigator` access.
   */
  private hasNavigator: boolean;

  /**
   * Says if some native API is supported.
   */
  private isMediaDevicesSuported: boolean;

  /**
   * If the user-agent allowed the use of the camera or not.
   */
  private hasPermission: boolean | null;

  /**
   * Reference to the preview element, should be the `video` tag.
   */
  @ViewChild('preview')
  previewElemRef: ElementRef<HTMLVideoElement>;

  /**
   * Enable or disable autofocus of the camera (might have an impact on performance)
   */
  @Input()
  autofocusEnabled = true;

  /**
   * If the scanner should autostart with the first available device.
   */
  @Input()
  autostart = true;

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
  set device(device: MediaDeviceInfo | null) {

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

  /**
   * Emits when the current device is changed.
   */
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
   * Allow start scan or not.
   */
  @Input()
  set scannerEnabled(enabled: boolean) {

    this._scannerEnabled = Boolean(enabled);

    if (!this._scannerEnabled) {
      this.scannerStop();
    } else if (this._device) {
      this.scannerStart(this._device.deviceId);
    }
  }

  /**
   * Tells if the scanner is enabled or not.
   */
  get scannerEnabled(): boolean {
    return this._scannerEnabled;
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
      console.error('@zxing/ngx-scanner', 'Can\'t ask permission, navigator is not present.');
      this.setPermission(null);
      return this.hasPermission;
    }

    if (!this.isMediaDevicesSuported) {
      console.error('@zxing/ngx-scanner', 'Can\'t get user media, this is not supported.');
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

    const permission = !!stream;
    this.setPermission(permission);

    // Returns the permission
    return permission;
  }

  /**
   * Initializes the component without starting the scanner.
   */
  private async initAutostartOff(): Promise<void> {

    // do not ask for permission when autostart is off

    // just update devices information
    await this.updateVideoInputDevices();
  }

  /**
   * Initializes the component and starts the scanner.
   * Permissions are asked to accomplish that.
   */
  private async initAutostartOn(): Promise<void> {

    // Asks for permission before enumerating devices so it can get all the device's info
    const hasPermission = await this.askForPermission();

    const devices = await this.updateVideoInputDevices();

    // from this point, things gonna need permissions
    if (hasPermission !== true) {
      // so we can return if we don't have'em
      return;
    }

    this.autostartScanner(devices);
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

    // makes torch availability information available to user
    this.codeReader.isTorchAvailable.subscribe((x: boolean) => this.torchCompatible.emit(x));

    if (!this.autostart) {
      console.warn('New feature \'autostart\' disabled, be careful. Permissions and devices recovery has to be run manually.');

      // does the necessary configuration without autostarting
      this.initAutostartOff();

      return;
    }

    // configurates the component and starts the scanner
    this.initAutostartOn();
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

    if (this._scannerEnabled) {
      this.setDevice(device);
      this.scannerStart(deviceId);
    }
  }

  /**
   * Discovers and updates known video input devices.
   */
  async updateVideoInputDevices(): Promise<MediaDeviceInfo[]> {

    // permissions aren't needed to get devices, but to access them and their info
    const devices = await this.codeReader.listVideoInputDevices();

    // stores discovered devices and updates information
    if (devices && devices.length > 0) {
      this.hasDevices.next(true);
      this.camerasFound.next(devices);
    } else {
      this.hasDevices.next(false);
      this.camerasNotFound.next();
    }

    return devices;
  }

  /**
   * Starts the scanner with the first available device.
   */
  private autostartScanner(devices: MediaDeviceInfo[]) {
    const firstDevice = devices.find(device => !!device);

    if (!firstDevice) {
      throw new Error('Implossible to autostart, no input devices available.');
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
   * Returns the filtered permission.
   */
  private handlePermissionException(err: DOMException): boolean {

    // failed to grant permission to video input
    console.error('@zxing/ngx-scanner', 'Error when asking for permission.', err);

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
   * Administra um erro gerado durante o decode stream.
   */
  private handleDecodeStreamError(err: Exception, caught: Observable<Result>): Observable<Result> {

    if (
      // scan Failure - found nothing, no error
      err instanceof NotFoundException ||
      // scan Error - found the QR but got error on decoding
      err instanceof ChecksumException ||
      err instanceof FormatException
    ) {
      return caught;
    }

    throw err;
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

    const videoElement = this.previewElemRef.nativeElement;

    try {
      const scan$ = this.codeReader.continuousDecodeFromInputVideoDevice(deviceId, videoElement);

      const next = (result: Result) => this._onDecodeResult(result);
      const error = (err: any) => this.dispatchScanError(err);

      scan$.pipe(catchError(this.handleDecodeStreamError)).subscribe(next, error);

    } catch (err) {
      this.dispatchScanError(err);
      this.dispatchScanComplete(undefined);
    }
  }

  /**
   * Handles decode results.
   */
  private _onDecodeResult(result: Result): void {

    if (result) {
      this.dispatchScanSuccess(result);
    } else {
      this.dispatchScanFailure();
    }

    this.dispatchScanComplete(result);
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

    this.codeReader.reset();

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

}
