# NgxZxing

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d28849bd6fc6461d91397602c0b3c91f)](https://www.codacy.com/app/odahcam/ngx-zxing?utm_source=github.com&utm_medium=referral&utm_content=odahcam/ngx-zxing&utm_campaign=badger)

## zxing-typescript

zxing-typescript is a TypeScript-port of the [ZXing](https://github.com/zxing/zxing) library.

## ngx-typescript

This library wraps zxing-typescript into an Angular 5 component to scan QR-Codes the Angular-way.

## Features & Hints

- supports continuous scanning
- there is a delay of 1500ms after each successful scan, before a new QR-Code can be detected
- supports iOS 11

  - works only with Safari
  - works only if the page is delivered via HTTPS

## Demo

- [Plunkr](https://plnkr.co/edit/U13ufJHexw2ugZbHx8kR?p=preview)
- [Example](https://werthdavid.github.io/ngx-zxing/index.html)

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

// Needed as well
import { FormsModule } from "@angular/forms";


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
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
    [cssClass]="small-video"
    (onCamsFound)="displayCameras($event)"
    (onScan)="handleQrCodeResult($event)"
></ngx-zxing>
```

- `start` can be used to start and stop the scanning (defaults to `false`)
- `device` is the video-device used for scanning (use one of the devices emitted by `onCamsFound`)
- `cssClass` this CSS-class name will be appended to the video-element e.g. for resizing it (see below)
- `onCamsFound` will emit an array of video-devices after view was initialized
- `onScan` will emit the result as string, after a valid QR-Code was scanned

### Change the size of the preview-element

In your CSS, define an extra class and pass it to the component with the `cssClass`-parameter. CSS might look like this:

```css
.small-video {
    max-height: 70vh;
    width: 100vw;
    object-fit: contain;
}
```
