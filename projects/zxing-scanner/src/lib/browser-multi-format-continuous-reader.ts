import { ChecksumException, FormatException, NotFoundException } from '@zxing/library';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResultAndError } from './ResultAndError';

/**
 * Based on zxing-typescript BrowserCodeReader
 */
export class BrowserMultiFormatContinuousReader extends BrowserMultiFormatReader {

  /**
   * Allows to call scanner controls API while scanning.
   * Will be undefined if no scanning is runnig.
   */
  protected scannerControls: IScannerControls;

  /**
   * Gets the media stream for certain device.
   * Falls back to any available device if no `deviceId` is defined.
   */
  public static async getStreamForDevice({ deviceId }: Partial<MediaDeviceInfo>): Promise<MediaStream> {
    const constraints = BrowserMultiFormatContinuousReader.getUserMediaConstraints(deviceId);
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  }

  /**
   * Creates media steram constraints for certain `deviceId`.
   * Falls back to any environment available device if no `deviceId` is defined.
   */
  public static getUserMediaConstraints(deviceId: string): MediaStreamConstraints {

    const video = typeof deviceId === 'undefined'
      ? { facingMode: { exact: 'environment' } }
      : { deviceId: { exact: deviceId } };

    const constraints: MediaStreamConstraints = { video };

    return constraints;
  }

  /**
   * Returns the code reader scanner controls.
   */
  public getScannerControls(): IScannerControls {
    if (!this.scannerControls) {
      throw new Error('No scanning is running at the time.');
    }
    return this.scannerControls;
  }

  /**
   * Starts the decoding from the current or a new video element.
   *
   * @param deviceId The device's to be used Id
   * @param previewEl A new video element
   */
  public async scanFromDeviceObservable(
    deviceId?: string,
    previewEl?: HTMLVideoElement
  ): Promise<Observable<ResultAndError>> {

    const scan$ = new BehaviorSubject<ResultAndError>({});

    try {
      const stream = await BrowserMultiFormatContinuousReader.getStreamForDevice({ deviceId });
      this.scannerControls = await this.decodeFromStream(stream, previewEl, (result, error, controls) => {

        // stops loop
        if (scan$.isStopped) {
          controls.stop();
          this.scannerControls = undefined;
          return;
        }

        if (!error) {
          scan$.next({ result });
          return;
        }

        const errorName = error.name;

        // stream cannot stop on fails.
        if (
          // scan Failure - found nothing, no error
          errorName === NotFoundException.name ||
          // scan Error - found the QR but got error on decoding
          errorName === ChecksumException.name ||
          errorName === FormatException.name
        ) {
          scan$.next({ error });
          return;
        }

        // probably fatal error
        scan$.error(error);
        this.scannerControls = undefined;
        return;
      });
    } catch (e) {
      scan$.error(e);
      this.scannerControls = undefined;
    }

    // @todo Find a way to emit a complete event on the scan stream once it's finished.

    return scan$.asObservable();
  }
}
