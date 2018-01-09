<img align="right" src="https://user-images.githubusercontent.com/3942006/34657626-336523d4-f40f-11e7-8160-b523183655c7.png"/>

# NgxZxing
**Angular QR-Code scanner component**

[![NPM version](https://img.shields.io/npm/v/@barn/ngx-zxing.svg?&label=npm)](https://www.npmjs.com/package/@barn/ngx-zxing) 
[![Dependency Status](https://david-dm.org/odahcam/ngx-zxing.svg)](https://david-dm.org/odahcam/ngx-zxing)
[![Build Status](https://secure.travis-ci.org/odahcam/ngx-zxing.svg)](https://travis-ci.org/odahcam/ngx-zxing)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Downloads](https://img.shields.io/npm/dm/@barn/ngx-zxing.svg)](https://npmjs.org/package/@barn/ngx-zxing)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d28849bd6fc6461d91397602c0b3c91f)](https://www.codacy.com/app/odahcam/ngx-zxing?utm_source=github.com&utm_medium=referral&utm_content=odahcam/ngx-zxing&utm_campaign=badger)

## Features & Hints

- upports continuous scanning.
- There is a delay of 1500ms after each successful scan, before a new QR-Code can be detected.
- Supports iOS 11 (only in Safari via HTTPS).

## Demo

* [StackBlitz](https://stackblitz.com/edit/ngx-zxing-exemple) _(preview needs to be openned in new window)_
* [Plunkr](https://plnkr.co/edit/U13ufJHexw2ugZbHx8kR?p=preview) _(preview needs to be openned in new window)_
* [Example](https://werthdavid.github.io/ngx-zxing/index.html)

## Installation

To install this library, run:

```bash
npm i ngx-zxing -S
```

or

```bash
npm install ngx-zxing --save
```

or

```bash
yarn add ngx-zxing
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
        // make sure to add to the imports
        NgxZxingModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage

Once the library is imported, you can use it in your Angular application:

```html
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
