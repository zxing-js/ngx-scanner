/// <reference path="./image-capture.d.ts" />

import {
  BrowserMultiFormatReader,
  ChecksumException,
  Exception,
  FormatException,
  NotFoundException,
  Result,
} from '@zxing/library';

import {
  BehaviorSubject,
  Observable,
  Subscription
} from 'rxjs';

import { catchError } from 'rxjs/operators';

/**
 * Based on zxing-typescript BrowserCodeReader
 */
export class BrowserMultiFormatContinuousReader extends BrowserMultiFormatReader {

  /**
   * Used to control the decoding stream when it's open.
   */
  protected decodingStream: Subscription;

  /**
   * The track from camera.
   */
  protected track: MediaStreamTrack;

  /**
   * Says if there's a torch available for the current device.
   */
  protected _isTorchAvailable = new BehaviorSubject<boolean>(undefined);

  /**
   * Exposes _tochAvailable .
   */
  public get isTorchAvailable(): Observable<boolean> {
    return this._isTorchAvailable.asObservable();
  }

  /**
   * The device id of the current media device.
   */
  protected deviceId: string;

  /**
   * Starts the decoding from the current or a new video element.
   *
   * @param callbackFn The callback to be executed after every scan attempt
   * @param deviceId The device's to be used Id
   * @param videoElement A new video element
   */
  public async continuousDecodeFromInputVideoDevice(
    callbackFn?: (result: Result) => void,
    deviceId?: string,
    videoElement?: HTMLVideoElement
  ): Promise<void> {

    this.reset();

    this.prepareVideoElement(videoElement);

    // Keeps the deviceId between scanner resets.
    if (typeof deviceId !== 'undefined') {
      this.deviceId = deviceId;
    }

    if (typeof navigator === 'undefined') {
      return;
    }

    const video = typeof deviceId === 'undefined'
      ? { facingMode: { exact: 'environment' } }
      : { deviceId: { exact: deviceId } };

    const constraints: MediaStreamConstraints = {
      audio: false,
      video
    };

    try {

      const stream = await navigator
        .mediaDevices
        .getUserMedia(constraints);

      this.checkTorchCompatibility(stream);

      this.startDecodeFromStream(stream, () => {

        if (this.decodingStream) {
          this.decodingStream.unsubscribe();
        }

        this.decodingStream = this.decodeWithDelay(this.timeBetweenScansMillis)
          .pipe(catchError((e, r) => this.handleDecodeStreamError(e, r)))
          .subscribe(r => callbackFn(r));
      });

    } catch (err) {
      /* handle the error, or not */
      console.error(err);
    }
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

      compatible = !!capabilities.torch || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
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
  protected decodeWithDelay(delay: number = 500): Observable<Result> {

    const scan$ = new BehaviorSubject<Result>(undefined);

    this._decodeOnStreamWithDelay(scan$, delay);

    return scan$.asObservable();
  }

  /**
   * Decodes values in a stream with delays between scans.
   */
  private _decodeOnStreamWithDelay(scan$: BehaviorSubject<Result | Exception>, delay: number): void {

    let result: Result;

    try {
      result = this.decode();
      scan$.next(result);
    } catch (e) {
      scan$.error(e);
    }
    finally {
      const timeout = !result ? 0 : delay;
      setTimeout(() => this.decodeWithDelay(delay), timeout);
    }
  }

  /**
   * Administra um erro gerado durante o decode stream.
   */
  protected handleDecodeStreamError(err: Exception, caught: Observable<Result>): Observable<Result> {

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
   * Restarts the scanner.
   */
  protected restart(): void {
    // reset
    // start
    this.continuousDecodeFromInputVideoDevice(undefined, this.deviceId, this.videoElement);
  }


  /**
   * Stops the continuous scan and cleans the stream.
   */
  protected stopStreams(): void {

    super.stopStreams();

    if (this.decodingStream) {
      this.decodingStream.unsubscribe();
    }

  }

}
