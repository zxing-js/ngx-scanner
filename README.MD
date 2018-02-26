[![NPM version](https://img.shields.io/npm/v/ngx-zxing.svg?&label=npm)](https://www.npmjs.com/package/ngx-zxing) 
[![Downloads](https://img.shields.io/npm/dm/ngx-zxing.svg)](https://npmjs.org/package/ngx-zxing)
[![Dependency Status](https://david-dm.org/werthdavid/ngx-zxing.svg)](https://david-dm.org/werthdavid/ngx-zxing)
[![Build Status](https://secure.travis-ci.org/werthdavid/ngx-zxing.svg)](https://travis-ci.org/werthdavid/ngx-zxing)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7e108806ba914d64ac77c19fd01548c9)](https://www.codacy.com/app/werthdavid/ngx-zxing?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=werthdavid/ngx-zxing&amp;utm_campaign=Badge_Grade)
<img align="right" src="https://user-images.githubusercontent.com/3942006/34657626-336523d4-f40f-11e7-8160-b523183655c7.png"/>

# ngx-zxing

> Angular QR-Code scanner component.

## Features & Hints

- Supports continuous scanning.
- There is a delay of 1500ms after each successful scan, before a new QR-Code can be detected.
- Supports iOS 11 (only in Safari via HTTPS).
- Nice devs behind it. 🤓

## Demo

* [StackBlitz](https://stackblitz.com/edit/ngx-zxing-example) _(preview needs to be opened in new window)_
* [Plunkr](https://plnkr.co/edit/U13ufJHexw2ugZbHx8kR?p=preview) _(preview needs to be opened in new window)_
* [Example](https://werthdavid.github.io/ngx-zxing/index.html)

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
    [scanningActive]="scanningActive"
    [device]="selectedDevice"
    [cssClass]="'small-video'"
    (camerasFound)="displayCameras($event)"
    (scanSuccess)="handleQrCodeResult($event)"
></ngx-zxing>
```

- `scanningActive` can be used to start and stop the scanning (defaults to `true`)
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

## Generator

Looking for a way to generate QR-Codes? Check-out [ngx-kjua](https://github.com/werthdavid/ngx-kjua)
