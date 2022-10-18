import DeviceInfo from "react-native-device-info";

export const isAppleTv = DeviceInfo.getSystemName() === "tvOS";

const programPlayOptionData = () => {
    interface map {
        [key: string]: boolean;
    }

    let playOptionData: map = {};

    const has = (params: any) => {
        return playOptionData[JSON.stringify(params)];
    };

    const set = (key: any, value?: any) => {
        if (value) {
            playOptionData[JSON.stringify(key)] = value;
        } else {
            playOptionData[JSON.stringify(key)] = true;
        }
    };

    const clear = () => {
        if (Object.keys(playOptionData).length) {
            playOptionData = {};
        }
    };

    return {
        has,
        set,
        clear,
    };
};

const ppvFilteredFeed = () => {
    let ppvFilteredFeedData: any = undefined;

    const get = () => {
        return ppvFilteredFeedData;
    };

    const set = (feed: any) => {
        ppvFilteredFeedData = feed;
    };

    return {
        get,
        set,
    };
};

const bookmarkData = () => {
    interface map {
        [key: string]: boolean;
    }

    let bookmarkedData: map = {};

    const has = (Id: any) => {
        return bookmarkedData[Id];
    };

    const set = (key: any, value?: any) => {
        if (value) {
            bookmarkedData[key] = value;
        } else {
            bookmarkedData[key] = true;
        }
    };

    const clear = () => {
        if (Object.keys(bookmarkedData).length) {
            bookmarkedData = {};
        }
    };

    return {
        has,
        set,
        clear,
    };
};

const programOrSeriesSubscriberData = () => {
    interface map {
        [key: string]: boolean;
    }

    let subscriberData: map = {};

    const has = (params: any) => {
        return subscriberData[JSON.stringify(params)];
    };

    const set = (key: any, value?: any) => {
        if (value) {
            subscriberData[JSON.stringify(key)] = value;
        } else {
            subscriberData[JSON.stringify(key)] = true;
        }
    };

    const clear = () => {
        if (Object.keys(subscriberData).length) {
            subscriberData = {};
        }
    };
    return {
        has,
        set,
        clear,
    };
};

const programOrSeriesScheduleData = () => {
    interface map {
        [key: string]: boolean;
    }

    let ScheduleData: map = {};

    const has = (params: any) => {
        return ScheduleData[JSON.stringify(params)];
    };

    const set = (key: any, value?: any) => {
        if (value) {
            ScheduleData[JSON.stringify(key)] = value;
        } else {
            ScheduleData[JSON.stringify(key)] = true;
        }
    };

    const clear = () => {
        if (Object.keys(ScheduleData).length) {
            ScheduleData = {};
        }
    };

    return {
        has,
        set,
        clear,
    };
};

const liveCatchupData = () => {
    interface map {
        [key: string]: boolean;
    }

    let liveCatchupDataData: map = {};

    const has = (folderName: string) => {
        return liveCatchupDataData[folderName];
    };

    const set = (folderName: string, value?: any) => {
        if (value) {
            liveCatchupDataData[folderName] = value;
        } else {
            liveCatchupDataData[folderName] = true;
        }
    };

    const clear = () => {
        if (Object.keys(liveCatchupDataData).length) {
            liveCatchupDataData = {};
        }
    };

    return {
        has,
        set,
        clear,
    };
};

const recentlyAiredData = () => {
    interface map {
        [key: string]: boolean;
    }

    let recentlyAiredDataData: map = {};

    const has = (dateStr: string) => {
        return recentlyAiredDataData[dateStr];
    };

    const set = (dateStr: string, value?: any) => {
        if (value) {
            recentlyAiredDataData[JSON.stringify(dateStr)] = value;
        } else {
            recentlyAiredDataData[JSON.stringify(dateStr)] = true;
        }
    };

    const clear = () => {
        if (Object.keys(recentlyAiredDataData).length) {
            recentlyAiredDataData = {};
        }
    };

    return {
        has,
        set,
        clear,
    };
};

const purchaseFilteredFeed = () => {
    let purchaseFilteredFeedData: any = undefined;

    const get = () => {
        return purchaseFilteredFeedData;
    };

    const set = (feed: any) => {
        purchaseFilteredFeedData = feed;
    };

    return {
        get,
        set,
    };
};

const favoritesList = () => {
    let favoritesListData: any = undefined;

    const get = () => {
        return favoritesListData;
    };

    const set = () => {
        favoritesListData = true;
    };

    const clear = () => {
        if (favoritesListData == true) {
            favoritesListData = undefined;
        }
    };

    return {
        get,
        set,
        clear,
    };
};

const isBrowseGalleryFirstLoad = () => {
    let firstBrowseGalleryLoadComplete: any = undefined;

    const get = () => {
        return firstBrowseGalleryLoadComplete;
    };

    const set = () => {
        firstBrowseGalleryLoadComplete = true;
    };

    const clear = () => {
        if (firstBrowseGalleryLoadComplete == true) {
            firstBrowseGalleryLoadComplete = undefined;
        }
    };

    return {
        get,
        set,
        clear,
    };
};

export const clearCachedData = () => {
    cachedScheduleData.clear();
    cachedSubscriberData.clear();
    cachedPlayOptionData.clear();
    cachedFavoritesList.clear();
};

export const cachedSubscriberData = programOrSeriesSubscriberData();

export const cachedScheduleData = programOrSeriesScheduleData();

export const cachedPlayOptionData = programPlayOptionData();

export const purchasedMessagedFeed = purchaseFilteredFeed();

export const ppvMassagedFeed = ppvFilteredFeed();

export const cachedLiveCatchupData = liveCatchupData();

export const cachedFavoritesList = favoritesList();

export const cachedRecentlyAiredData = recentlyAiredData();

export const firstBrowseGalleryLoadComplete = isBrowseGalleryFirstLoad();
export const cachedBookmarkData = bookmarkData();

export function debounce(cb: () => void, timeout: number) {
    const timer = setTimeout(cb, timeout);
    return {
        cancel: () => {
            clearTimeout(timer);
        },
    };
}
