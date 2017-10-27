"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BinaryBitmap_1 = require("./../core/BinaryBitmap");
var HybridBinarizer_1 = require("./../core/common/HybridBinarizer");
var Exception_1 = require("./../core/Exception");
var HTMLCanvasElementLuminanceSource_1 = require("./HTMLCanvasElementLuminanceSource");
var VideoInputDevice_1 = require("./VideoInputDevice");
/**
 * Base class for browser code reader.
 *
 * @export
 * @class BrowserCodeReader
 */
var BrowserCodeReader = (function () {
    /**
     * Creates an instance of BrowserCodeReader.
     * @param {Reader} reader The reader instance to decode the barcode
     * @param {number} [timeBetweenScansMillis=500] the time delay between subsequent decode tries
     *
     * @memberOf BrowserCodeReader
     */
    function BrowserCodeReader(reader, timeBetweenScansMillis) {
        if (timeBetweenScansMillis === void 0) { timeBetweenScansMillis = 500; }
        this.reader = reader;
        this.timeBetweenScansMillis = timeBetweenScansMillis;
    }
    /**
     * Obtain the list of available devices with type 'videoinput'.
     *
     * @returns {Promise<VideoInputDevice[]>} an array of available video input devices
     *
     * @memberOf BrowserCodeReader
     */
    BrowserCodeReader.prototype.getVideoInputDevices = function () {
        return new Promise(function (resolve, reject) {
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                var sources = new Array();
                var c = 0;
                for (var i = 0, length_1 = devices.length; i != length_1; i++) {
                    var device = devices[i];
                    if (device.kind === 'videoinput') {
                        sources.push(new VideoInputDevice_1.default(device.deviceId, device.label || "Video source " + c));
                        c++;
                    }
                }
                resolve(sources);
            })
                .catch(function (err) {
                reject(err);
            });
        });
    };
    /**
     * Decodes the barcode from the device specified by deviceId while showing the video in the specified video element.
     *
     * @param {string} [deviceId] the id of one of the devices obtained after calling getVideoInputDevices. Can be undefined, in this case it will decode from one of the available devices, preffering the main camera (environment facing) if available.
     * @param {(string|HTMLVideoElement)} [videoElement] the video element in page where to show the video while decoding. Can be either an element id or directly an HTMLVideoElement. Can be undefined, in which case no video will be shown.
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    BrowserCodeReader.prototype.decodeFromInputVideoDevice = function (deviceId, videoElement) {
        this.reset();
        this.prepareVideoElement(videoElement);
        var constraints;
        if (undefined === deviceId) {
            constraints = {
                video: { facingMode: "environment" }
            };
        }
        else {
            constraints = {
                video: { deviceId: deviceId }
            };
        }
        var me = this;
        return new Promise(function (resolve, reject) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function (stream) {
                me.stream = stream;
                me.videoElement.srcObject = stream;
                me.videoPlayingEventListener = function () {
                    me.decodeOnceWithDelay(resolve, reject);
                };
                me.videoElement.addEventListener('playing', me.videoPlayingEventListener);
                me.videoElement.play();
            })
                .catch(function (error) {
                reject(error);
            });
        });
    };
    /**
     * Decodes a barcode form a video url.
     *
     * @param {string} videoUrl The video url to decode from, required.
     * @param {(string|HTMLVideoElement)} [videoElement] The video element where to play the video while decoding. Can be undefined in which case no video is shown.
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    BrowserCodeReader.prototype.decodeFromVideoSource = function (videoUrl, videoElement) {
        this.reset();
        this.prepareVideoElement(videoElement);
        var me = this;
        return new Promise(function (resolve, reject) {
            me.videoPlayEndedEventListener = function () {
                me.stop();
                reject(new Exception_1.default(Exception_1.default.NotFoundException));
            };
            me.videoElement.addEventListener('ended', me.videoPlayEndedEventListener);
            me.videoPlayingEventListener = function () {
                me.decodeOnceWithDelay(resolve, reject);
            };
            me.videoElement.addEventListener('playing', me.videoPlayingEventListener);
            me.videoElement.setAttribute('autoplay', 'true');
            me.videoElement.setAttribute('src', videoUrl);
        });
    };
    BrowserCodeReader.prototype.prepareVideoElement = function (videoElement) {
        if (undefined === videoElement) {
            this.videoElement = document.createElement('video');
            this.videoElement.width = 200;
            this.videoElement.height = 200;
        }
        else if (typeof videoElement === 'string') {
            this.videoElement = this.getMediaElement(videoElement, 'video');
        }
        else {
            this.videoElement = videoElement;
        }
    };
    BrowserCodeReader.prototype.getMediaElement = function (mediaElementId, type) {
        var mediaElement = document.getElementById(mediaElementId);
        if (null === mediaElement) {
            throw new Exception_1.default(Exception_1.default.ArgumentException, "element with id '" + mediaElementId + "' not found");
        }
        if (mediaElement.nodeName.toLowerCase() !== type.toLowerCase()) {
            console.log(mediaElement.nodeName);
            throw new Exception_1.default(Exception_1.default.ArgumentException, "element with id '" + mediaElementId + "' must be an " + type + " element");
        }
        return mediaElement;
    };
    /**
     * Decodes the barcode from an image.
     *
     * @param {(string|HTMLImageElement)} [imageElement] The image element that can be either an element id or the element itself. Can be undefined in which case the decoding will be done from the imageUrl parameter.
     * @param {string} [imageUrl]
     * @returns {Promise<Result>} The decoding result.
     *
     * @memberOf BrowserCodeReader
     */
    BrowserCodeReader.prototype.decodeFromImage = function (imageElement, imageUrl) {
        var _this = this;
        this.reset();
        if (undefined === imageElement && undefined === imageUrl) {
            throw new Exception_1.default(Exception_1.default.ArgumentException, 'either imageElement with a src set or an url must be provided');
        }
        this.prepareImageElement(imageElement);
        var me = this;
        return new Promise(function (resolve, reject) {
            if (undefined !== imageUrl) {
                me.imageLoadedEventListener = function () {
                    me.decodeOnce(resolve, reject, false, true);
                };
                me.imageElement.addEventListener('load', me.imageLoadedEventListener);
                me.imageElement.src = imageUrl;
            }
            else if (_this.isImageLoaded(_this.imageElement)) {
                me.decodeOnce(resolve, reject, false, true);
            }
            else {
                throw new Exception_1.default(Exception_1.default.ArgumentException, "either src or a loaded img should be provided");
            }
        });
    };
    BrowserCodeReader.prototype.isImageLoaded = function (img) {
        // During the onload event, IE correctly identifies any images that
        // weren’t downloaded as not complete. Others should too. Gecko-based
        // browsers act like NS4 in that they report this incorrectly.
        if (!img.complete) {
            return false;
        }
        // However, they do have two very useful properties: naturalWidth and
        // naturalHeight. These give the true size of the image. If it failed
        // to load, either of these should be zero.
        if (img.naturalWidth === 0) {
            return false;
        }
        // No other way of checking: assume it’s ok.
        return true;
    };
    BrowserCodeReader.prototype.prepareImageElement = function (imageElement) {
        if (undefined === imageElement) {
            this.imageElement = document.createElement('img');
            this.imageElement.width = 200;
            this.imageElement.height = 200;
        }
        else if (typeof imageElement === 'string') {
            this.imageElement = this.getMediaElement(imageElement, 'img');
        }
        else {
            this.imageElement = imageElement;
        }
    };
    BrowserCodeReader.prototype.decodeOnceWithDelay = function (resolve, reject) {
        this.timeoutHandler = window.setTimeout(this.decodeOnce.bind(this, resolve, reject), this.timeBetweenScansMillis);
    };
    BrowserCodeReader.prototype.decodeOnce = function (resolve, reject, retryIfNotFound, retryIfChecksumOrFormatError) {
        if (retryIfNotFound === void 0) { retryIfNotFound = true; }
        if (retryIfChecksumOrFormatError === void 0) { retryIfChecksumOrFormatError = true; }
        if (undefined === this.canvasElementContext) {
            this.prepareCaptureCanvas();
        }
        this.canvasElementContext.drawImage(this.videoElement || this.imageElement, 0, 0);
        var luminanceSource = new HTMLCanvasElementLuminanceSource_1.default(this.canvasElement);
        var binaryBitmap = new BinaryBitmap_1.default(new HybridBinarizer_1.default(luminanceSource));
        try {
            var result = this.readerDecode(binaryBitmap);
            resolve(result);
        }
        catch (re) {
            console.log(retryIfChecksumOrFormatError, re);
            if (retryIfNotFound && Exception_1.default.isOfType(re, Exception_1.default.NotFoundException)) {
                console.log('not found, trying again...');
                this.decodeOnceWithDelay(resolve, reject);
            }
            else if (retryIfChecksumOrFormatError && (Exception_1.default.isOfType(re, Exception_1.default.ChecksumException) || Exception_1.default.isOfType(re, Exception_1.default.FormatException))) {
                console.log('checksum or format error, trying again...', re);
                this.decodeOnceWithDelay(resolve, reject);
            }
            else {
                reject(re);
            }
        }
    };
    BrowserCodeReader.prototype.readerDecode = function (binaryBitmap) {
        return this.reader.decode(binaryBitmap);
    };
    BrowserCodeReader.prototype.prepareCaptureCanvas = function () {
        var canvasElement = document.createElement('canvas');
        var width, height;
        if (undefined !== this.videoElement) {
            width = this.videoElement.videoWidth;
            height = this.videoElement.videoHeight;
        }
        else {
            width = this.imageElement.naturalWidth || this.imageElement.width;
            height = this.imageElement.naturalHeight || this.imageElement.height;
        }
        canvasElement.style.width = width + "px";
        canvasElement.style.height = height + "px";
        canvasElement.width = width;
        canvasElement.height = height;
        this.canvasElement = canvasElement;
        this.canvasElementContext = canvasElement.getContext('2d');
        //this.videoElement.parentElement.appendChild(this.canvasElement)
    };
    BrowserCodeReader.prototype.stop = function () {
        if (undefined !== this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = undefined;
        }
        if (undefined !== this.stream) {
            this.stream.getTracks()[0].stop();
            this.stream = undefined;
        }
    };
    /**
     * Resets the code reader to the initial state. Cancels any ongoing barcode scanning from video or camera.
     *
     * @memberOf BrowserCodeReader
     */
    BrowserCodeReader.prototype.reset = function () {
        this.stop();
        if (undefined !== this.videoPlayEndedEventListener && undefined !== this.videoElement) {
            this.videoElement.removeEventListener('ended', this.videoPlayEndedEventListener);
        }
        if (undefined !== this.videoPlayingEventListener && undefined !== this.videoElement) {
            this.videoElement.removeEventListener('playing', this.videoPlayingEventListener);
        }
        if (undefined !== this.videoElement) {
            this.videoElement.srcObject = undefined;
            this.videoElement.removeAttribute('src');
            this.videoElement = undefined;
        }
        if (undefined !== this.videoPlayEndedEventListener && undefined !== this.imageElement) {
            this.imageElement.removeEventListener('load', this.imageLoadedEventListener);
        }
        if (undefined !== this.imageElement) {
            this.imageElement.src = undefined;
            this.imageElement.removeAttribute('src');
            this.imageElement = undefined;
        }
        this.canvasElementContext = undefined;
        this.canvasElement = undefined;
    };
    return BrowserCodeReader;
}());
exports.default = BrowserCodeReader;
//# sourceMappingURL=BrowserCodeReader.js.map