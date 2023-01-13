import { LiveChannelLocaleMap } from "./LiveChannelLocalMap";

export class LiveChannelStore {
    // a set of channels based on the locale.
    // key: locale
    private readonly liveChannelLocaleMap: {
        [key: string]: LiveChannelLocaleMap;
    } = {};

    constructor(storeId: string, isAdult: boolean | undefined) {
        this.liveChannelLocaleMap = {};
    }

    // @param locale the full locale string.  For example: en-US, fr-CA.
    // @return either the newly created liveChannelLocaleMap or the existing one.
    public addLiveChannelLocaleMap(locale: string): LiveChannelLocaleMap {
        const key = locale;

        if (!this.liveChannelLocaleMap[key]) {
            this.liveChannelLocaleMap[key] = new LiveChannelLocaleMap(key);
        }

        return this.liveChannelLocaleMap[key];
    }

    public getLiveChannelLocaleMap(locale: string): LiveChannelLocaleMap {
        return this.liveChannelLocaleMap[locale];
    }
}