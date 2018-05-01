<p align="center">
    
  <a href="https://github.com/zxing-js/library">
    <img src="https://user-images.githubusercontent.com/3942006/39460928-a44b0f92-4cdd-11e8-849b-4d34db99113a.png">
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


## How To

**We've built a veeeery cool Wiki for you! [Click here to take a look!](/zxing-js/ngx-scanner/wiki)**

I promise that it's **very** simple to use:
```html
<!-- some.component.html -->
<zxing-scanner></zxing-scanner>
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

Read our performance notes on the wiki: [Performance Considerations](https://github.com/zxing-js/ngx-scanner/wiki/Performance-Considerations).


## Limitations

- The component relies on [zxing-typescript](https://github.com/zxing-web/library) which currently supports totally the following code formats:
  - QR Code
  - Code 128
- On iOS <= 11.2 devices camera access works only in native Safari. **This is limited WebRTC support by Apple.**


## Generator

Looking for a way to generate QR-Codes? Check-out [ngx-kjua](https://github.com/werthdavid/ngx-kjua)
