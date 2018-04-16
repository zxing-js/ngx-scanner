<p align="center">
    
  <a href="https://github.com/zxing-js/library">
    <img src="https://user-images.githubusercontent.com/3942006/34657626-336523d4-f40f-11e7-8160-b523183655c7.png">
  </a>

  <h3 align="center">@zxing/ngx-scanner</h3>

  <p align="center">
    Angular QR-Code scanner component.
    <br>
    <br>
    <a href="https://github.com/zxing-js/ngx-scanner/issues/new?template=bug.md">Report a bug</a>
    ·
    <a href="https://github.com/zxing-js/ngx-scanner/issues/new?template=feature.md&labels=feature">Request feature</a>
  </p>
</p>

<br>

[![NPM version](https://img.shields.io/npm/v/@zxing/ngx-scanner.svg?&label=npm)](https://www.npmjs.com/package/@zxing/ngx-scanner )
[![Downloads](https://img.shields.io/npm/dm/@zxing/ngx-scanner.svg)](https://npmjs.org/package/@zxing/ngx-scanner )
[![Dependency Status](https://david-dm.org/werthdavid/ngx-scanner.svg)](https://david-dm.org/werthdavid/ngx-scanner)
[![Build Status](https://secure.travis-ci.org/zxing-js/ngx-scanner.svg)](https://travis-ci.org/zxing-js/ngx-scanner)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fba14393a17241088f75b19edc370694)](https://www.codacy.com/app/zxing-js/ngx-scanner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zxing-js/ngx-scanner&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/zxing-js/ngx-scanner](https://badges.gitter.im/zxing-js/ngx-scanner.svg)](https://gitter.im/zxing-js/ngx-scanner?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Features & Hints

- Supports continuous scanning.
- Supports iOS 11 (only in Safari via HTTPS --> see `Limitations` below).
- There is a configurable delay of 1500ms after each successful scan, before a new QR-Code can be detected.
- Nice devs behind it. 🤓

## Demo

> Previews needs to be opened in new standalone windows.

- [Demo](https://zxing-js.github.io/ngx-scanner/)
- [StackBlitz](https://zxing-ngx-scanner.stackblitz.io/)
- [Plunkr](https://embed.plnkr.co/MN4riU/) (click open preview in separate window)

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
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
    declarations: [ /* AppComponent ... */ ],
    imports: [

        // BrowserModule,
        // ...

        // ZXing scanner module
        ZXingScannerModule.forRoot(),

        // another imports...
    ],
    // ...
})
export class AppModule { }
```

### Installation Problems

If you experience problems upon installing the component, please run
```bash
npm install --global --production windows-build-tools
```
and try again. If the problem still occurs, file an [issue](https://github.com/werthdavid/ngx-scanner/issues)

## Usage

Once the package is imported, you can use it in your Angular application:

```html
<zxing-scanner
    [scannerEnabled]="scannerEnabled"
    [autofocusEnabled]="autofocusEnabled"
    [device]="selectedDevice"
    [cssClass]="'small-video'"
    (camerasFound)="displayCameras($event)"
    (scanSuccess)="handleQrCodeResult($event)"
></zxing-scanner>
```

- `scannerEnabled` can be used to start and stop the scanning (defaults to `true`)
- `autofocusEnabled` can be used to enable or disable the autofocus-feature of the camera (defaults to `true`)
- `device` is the video-device used for scanning (use one of the devices emitted by `camerasFound`)
- `cssClass` !*deprecated*! this CSS-class name will be appended to the video-element e.g. for resizing it (see below)
- `camerasFound` will emit an array of video-devices after view was initialized
- `scanSuccess` will emit the result as string, after a valid QR-Code was scanned

### Change the size of the preview-element

In your CSS, define an extra class and pass it to the component with the `cssClass`-parameter. CSS might look like this:

```css
/deep/ .small-video {
    max-height: 70vh;
    width: 100vw;
    object-fit: contain;
}
```

Due to view-encapsulation it is required that the CSS-class that is to be used can be 'seen' from inside the scanner-component. 
In the example this is achieved with the `/deep/` keyword. 
Since this is not the best way to achieve the desired behavior and `/deep/` is deprecated by Angular, 
the attribute will be removed in the next major version of the component (2.x) and replaced by an `ngTemplate` solution.

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

## Limitations

- The component relies on [zxing-typescript](https://github.com/zxing-web/library) which currently supports only QR-codes and no 1D-Barcode formats
- On iOS-Devices camera access works only in native Safari and not in other Browsers (Chrome,...) or Apps that use an UIWebView or WKWebView. This is not a restriction of this component but of the limited WebRTC support by Apple. The behavior might change in iOS 11.3 (Apr 2018?, not tested) as stated [here](https://developer.apple.com/library/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_11_1.html#//apple_ref/doc/uid/TP40014305-CH14-SW1)

## Generator

Looking for a way to generate QR-Codes? Check-out [ngx-kjua](https://github.com/werthdavid/ngx-kjua)
