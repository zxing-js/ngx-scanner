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
 * <p>See ISO 18004:2006, 6.4.1, Tables 2 and 3. This enum encapsulates the various modes in which
 * data can be encoded to bits in the QR code standard.</p>
 *
 * @author Sean Owen
 */
var Mode = (function () {
    function Mode(value, stringValue, characterCountBitsForVersions, bits /*int*/) {
        this.value = value;
        this.stringValue = stringValue;
        this.characterCountBitsForVersions = characterCountBitsForVersions;
        this.bits = bits; /*int*/
        Mode.FOR_BITS.set(bits, this);
        Mode.FOR_VALUE.set(value, this);
    }
    /**
     * @param bits four bits encoding a QR Code data mode
     * @return Mode encoded by these bits
     * @throws IllegalArgumentException if bits do not correspond to a known mode
     */
    Mode.forBits = function (bits /*int*/) {
        var mode = Mode.FOR_BITS.get(bits);
        if (undefined === mode) {
            throw new Exception_1.default(Exception_1.default.IllegalArgumentException);
        }
        return mode;
    };
    /**
     * @param version version in question
     * @return number of bits used, in this QR Code symbol {@link Version}, to encode the
     *         count of characters that will follow encoded in this Mode
     */
    Mode.prototype.getCharacterCountBits = function (version) {
        var number = version.getVersionNumber();
        var offset;
        if (number <= 9) {
            offset = 0;
        }
        else if (number <= 26) {
            offset = 1;
        }
        else {
            offset = 2;
        }
        return this.characterCountBitsForVersions[offset];
    };
    Mode.prototype.getValue = function () {
        return this.value;
    };
    Mode.prototype.getBits = function () {
        return this.bits;
    };
    Mode.prototype.equals = function (o) {
        if (!(o instanceof Mode)) {
            return false;
        }
        var other = o;
        return this.value === other.value;
    };
    Mode.prototype.toString = function () {
        return this.stringValue;
    };
    return Mode;
}());
Mode.FOR_BITS = new Map();
Mode.FOR_VALUE = new Map();
Mode.TERMINATOR = new Mode(0 /* TERMINATOR */, "TERMINATOR", Int32Array.from([0, 0, 0]), 0x00); // Not really a mode... 
Mode.NUMERIC = new Mode(1 /* NUMERIC */, "NUMERIC", Int32Array.from([10, 12, 14]), 0x01);
Mode.ALPHANUMERIC = new Mode(2 /* ALPHANUMERIC */, "ALPHANUMERIC", Int32Array.from([9, 11, 13]), 0x02);
Mode.STRUCTURED_APPEND = new Mode(3 /* STRUCTURED_APPEND */, "STRUCTURED_APPEND", Int32Array.from([0, 0, 0]), 0x03); // Not supported
Mode.BYTE = new Mode(4 /* BYTE */, "BYTE", Int32Array.from([8, 16, 16]), 0x04);
Mode.ECI = new Mode(5 /* ECI */, "ECI", Int32Array.from([0, 0, 0]), 0x07); // character counts don't apply
Mode.KANJI = new Mode(6 /* KANJI */, "KANJI", Int32Array.from([8, 10, 12]), 0x08);
Mode.FNC1_FIRST_POSITION = new Mode(7 /* FNC1_FIRST_POSITION */, "FNC1_FIRST_POSITION", Int32Array.from([0, 0, 0]), 0x05);
Mode.FNC1_SECOND_POSITION = new Mode(8 /* FNC1_SECOND_POSITION */, "FNC1_SECOND_POSITION", Int32Array.from([0, 0, 0]), 0x09);
/** See GBT 18284-2000; "Hanzi" is a transliteration of this mode name. */
Mode.HANZI = new Mode(9 /* HANZI */, "HANZI", Int32Array.from([8, 10, 12]), 0x0D);
exports.default = Mode;
//# sourceMappingURL=Mode.js.map