/**
 * The ImageCapture interface of the MediaStream Image Capture
 * API provides methods to enable the capture of images or
 * photos from a camera or other photographic device provides
 * an interface for capturing images from a photographic
 * device referenced through a valid MediaStreamTrack.
 */
declare class ImageCapture {

  /**
   * Returns a reference to the MediaStreamTrack passed to the constructor.
   */
  readonly track: MediaStreamTrack;

  /**
   * Creates a new ImageCapture object which can be used to capture still frames
   * (photos) from a given MediaStreamTrack which represents a video stream.
   * @param track The MediaStreamTrack
   */
  constructor(track: MediaStreamTrack);

  /**
   * Returns a Promise that resolves with a PhotoCapabilities object containing the ranges of available configuration options.
   */
  getPhotoCapabilities(): Promise<PhotoCapabilities>;
}

/**
 * The PhotoCapabilities interface of the the MediaStream Image
 * Capture API provides available configuration options for an
 * attached photographic device. A PhotoCapabilities object
 * is retrieved by calling ImageCapture.getPhotoCapabilities().
 */
declare class PhotoCapabilities {
  readonly redEyeReductionRead: 'never' | 'always' | 'controllable';
  readonly imageHeightRead: MediaSettingsRange;
  readonly imageWidthRead: MediaSettingsRange;
  readonly fillLightMode: 'auto' | 'off' | 'flash';
}

/**
 * The MediaSettingsRange interface of the the MediaStream Image
 * Capture API provides the possible range and value size of
 * PhotoCapabilities.imageHeight and PhotoCapabilities.imageWidth.
 * A PhotoCapabilities object can be retrieved by calling ImageCapture.PhotoCapabilities().
 */
declare class MediaSettingsRange {

  /**
   * Returns the maximum value of this settings.
   */
  max: any;

  /**
   * Returns the minimum value of this setting.
   */
  min: any;

  /**
   * Returns the minimum difference between consecutive values of this setting.
   */
  step: any;

}
