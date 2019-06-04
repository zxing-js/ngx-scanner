import { BarcodeFormat } from '@zxing/library';

export const formatsAvailable = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.QR_CODE,
  BarcodeFormat.RSS_14,
];

export const formatNames = [
  'Aztec 2D barcode format.',
  'CODABAR 1D format.',
  'Code 39 1D format.',
  'Code 93 1D format.',
  'Code 128 1D format.',
  'Data Matrix 2D barcode format.',
  'EAN-8 1D format.',
  'EAN-13 1D format.',
  'ITF (Interleaved Two of Five) 1D format.',
  'MaxiCode 2D barcode format.',
  'PDF417 format.',
  'QR Code 2D barcode format.',
  'RSS 14',
  'RSS EXPANDED',
  'UPC-A 1D format.',
  'UPC-E 1D format.',
  'UPC/EAN extension format. Not a stand-alone format.',
];
