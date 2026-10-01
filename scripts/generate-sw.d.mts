/** Types for the build script's exported helpers (used by tests). */
export declare function precacheUrls(): string[];
export declare function protocolRoutes(): string[];
export declare function renderServiceWorker(template: string, version: string, urls: string[]): string;
export declare function readTemplate(): string;
export declare function staticAssetUrlsInHtml(html: string): string[];
export declare function buildAssetUrls(nextDir?: string): string[];
