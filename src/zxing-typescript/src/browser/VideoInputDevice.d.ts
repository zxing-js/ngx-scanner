/**
 * Video input device metadata containing the id and label of the device if available.
 *
 * @export
 * @class VideoInputDevice
 */
export default class VideoInputDevice {
    deviceId: string;
    label: string;
    /**
     * Creates an instance of VideoInputDevice.
     * @param {string} deviceId the video input device id
     * @param {string} label the label of the device if available
     *
     * @memberOf VideoInputDevice
     */
    constructor(deviceId: string, label: string);
}
