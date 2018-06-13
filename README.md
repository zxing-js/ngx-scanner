<div align="center">
    
<a href="https://github.com/zxing-js/library">
<img src="https://user-images.githubusercontent.com/3942006/39460928-a44b0f92-4cdd-11e8-849b-4d34db99113a.png">
</a>

### @zxing/ngx-scanner

Angular QR-Code scanner component.

<br>

[Bug Report](https://github.com/zxing-js/ngx-scanner/issues/new?template=Bug_report.md)
·
[Feature Request](https://github.com/zxing-js/ngx-scanner/issues/new?template=Feature_request.md&labels=feature)

<br>

[![NPM version](https://img.shields.io/npm/v/@zxing/ngx-scanner.svg?&label=npm)](https://www.npmjs.com/package/@zxing/ngx-scanner )
[![Downloads](https://img.shields.io/npm/dm/@zxing/ngx-scanner.svg)](https://npmjs.org/package/@zxing/ngx-scanner )
[![dependencies Status](https://david-dm.org/zxing-js/ngx-scanner/status.svg)](https://david-dm.org/zxing-js/ngx-scanner)
[![Build Status](https://travis-ci.org/zxing-js/ngx-scanner.svg?branch=master)](https://travis-ci.org/zxing-js/ngx-scanner)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fba14393a17241088f75b19edc370694)](https://www.codacy.com/app/zxing-js/ngx-scanner?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=zxing-js/ngx-scanner&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/zxing-js/ngx-scanner](https://badges.gitter.im/zxing-js/ngx-scanner.svg)](https://gitter.im/zxing-js/ngx-scanner?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

</div>

<br>

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

**We've built a veeeery cool Wiki for you! [Click here to take a look!](https://github.com/zxing-js/ngx-scanner/wiki)**

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


### Cheat Sheet 💩

```typescript
let scanner = new ZXingScannerComponent();
```

> Below we have something I call `qubool` (quantum `bool`eans), because they're booleans with multiple values, more than 0 and 1, like a `qubit`.

#### `scanner.hasPermissions`

| State       | Description
| :---------: | :--
| `true`      | Permission Granted.
| `false`     | Permission Denied.
| `unedfined` | Not checked yet.
| `null`      | Check has failed and the state couldn't be updated.

#### `scanner.hasDevices`

| State       | Description
| :---------: | :--
| `true`      | Usable devices found. 
| `false`     | No available devices.
| `unedfined` | Not checked yet.
| `null`      | Check has failed and the state couldn't be updated.


## Performance

Read our performance notes on the wiki: [Performance Considerations](https://github.com/zxing-js/ngx-scanner/wiki/Performance-Considerations).


## Limitations

- The component relies on [ZXing typescript port](https://github.com/zxing-js/library) which currently supports most common barcode formats, **but we didn't implement them here _yet_**.
- On iOS <= 11.2 devices camera access works only in native Safari. **This is limited WebRTC support by Apple.**


## Generator

Looking for a way to generate ~awesome~ QR codes? Check-out [ngx-kjua](https://github.com/werthdavid/ngx-kjua).

Want just to write QR codes on your own, try our [ZXing typescript port](https://github.com/zxing-js/library).

---

[![Bless](https://cdn.rawgit.com/LunaGao/BlessYourCodeTag/master/tags/alpaca.svg)](http://lunagao.github.io/BlessYourCodeTag/)
