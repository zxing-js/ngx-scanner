/// <reference path="./image-capture.d.ts" />

import { BrowserMultiFormatReader, Result, Exception, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ResultAndError {
  result?: Result;
  error?: Exception;
}

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
  private scanStream: BehaviorSubject<ResultAndError>;

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
  ): Observable<ResultAndError> {

    this.reset();

    // Keeps the deviceId between scanner resets.
    if (typeof deviceId !== 'undefined') {
      this.deviceId = deviceId;
    }

    if (typeof navigator === 'undefined') {
      return;
    }

    const scan$ = new BehaviorSubject<ResultAndError>({});

    try {
      this.getStreamForDevice({ deviceId })
        .then(stream => this.attachStreamToVideo(stream, videoSource))
        .then(videoElement => this.decodeOnSubject(scan$, videoElement, this.timeBetweenScansMillis));
    } catch (e) {
      scan$.error(e);
    }

    this._setScanStream(scan$);

    return scan$.asObservable();
  }

  /**
   * Starts the decoding from the media stream and adds the stream to the video element.
   *
   * @param callbackFn The callback to be executed after every scan attempt
   * @param deviceId The device's to be used Id
   * @param videoSource A new video element
   */
  public decodeFromMediaStream(
    stream: MediaStream,
    videoSource?: HTMLVideoElement
  ): Observable<ResultAndError> {

    this.reset();

    if (typeof navigator === 'undefined') {
      return;
    }

    const scan$ = new BehaviorSubject<ResultAndError>({});

    try {
      this.attachStreamToVideo(stream, videoSource)
        .then(videoElement => this.decodeOnSubject(scan$, videoElement, this.timeBetweenScansMillis));
    } catch (e) {
      scan$.error(e);
    }

    return scan$.asObservable();
  }

  /**
   * {@inheritdoc}
   * Also, checks for torch compatibility.
   */
  protected async attachStreamToVideo(stream: MediaStream, videoSource: HTMLVideoElement): Promise<HTMLVideoElement> {
    this.checkTorchCompatibility(stream);
    return super.attachStreamToVideo(stream, videoSource);
  }

  /**
   * Gets the media stream for certain device.
   * Falls back to any available device if no `deviceId` is defined.
   */
  public getStreamForDevice({ deviceId }: Partial<MediaDeviceInfo>): Promise<MediaStream> {
    const constraints = this.getUserMediaConstraints(deviceId);
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * Creates media steram constraints for certain `deviceId`.
   * Falls back to any environment available device if no `deviceId` is defined.
   */
  public getUserMediaConstraints(deviceId: string): MediaStreamConstraints {

    const video = typeof deviceId === 'undefined'
      ? { facingMode: 'environment' }
      : { deviceId: { exact: deviceId } };

    const constraints: MediaStreamConstraints = { video };

    return constraints;
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
      track = getStreamFirstTrack(stream);
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
   * Correctly sets a new scanStream value.
   */
  private _setScanStream(scan$: BehaviorSubject<ResultAndError>): void {
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
   *
   * @param scan$ The subject to receive the values.
   * @param videoElement The video element the decode will be applied.
   * @param delay The delay between decode results.
   */
  protected decodeOnSubject(scan$: BehaviorSubject<ResultAndError>, videoElement: HTMLVideoElement, delay: number): void {

    // stops loop
    if (scan$.isStopped) {
      return;
    }

    let result: Result;

    try {
      result = this.decode(videoElement);
      scan$.next({ result });
    } catch (error) {
      // stream cannot stop on fails.
      if (
        !error ||
        // scan Failure - found nothing, no error
        error instanceof NotFoundException ||
        // scan Error - found the QR but got error on decoding
        error instanceof ChecksumException ||
        error instanceof FormatException
      ) {
        scan$.next({ error });
      } else {
        scan$.error(error);
      }
    } finally {
      const timeout = !result ? 0 : delay;
      setTimeout(() => this.decodeOnSubject(scan$, videoElement, delay), timeout);
    }
  }

  /**
   * Restarts the scanner.
   */
  protected restart(): Observable<ResultAndError> {
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

function getStreamFirstTrack(stream: MediaStream): MediaStreamTrack {
  return stream.getVideoTracks()[0];
}

