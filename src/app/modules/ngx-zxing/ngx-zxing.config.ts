import { InjectionToken } from '@angular/core';

export interface ZXingConfig {
    defaultThrottling: number;
}
export const ZXING_CONFIG = new InjectionToken<ZXingConfig>('zxing.config');

export const ZXING_DEFAULT_CONFIG: ZXingConfig = {
    defaultThrottling: 1500,
};

