# ngx-zxing

### zxing
ZXing ("zebra crossing") is an open-source, multi-format 1D/2D barcode image processing library implemented in Java, with ports to other languages.

see: https://github.com/zxing/zxing

### zxing-typescript
zxing-typescript is a TypeScript-port of the ZXing library.

### ngx-typescript
This library wraps zxing-typescript into an Angular 2/4 compatible component to scan QR-Codes the Angular-way.

## Features & Hints

* supports continuous scanning
* there is a delay of 1500ms after each successful scan, before a new QR-Code can be detected
* supports iOS 11
  * works only with Safari
  * works only if the page is delivered via HTTPS 

## Installation

To install this library, run:

```bash
$ npm install ngx-zxing --save
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the library
import { NgxZxingModule } from 'ngx-zxing';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxZxingModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage

Once the library is imported, you can use it in your Angular application:

```xml
<ngx-zxing
    [start]="camStarted"
    [device]="selectedDevice"
    (onCamsFound)="displayCameras($event)"
    (onScan)="handleQrCodeResult($event)"
></ngx-zxing>
```

* `start` used to start and stop the scanning (defaults to `false`)
* `onCamsFound` will emit an array of video-devices after view was initialized
* `device` is the video-device used for scanning (use one of the devices emitted by `onCamsFound`)
* `onScan` will emit the result as string, after a valid QR-Code was scanned

## License

MIT © [David Werth](mailto:werth.david@gmail.com)
