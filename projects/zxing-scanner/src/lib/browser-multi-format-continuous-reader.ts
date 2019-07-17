/// <reference path="./image-capture.d.ts" />

import { BrowserMultiFormatReader, ChecksumException, FormatException, NotFoundException, Result } from '@zxing/library';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResultAndError } from './ResultAndError';

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
   * The device id of the current media device.
   */
  private deviceId: string;

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
      // this.decodeFromInputVideoDeviceContinuously(deviceId, videoSource, (result, error) => scan$.next({ result, error }));
      this.getStreamForDevice({ deviceId })
        .then(stream => this.attachStreamToVideoAndCheckTorch(stream, videoSource))
        .then(videoElement => this.decodeOnSubject(scan$, videoElement, this.timeBetweenScansMillis));
    } catch (e) {
      scan$.error(e);
    }

    this._setScanStream(scan$);

    // @todo Find a way to emit a complete event on the scan stream once it's finished.

    return scan$.asObservable();
  }

  /**
   * Gets the media stream for certain device.
   * Falls back to any available device if no `deviceId` is defined.
   */
  public async getStreamForDevice({ deviceId }: Partial<MediaDeviceInfo>): Promise<MediaStream> {
    const constraints = this.getUserMediaConstraints(deviceId);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  }

  /**
   * Creates media steram constraints for certain `deviceId`.
   * Falls back to any environment available device if no `deviceId` is defined.
   */
  public getUserMediaConstraints(deviceId: string): MediaStreamConstraints {

    const video = typeof deviceId === 'undefined'
      ? { facingMode: { exact: 'environment' } }
      : { deviceId: { exact: deviceId } };

    const constraints: MediaStreamConstraints = { video };

    return constraints;
  }

  /**
   * Enables and disables the device torch.
   */
  public setTorch(on: boolean): void {

    if (!this._isTorchAvailable.value) {
      // compatibility not checked yet
      return;
    }

    const tracks = this.getVideoTracks(this.stream);

    if (on) {
      this.applyTorchOnTracks(tracks, true);
    } else {
      this.applyTorchOnTracks(tracks, false);
      // @todo check possibility to disable torch without restart
      this.restart();
    }
  }

  /**
   * Update the torch compatibility state and attachs the stream to the preview element.
   */
  private attachStreamToVideoAndCheckTorch(stream: MediaStream, videoSource: HTMLVideoElement): Promise<HTMLVideoElement> {
    this.updateTorchCompatibility(stream);
    return this.attachStreamToVideo(stream, videoSource);
  }

  /**
   * Checks if the stream supports torch control.
   *
   * @param stream The media stream used to check.
   */
  private async updateTorchCompatibility(stream: MediaStream): Promise<void> {

    const tracks = this.getVideoTracks(stream);

    for (const track of tracks) {
      if (await this.isTorchCompatible(track)) {
        this._isTorchAvailable.next(true);
        break;
      }
    }
  }

  /**
   *
   * @param stream The video stream where the tracks gonna be extracted from.
   */
  private getVideoTracks(stream: MediaStream) {
    let tracks = [];
    try {
      tracks = stream.getVideoTracks();
    }
    finally {
      return tracks || [];
    }
  }

  /**
   *
   * @param track The media stream track that will be checked for compatibility.
   */
  private async isTorchCompatible(track: MediaStreamTrack) {

    let compatible = false;

    try {
      const imageCapture = new ImageCapture(track);
      const capabilities = await imageCapture.getPhotoCapabilities();
      compatible = !!capabilities['torch'] || ('fillLightMode' in capabilities && capabilities.fillLightMode.length !== 0);
    }
    finally {
      return compatible;
    }
  }

  /**
   * Apply the torch setting in all received tracks.
   */
  private applyTorchOnTracks(tracks: MediaStreamTrack[], state: boolean) {
    tracks.forEach(track => track.applyConstraints({
      advanced: [<any>{ torch: state, fillLightMode: state ? 'torch' : 'none' }]
    }));
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
  private decodeOnSubject(scan$: BehaviorSubject<ResultAndError>, videoElement: HTMLVideoElement, delay: number): void {

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
  private restart(): Observable<ResultAndError> {
    // reset
    // start
    return this.continuousDecodeFromInputVideoDevice(this.deviceId, this.videoElement);
  }

}
