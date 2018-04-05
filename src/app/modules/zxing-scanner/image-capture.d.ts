declare class ImageCapture {
    constructor(track: MediaStreamTrack);
    getPhotoCapabilities(): Promise<any>;
}
