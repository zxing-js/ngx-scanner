"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var QRCodeReader_1 = require("./../core/qrcode/QRCodeReader");
var VideoInputDevice_1 = require("./VideoInputDevice");
exports.VideoInputDevice = VideoInputDevice_1.default;
var BrowserCodeReader_1 = require("./BrowserCodeReader");
/**
 * QR Code reader to use from browser.
 *
 * @class BrowserQRCodeReader
 * @extends {BrowserCodeReader}
 */
var BrowserQRCodeReader = (function (_super) {
    __extends(BrowserQRCodeReader, _super);
    /**
     * Creates an instance of BrowserQRCodeReader.
     * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent decode tries
     *
     * @memberOf BrowserQRCodeReader
     */
    function BrowserQRCodeReader(timeBetweenScansMillis) {
        if (timeBetweenScansMillis === void 0) { timeBetweenScansMillis = 500; }
        return _super.call(this, new QRCodeReader_1.default(), timeBetweenScansMillis) || this;
    }
    return BrowserQRCodeReader;
}(BrowserCodeReader_1.default));
exports.BrowserQRCodeReader = BrowserQRCodeReader;
//# sourceMappingURL=BrowserQRCodeReader.js.map