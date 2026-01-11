import { ENV } from '../config/env';
import { MockKlaviyoClient } from './mockClient';
import { RealKlaviyoClient } from './realClient';
import { KlaviyoClientInterface } from './interface';

console.log(`[KlaviyoClient] Initializing... Mock Mode: ${ENV.USE_MOCK_KLAVIYO}`);

export const KlaviyoClient: KlaviyoClientInterface = ENV.USE_MOCK_KLAVIYO
    ? (MockKlaviyoClient as unknown as KlaviyoClientInterface)
    : RealKlaviyoClient;
