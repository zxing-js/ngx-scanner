[![NPM version](https://img.shields.io/npm/v/ngx-zxing.svg?&label=npm)](https://www.npmjs.com/package/ngx-zxing)
[![Downloads](https://img.shields.io/npm/dm/ngx-zxing.svg)](https://npmjs.org/package/ngx-zxing)
[![Dependency Status](https://david-dm.org/werthdavid/ngx-zxing.svg)](https://david-dm.org/werthdavid/ngx-zxing)
[![Build Status](https://secure.travis-ci.org/werthdavid/ngx-zxing.svg)](https://travis-ci.org/werthdavid/ngx-zxing)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7e108806ba914d64ac77c19fd01548c9)](https://www.codacy.com/app/werthdavid/ngx-zxing?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=werthdavid/ngx-zxing&amp;utm_campaign=Badge_Grade)
<img align="right" src="https://user-images.githubusercontent.com/3942006/34657626-336523d4-f40f-11e7-8160-b523183655c7.png"/>

# ngx-scanner

> Angular QR-Code scanner component.

## Features & Hints

- Supports continuous scanning.
- Supports iOS 11 (only in Safari via HTTPS).
- There is a configurable delay of 1500ms after each successful scan, before a new QR-Code can be detected.
- Nice devs behind it. 🤓

## Demo

> Previews needs to be opened in new standalone windows.

- [StackBlitz](https://zxing-ngx-scanner.stackblitz.io/)
- [Plunkr](https://plnkr.co/edit/U13ufJHexw2ugZbHx8kR?p=preview) _`v0.3.x`_

## Installation

To install this package, run:

```bash
yarn add @zxing/ngx-scanner@latest
```

or

```bash
npm i @zxing/ngx-scanner@latest --save
```

Then import it into your Angular `AppModule`:

```typescript
// Common imports
import { NgModule /* , ... */ } from '@angular/core';

// Import the package's module
import { NgxZxingModule } from 'ngx-zxing';

@NgModule({
    declarations: [ /* AppComponent ... */ ],
    imports: [

        // BrowserModule,
        // ...

        // ZXing scanner module
        NgxZxingModule.forRoot(),

        // another imports...
    ],
    // ...
})
export class AppModule { }
```

## Usage

Once the package is imported, you can use it in your Angular application:

```html
<ngx-zxing
    [scannerActive]="scannerActive"
    [autofocusEnabled]="autofocusEnabled"
    [device]="selectedDevice"
    [cssClass]="'small-video'"
    (camerasFound)="displayCameras($event)"
    (scanSuccess)="handleQrCodeResult($event)"
></ngx-zxing>
```

- `scannerActive` can be used to start and stop the scanning (defaults to `true`)
- `autofocusEnabled` can be used to enable or disable the autofocus-feature of the camera (defaults to `true`)
- `device` is the video-device used for scanning (use one of the devices emitted by `camerasFound`)
- `cssClass` this CSS-class name will be appended to the video-element e.g. for resizing it (see below)
- `camerasFound` will emit an array of video-devices after view was initialized
- `scanSuccess` will emit the result as string, after a valid QR-Code was scanned

### Change the size of the preview-element

In your CSS, define an extra class and pass it to the component with the `cssClass`-parameter. CSS might look like this:

```css
.small-video {
    max-height: 70vh;
    width: 100vw;
    object-fit: contain;
}
```

## API

| Method              | Parameters                                     | Returns                          | Description                                                  |
|---------------------|------------------------------------------------|----------------------------------|--------------------------------------------------------------|
| **changeDevice**    | `device: MediaDeviceInfo`                      | `void`                           | Allows you to properly change the scanner device on the fly. |
| **camerasFound**    | `callback: (devices: MediaDeviceInfo[]`) => {} | `EventEmitter<MediaDeviceInfo >` | Emits an event when cameras are found.                       |
| **camerasNotFound** | `callback: (): void => {}`                     | `EventEmitter<void>`             | Emits an event when cameras are not found.                   |
| **scanSuccess**     | `callback: (result: string): void => {}`       | `EventEmitter<string>`           | Emits an event when a scan is successful performed.          |
| **scanFailure**     | `callback: (): void => {}`                     | `EventEmitter<void>`             | Emits an event when a scan fails.                            |
| **scanError**       | `callback: (error: any): void => {}`           | `EventEmitter<any>`              | Emits an event when a scan throws an error.                  |

## Performance

Copied from [Instascan](https://github.com/schmich/instascan) by Chris Schmich:

Many factors affect how quickly and reliably ZXing can detect QR codes.

If you control creation of the QR code, consider the following:

- A larger physical code is better. A 2" square code is better than a 1" square code.
- Flat, smooth, matte surfaces are better than curved, rough, glossy surfaces.
- Include a sufficient quiet zone, the white border surrounding QR code. The quiet zone should be at least four times the width of an individual element in your QR code.
- A simpler code is better. You can use [this QR code generator](https://werthdavid.github.io/ngx-kjua/index.html) to see how your input affects complexity.
- For the same length, numeric content is simpler than ASCII content, which is simpler than Unicode content.
- Shorter content is simpler. If you're encoding a URL, consider using a shortener such as [goo.gl](https://goo.gl/) or [bit.ly](https://bitly.com/).

When scanning, consider the following:

- QR code orientation doesn't matter.
- Higher resolution video is better, but is more CPU intensive.
- Direct, orthogonal scanning is better than scanning at an angle.
- Blurry video greatly reduces scanner performance.
- Auto-focus can cause lags in detection as the camera adjusts focus. Consider disabling it or using a fixed-focus camera with the subject positioned at the focal point.
- Exposure adjustment on cameras can cause lags in detection. Consider disabling it or having a fixed white backdrop.

## Generator

Looking for a way to generate QR-Codes? Check-out [ngx-kjua](https://github.com/werthdavid/ngx-kjua)
