/*
 * Copyright 2007 ZXing authors
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
Object.defineProperty(exports, "__esModule", { value: true });
/*namespace com.google.zxing.qrcode.decoder {*/
var Exception_1 = require("./../../Exception");
/**
 * <p>See ISO 18004:2006, 6.5.1. This enum encapsulates the four error correction levels
 * defined by the QR code standard.</p>
 *
 * @author Sean Owen
 */
var ErrorCorrectionLevel = (function () {
    function ErrorCorrectionLevel(value, stringValue, bits /*int*/) {
        this.value = value;
        this.stringValue = stringValue;
        this.bits = bits; /*int*/
        ErrorCorrectionLevel.FOR_BITS.set(bits, this);
        ErrorCorrectionLevel.FOR_VALUE.set(value, this);
    }
    ErrorCorrectionLevel.prototype.getValue = function () {
        return this.value;
    };
    ErrorCorrectionLevel.prototype.getBits = function () {
        return this.bits;
    };
    ErrorCorrectionLevel.fromString = function (s) {
        switch (s) {
            case "L": return ErrorCorrectionLevel.L;
            case "M": return ErrorCorrectionLevel.M;
            case "Q": return ErrorCorrectionLevel.Q;
            case "H": return ErrorCorrectionLevel.H;
            default: throw new Exception_1.default(Exception_1.default.ArgumentException, s + "not available");
        }
    };
    ErrorCorrectionLevel.prototype.toString = function () {
        return this.stringValue;
    };
    ErrorCorrectionLevel.prototype.equals = function (o) {
        if (!(o instanceof ErrorCorrectionLevel)) {
            return false;
        }
        var other = o;
        return this.value === other.value;
    };
    /**
     * @param bits int containing the two bits encoding a QR Code's error correction level
     * @return ErrorCorrectionLevel representing the encoded error correction level
     */
    ErrorCorrectionLevel.forBits = function (bits /*int*/) {
        if (bits < 0 || bits >= ErrorCorrectionLevel.FOR_BITS.size) {
            throw new Exception_1.default(Exception_1.default.IllegalArgumentException);
        }
        return ErrorCorrectionLevel.FOR_BITS.get(bits);
    };
    return ErrorCorrectionLevel;
}());
ErrorCorrectionLevel.FOR_BITS = new Map();
ErrorCorrectionLevel.FOR_VALUE = new Map();
/** L = ~7% correction */
ErrorCorrectionLevel.L = new ErrorCorrectionLevel(0 /* L */, "L", 0x01);
/** M = ~15% correction */
ErrorCorrectionLevel.M = new ErrorCorrectionLevel(1 /* M */, "M", 0x00);
/** Q = ~25% correction */
ErrorCorrectionLevel.Q = new ErrorCorrectionLevel(2 /* Q */, "Q", 0x03);
/** H = ~30% correction */
ErrorCorrectionLevel.H = new ErrorCorrectionLevel(3 /* H */, "H", 0x02);
exports.default = ErrorCorrectionLevel;
//# sourceMappingURL=ErrorCorrectionLevel.js.map