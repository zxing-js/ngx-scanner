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
var InvertedLuminanceSource_1 = require("./../core/InvertedLuminanceSource");
var LuminanceSource_1 = require("./../core/LuminanceSource");
var Exception_1 = require("./../core/Exception");
var HTMLCanvasElementLuminanceSource = (function (_super) {
    __extends(HTMLCanvasElementLuminanceSource, _super);
    function HTMLCanvasElementLuminanceSource(canvas) {
        var _this = _super.call(this, canvas.width, canvas.height) || this;
        _this.canvas = canvas;
        _this.tempCanvasElement = null;
        _this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(canvas);
        return _this;
    }
    HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData = function (canvas) {
        var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        return HTMLCanvasElementLuminanceSource.toGrayscaleBuffer(imageData.data, canvas.width, canvas.height);
    };
    HTMLCanvasElementLuminanceSource.toGrayscaleBuffer = function (imageBuffer, width, height) {
        var grayscaleBuffer = new Uint8ClampedArray(width * height);
        for (var i = 0, j = 0, length_1 = imageBuffer.length; i < length_1; i += 4, j++) {
            var gray = void 0;
            var alpha = imageBuffer[i + 4];
            // The color of fully-transparent pixels is irrelevant. They are often, technically, fully-transparent
            // black (0 alpha, and then 0 RGB). They are often used, of course as the "white" area in a
            // barcode image. Force any such pixel to be white:
            if (alpha === 0) {
                gray = 0xFF;
            }
            else {
                var pixelR = imageBuffer[i];
                var pixelG = imageBuffer[i + 1];
                var pixelB = imageBuffer[i + 2];
                // .299R + 0.587G + 0.114B (YUV/YIQ for PAL and NTSC), 
                // (306*R) >> 10 is approximately equal to R*0.299, and so on.
                // 0x200 >> 10 is 0.5, it implements rounding.
                gray = (306 * pixelR +
                    601 * pixelG +
                    117 * pixelB +
                    0x200) >> 10;
            }
            grayscaleBuffer[j] = gray;
        }
        return grayscaleBuffer;
    };
    HTMLCanvasElementLuminanceSource.prototype.getRow = function (y /*int*/, row) {
        if (y < 0 || y >= this.getHeight()) {
            throw new Exception_1.default(Exception_1.default.IllegalArgumentException, "Requested row is outside the image: " + y);
        }
        var width = this.getWidth();
        var start = y * width;
        if (row === null) {
            row = this.buffer.slice(start, start + width);
        }
        else {
            if (row.length < width) {
                row = new Uint8ClampedArray(width);
            }
            // The underlying raster of image consists of bytes with the luminance values
            // TODO: can avoid set/slice?
            row.set(this.buffer.slice(start, start + width));
        }
        return row;
    };
    HTMLCanvasElementLuminanceSource.prototype.getMatrix = function () {
        return this.buffer;
    };
    HTMLCanvasElementLuminanceSource.prototype.isCropSupported = function () {
        return true;
    };
    HTMLCanvasElementLuminanceSource.prototype.crop = function (left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
        this.crop(left, top, width, height);
        return this;
    };
    /**
     * This is always true, since the image is a gray-scale image.
     *
     * @return true
     */
    HTMLCanvasElementLuminanceSource.prototype.isRotateSupported = function () {
        return true;
    };
    HTMLCanvasElementLuminanceSource.prototype.rotateCounterClockwise = function () {
        this.rotate(-90);
        return this;
    };
    HTMLCanvasElementLuminanceSource.prototype.rotateCounterClockwise45 = function () {
        this.rotate(-45);
        return this;
    };
    HTMLCanvasElementLuminanceSource.prototype.getTempCanvasElement = function () {
        if (null === this.tempCanvasElement) {
            var tempCanvasElement = this.canvas.ownerDocument.createElement('canvas');
            tempCanvasElement.style.width = this.canvas.width + "px";
            tempCanvasElement.style.height = this.canvas.height + "px";
        }
        return this.tempCanvasElement;
    };
    HTMLCanvasElementLuminanceSource.prototype.rotate = function (angle) {
        var tempCanvasElement = this.getTempCanvasElement();
        var tempContext = tempCanvasElement.getContext('2d');
        tempContext.rotate(angle * HTMLCanvasElementLuminanceSource.DEGREE_TO_RADIANS);
        tempContext.drawImage(this.canvas, 0, 0);
        this.buffer = HTMLCanvasElementLuminanceSource.makeBufferFromCanvasImageData(tempCanvasElement);
        return this;
    };
    HTMLCanvasElementLuminanceSource.prototype.invert = function () {
        return new InvertedLuminanceSource_1.default(this);
    };
    return HTMLCanvasElementLuminanceSource;
}(LuminanceSource_1.default));
HTMLCanvasElementLuminanceSource.DEGREE_TO_RADIANS = Math.PI / 180;
exports.default = HTMLCanvasElementLuminanceSource;
//# sourceMappingURL=HTMLCanvasElementLuminanceSource.js.map