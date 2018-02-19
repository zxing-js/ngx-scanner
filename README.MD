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

## Demo

* [StackBlitz](https://stackblitz.com/edit/ngx-zxing-example) _(preview needs to be opened in new window)_
* [Plunkr](https://plnkr.co/edit/U13ufJHexw2ugZbHx8kR?p=preview) _(preview needs to be opened in new window)_
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
    (camerasFound)="displayCameras($event)"
    (scanSuccess)="handleQrCodeResult($event)"
></ngx-zxing>
```

- `start` can be used to start and stop the scanning (defaults to `false`)
- `device` is the video-device used for scanning (use one of the devices emitted by `camerasFound`)
- `cssClass` this CSS-class name will be appended to the video-element e.g. for resizing it (see below)
- `camerasFound` will emit an array of video-devices after view was initialized
- `scanSuccess` will emit the result as string, after a valid QR-Code was scanSuccess

### Change the size of the preview-element

In your CSS, define an extra class and pass it to the component with the `cssClass`-parameter. CSS might look like this:

```css
.small-video {
    max-height: 70vh;
    width: 100vw;
    object-fit: contain;
}
```
