import { Result, Exception } from '@zxing/library';

export interface ResultAndError {
  result?: Result;
  error?: Exception;
}
