import { DuplexManager } from "./DuplexManager";

export function initialize(duplexUrl: string, continuationTokenFromClient?: string) {
    let duplexManager: DuplexManager = DuplexManager.getInstance();
    if( continuationTokenFromClient ) {
        duplexManager.setContinuationTokenFromClient(continuationTokenFromClient);
    }
    !duplexManager.isDuplexConnect() && duplexManager.connect(duplexUrl);
}

export function appResumed(): void {
    let duplexManager: DuplexManager = DuplexManager.getInstance();
    duplexManager.appResumed();
}

export function appSuspended(): void {
    let duplexManager: DuplexManager = DuplexManager.getInstance();
    duplexManager.appSuspended();
}

export function networkOffline(): void {
    let duplexManager: DuplexManager = DuplexManager.getInstance();
    duplexManager.networkOffline();
}

export function networkOnline(): void {
    let duplexManager: DuplexManager = DuplexManager.getInstance();
    duplexManager.networkOnline();
}

export const duplex = {
    initialize: (duplexUrl: string, continuationTokenFromClient?: string) => initialize(duplexUrl, continuationTokenFromClient),
    appResumed,
    appSuspended,
    networkOnline,
    networkOffline
};

