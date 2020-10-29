import { ChecksumException, Exception, FormatException, NotFoundException } from '@zxing/library';
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
      const controls = await this.decodeFromVideoDevice(deviceId, previewEl, (result, error) => {

        if (!error) {
          scan$.next({ result });
          return;
        }

        const errorKind = error.getKind();

        // stream cannot stop on fails.
        if (
          // scan Failure - found nothing, no error
          errorKind === NotFoundException.kind ||
          // scan Error - found the QR but got error on decoding
          errorKind === ChecksumException.kind ||
          errorKind === FormatException.kind
        ) {
          scan$.next({ error });
          return;
        }

        // probably fatal error
        scan$.error(error);
        controls.stop();
        this.scannerControls = undefined;
        return;
      });

      this.scannerControls = {
        ...controls,
        stop() {
          controls.stop();
          scan$.complete();
        },
      };
    } catch (e) {
      scan$.error(e);
      this.scannerControls?.stop();
      this.scannerControls = undefined;
    }

    return scan$.asObservable();
  }
}
