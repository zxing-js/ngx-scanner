/*
 * Copyright 2009 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
/*namespace com.google.zxing {*/
require("./InvertedLuminanceSource"); // required because of circular dependencies between LuminanceSource and InvertedLuminanceSource
var InvertedLuminanceSource_1 = require("./InvertedLuminanceSource");
var LuminanceSource_1 = require("./LuminanceSource");
var Exception_1 = require("./Exception");
var System_1 = require("./util/System");
/**
 * This class is used to help decode images from files which arrive as RGB data from
 * an ARGB pixel array. It does not support rotation.
 *
 * @author dswitkin@google.com (Daniel Switkin)
 * @author Betaminos
 */
var RGBLuminanceSource = (function (_super) {
    __extends(RGBLuminanceSource, _super);
    function RGBLuminanceSource(luminances, width /*int*/, height /*int*/, dataWidth /*int*/, dataHeight /*int*/, left /*int*/, top /*int*/) {
        var _this = _super.call(this, width, height) || this;
        _this.dataWidth = dataWidth; /*int*/
        _this.dataHeight = dataHeight; /*int*/
        _this.left = left; /*int*/
        _this.top = top; /*int*/
        if (luminances.BYTES_PER_ELEMENT === 4) {
            var size = width * height;
            var luminancesUint8Array = new Uint8ClampedArray(size);
            for (var offset = 0; offset < size; offset++) {
                var pixel = luminances[offset];
                var r = (pixel >> 16) & 0xff; // red
                var g2 = (pixel >> 7) & 0x1fe; // 2 * green
                var b = pixel & 0xff; // blue
                // Calculate green-favouring average cheaply
                luminancesUint8Array[offset] = ((r + g2 + b) / 4) & 0xFF;
            }
            _this.luminances = luminancesUint8Array;
        }
        else {
            _this.luminances = luminances;
        }
        if (undefined === dataWidth) {
            _this.dataWidth = width;
        }
        if (undefined === dataHeight) {
            _this.dataHeight = height;
        }
        if (undefined === left) {
            _this.left = 0;
        }
        if (undefined === top) {
            _this.top = 0;
        }
        if (_this.left + width > _this.dataWidth || _this.top + height > _this.dataHeight) {
            throw new Exception_1.default(Exception_1.default.IllegalArgumentException, "Crop rectangle does not fit within image data.");
        }
        return _this;
    }
    /*@Override*/
    RGBLuminanceSource.prototype.getRow = function (y /*int*/, row) {
        if (y < 0 || y >= this.getHeight()) {
            throw new Exception_1.default(Exception_1.default.IllegalArgumentException, "Requested row is outside the image: " + y);
        }
        var width = this.getWidth();
        if (row === null || row === undefined || row.length < width) {
            row = new Uint8ClampedArray(width);
        }
        var offset = (y + this.top) * this.dataWidth + this.left;
        System_1.default.arraycopy(this.luminances, offset, row, 0, width);
        return row;
    };
    /*@Override*/
    RGBLuminanceSource.prototype.getMatrix = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        // If the caller asks for the entire underlying image, save the copy and give them the
        // original data. The docs specifically warn that result.length must be ignored.
        if (width === this.dataWidth && height === this.dataHeight) {
            return this.luminances;
        }
        var area = width * height;
        var matrix = new Uint8ClampedArray(area);
        var inputOffset = this.top * this.dataWidth + this.left;
        // If the width matches the full width of the underlying data, perform a single copy.
        if (width === this.dataWidth) {
            System_1.default.arraycopy(this.luminances, inputOffset, matrix, 0, area);
            return matrix;
        }
        // Otherwise copy one cropped row at a time.
        for (var y = 0; y < height; y++) {
            var outputOffset = y * width;
            System_1.default.arraycopy(this.luminances, inputOffset, matrix, outputOffset, width);
            inputOffset += this.dataWidth;
        }
        return matrix;
    };
    /*@Override*/
    RGBLuminanceSource.prototype.isCropSupported = function () {
        return true;
    };
    /*@Override*/
    RGBLuminanceSource.prototype.crop = function (left /*int*/, top /*int*/, width /*int*/, height /*int*/) {
        return new RGBLuminanceSource(this.luminances, width, height, this.dataWidth, this.dataHeight, this.left + left, this.top + top);
    };
    RGBLuminanceSource.prototype.invert = function () {
        return new InvertedLuminanceSource_1.default(this);
    };
    return RGBLuminanceSource;
}(LuminanceSource_1.default));
exports.default = RGBLuminanceSource;
//# sourceMappingURL=RGBLuminanceSource.js.map