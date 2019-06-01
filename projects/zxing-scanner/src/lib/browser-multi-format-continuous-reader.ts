/// <reference path="./image-capture.d.ts" />

import { BrowserMultiFormatReader, Result } from '@zxing/library';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Based on zxing-typescript BrowserCodeReader
 */
export class BrowserMultiFormatContinuousReader extends BrowserMultiFormatReader {

  /**
   * Exposes _tochAvailable .
   */
  public get isTorchAvailable(): Observable<boolean> {
    return this._isTorchAvailable.asObservable();
  }

  /**
   * Says if there's a torch available for the current device.
   */
  private _isTorchAvailable = new BehaviorSubject<boolean>(undefined);

  /**
   * The track from camera.
   */
  protected track: MediaStreamTrack;

  /**
   * The device id of the current media device.
   */
  protected deviceId: string;

  /**
   * If there's some scan stream open, it shal be here.
   */
  private scanStream: BehaviorSubject<Result>;

  /**
   * Starts the decoding from the current or a new video element.
   *
   * @param callbackFn The callback to be executed after every scan attempt
   * @param deviceId The device's to be used Id
   * @param videoSource A new video element
   */
  public continuousDecodeFromInputVideoDevice(
    deviceId?: string,
    videoSource?: HTMLVideoElement
  ): Observable<Result> {

    this.reset();

    // Keeps the deviceId between scanner resets.
    if (typeof deviceId !== 'undefined') {
      this.deviceId = deviceId;
    }

    if (typeof navigator === 'undefined') {
      return;
    }

    const video = typeof deviceId === 'undefined'
      ? { facingMode: 'environment' }
      : { deviceId: { exact: deviceId } };

    const constraints: MediaStreamConstraints = { video };

    const scan$ = new BehaviorSubject<Result>(undefined);

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        this.checkTorchCompatibility(stream);
        return this.attachStreamToVideo(stream, videoSource);
      })
      .then(videoElement =>
        this.decodeWithDelay(this.timeBetweenScansMillis, videoElement)
          .subscribe(v => scan$.next(v), e => scan$.error(e), () => scan$.complete())
      );

    return scan$.asObservable();
  }

  /**
   * Checks if the stream supports torch control.
   *
   * @param stream The media stream used to check.
   */
  protected async checkTorchCompatibility(stream: MediaStream): Promise<void> {

    let compatible = false;
    let track = null;

    try {
      track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const capabilities = await imageCapture.getPhotoCapabilities();

      compatible = !!capabilities['torch'] || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
    }
    finally {
      this._isTorchAvailable.next(compatible);
      this.track = track;
    }
  }

  /**
   * Enables and disables the device torch.
   */
  public setTorch(on: boolean): void {

    if (!this._isTorchAvailable.value) {
      // compatibility not checked yet
      return;
    }

    if (on) {
      this.track.applyConstraints({
        advanced: [<any>{ torch: true }]
      });
    } else {
      // @todo check possibility to disable torch without restart
      this.restart();
    }
  }

  /**
   * Opens a decoding stream.
   */
  protected decodeWithDelay(delay: number = 500, videoElement: HTMLVideoElement): Observable<Result> {

    const scan$ = new BehaviorSubject<Result>(undefined);

    this._decodeOnStreamWithDelay(scan$, videoElement, delay);

    this._setScanStream(scan$);

    return scan$.asObservable();
  }

  /**
   * Correctly sets a new scanStream value.
   */
  private _setScanStream(scan$: BehaviorSubject<Result>): void {
    // cleans old stream
    this._cleanScanStream();
    // sets new stream
    this.scanStream = scan$;
  }

  /**
   * Cleans any old scan stream value.
   */
  private _cleanScanStream(): void {

    if (this.scanStream && !this.scanStream.isStopped) {
      this.scanStream.complete();
    }

    this.scanStream = null;
  }

  /**
   * Decodes values in a stream with delays between scans.
   */
  private _decodeOnStreamWithDelay(scan$: BehaviorSubject<Result>, videoElement: HTMLVideoElement, delay: number): void {

    // stops loop
    if (scan$.isStopped) {
      return;
    }

    let result: Result;

    try {
      result = this.decode(videoElement);
      scan$.next(result);
    } catch (e) {
      scan$.error(e);
    } finally {
      const timeout = !result ? 0 : delay;
      setTimeout(() => this._decodeOnStreamWithDelay(scan$, videoElement, delay), timeout);
    }
  }

  /**
   * Restarts the scanner.
   */
  protected restart(): Observable<Result> {
    // reset
    // start
    return this.continuousDecodeFromInputVideoDevice(this.deviceId, this.videoElement);
  }

  /**
   * Stops the continuous scan and cleans the stream.
   */
  protected stopStreams(): void {
    super.stopStreams();
    this._cleanScanStream();
  }

}
