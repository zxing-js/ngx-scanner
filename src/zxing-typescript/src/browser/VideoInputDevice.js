/**
 * Video input device metadata containing the id and label of the device if available.
 *
 * @export
 * @class VideoInputDevice
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VideoInputDevice = (function () {
    /**
     * Creates an instance of VideoInputDevice.
     * @param {string} deviceId the video input device id
     * @param {string} label the label of the device if available
     *
     * @memberOf VideoInputDevice
     */
    function VideoInputDevice(deviceId, label) {
        this.deviceId = deviceId;
        this.label = label;
    }
    return VideoInputDevice;
}());
exports.default = VideoInputDevice;
//# sourceMappingURL=VideoInputDevice.js.map