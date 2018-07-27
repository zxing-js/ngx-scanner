import { MultiFormatReader, DecodeHintType, BinaryBitmap, Result } from '@zxing/library';

import { BrowserCodeReader } from './browser-code-reader';

export class BrowserMultiFormatReader extends BrowserCodeReader {

  protected readonly reader: MultiFormatReader;

  public constructor(
    hints: Map<DecodeHintType, any> = null,
    timeBetweenScansMillis: number = 500
  ) {
    const reader = new MultiFormatReader();
    reader.setHints(hints);
    super(reader, timeBetweenScansMillis);
  }

  /**
   * Overwrite decodeBitmap to call decodeWithState, which will pay
   * attention to the hints set in the constructor function
   */
  protected decodeBitmap(binaryBitmap: BinaryBitmap): Result {
    return this.reader.decodeWithState(binaryBitmap);
  }
}
