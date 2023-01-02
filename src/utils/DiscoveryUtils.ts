import { ImageSourcePropType } from "react-native";
import { getStoresOfZones } from "../../backend/discovery/discovery";
import { FeedItem } from "../@types/HubsResponse";
import { AppStrings } from "../config/strings";
import { SourceType, ItemShowType, RatingValue } from "./common";
import { GLOBALS } from "./globals";
import { chooseRating, generateType, getImageUri, isTimeRangeCurrent, metadataSeparator } from "./Subscriber.utils";

export interface IStore {
    Id: string;
    Name: string;
    Locale: string;
    IsAdult: boolean;
    IsDefault: boolean;
}

export const Events = {
    adultStorePinEntry: "zones-adult-pin-entry"
};

export const HUBS_AND_FEEDS = "HubsAndFeeds";
export const storeUriPrefix = HUBS_AND_FEEDS + "-";

export const format = (str: string, ...obj: string[]) => {
    if (!str) {
        return "";
    }

    for (let index = 0; index < obj.length; index++) {
        str = str.replace(`{${index}}`, obj[index]);
    }
    return str;
};

interface AssetSourceAndContentType {
    itemType: string | null;
    contentType: string | null;
    sourceType: string | null;
}

export interface discoveryFeedItem extends FeedItem {
    title: string;
    assetType?: AssetSourceAndContentType;
    image2x3PosterURL: ImageSourcePropType | string | undefined;
    image2x3KeyArtURL: ImageSourcePropType | string | undefined;
    image16x9PosterURL: ImageSourcePropType | string | undefined;
    image16x9KeyArtURL: ImageSourcePropType | string | undefined;
    metadataLine2: string;
    statusText: string | undefined;
    episodeInfo: string | undefined;
    ratingValues: RatingValue[] | [];
}

export const isScheduleCurrent = (
    schedule: { StartUtc: string; EndUtc: string },
    rangeStartUtc?: string,
    rangeEndUtc?: string
): boolean => {
    if (schedule && schedule.StartUtc && schedule.EndUtc) {
        const startTime: Date = new Date(schedule.StartUtc);
        const endTime: Date = new Date(schedule.EndUtc);
        return isTimeRangeCurrent(
            startTime.getTime(),
            endTime.getTime(),
            rangeStartUtc ? new Date(rangeStartUtc) : undefined,
            rangeEndUtc ? new Date(rangeEndUtc) : undefined
        );
    }
    return false;
};
const liveSchedulesObject: { [key: string]: any } = {};
const updateLiveSchedulesObject = (liveSchedules: any) => {
    for (const liveSchedule of liveSchedules) {
        if (
            isScheduleCurrent({
                StartUtc: liveSchedule.StartUtc,
                EndUtc: liveSchedule.EndUtc,
            })
        ) {
            liveSchedulesObject[liveSchedule.StationId] = liveSchedule;
        }
    }
};

function getMetadataLine2(item: any): string {
    if (!item) {
        return "";
    }
    const releaseYear = item.ReleaseYear || item.CatalogInfo?.ReleaseYear || "";
    const contentRatings = chooseRating(
        item.Ratings || item.CatalogInfo?.Ratings
    );
    let metadataLine2;
    if (contentRatings && releaseYear) {
        metadataLine2 = `${releaseYear}${metadataSeparator}${contentRatings}`;
    } else if (releaseYear) {
        metadataLine2 = `${releaseYear}`;
    } else {
        metadataLine2 = `${contentRatings}`;
    }
    return metadataLine2;
}

export const getEpisodeInfo = (item: any): string | undefined => {
    if (!item) {
        return;
    }
    if (item && !item.SeasonNumber && !item.EpisodeNumber) {
        return;
    }

    //@ts-ignore
    const { str_seasonNumber, str_episodeNumber } = AppStrings || {};

    const { SeasonNumber, EpisodeNumber } = item;

    const seasonInfo = [];
    if (SeasonNumber) {
        const seasonTranslation =
            format(str_seasonNumber || "S{0}", SeasonNumber.toString()) ||
            `S${SeasonNumber}`;
        seasonInfo.push(seasonTranslation);
    }
    if (EpisodeNumber) {
        const episodeTranslation =
            format(str_episodeNumber || "E{0}", EpisodeNumber.toString()) ||
            `E${EpisodeNumber}`;
        seasonInfo.push(episodeTranslation);
    }
    return seasonInfo.join(" ");
};
export const massageDiscoveryFeed = (
    feed: any,
    sourceType: SourceType,
    liveSchedules?: any
): discoveryFeedItem => {
    liveSchedules && updateLiveSchedulesObject(liveSchedules);

    return feed.Items?.map((item: any) => {
        if (item["ItemType"] === ItemShowType.Channel) {
            const schedule = liveSchedulesObject[item.Id] || undefined;
            item = {
                ...schedule,
            };
            item["Schedule"] = schedule;
            item["assetType"] = generateType(item, SourceType.LIVE);
        } else {
            item["assetType"] = generateType(item, sourceType);
        }
        item["title"] = item.Name || item.CatalogInfo?.Name;
        item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
        item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
        const {
            ItemType = undefined,
            ItemCount = undefined,
            ContentRatings = undefined,
        } = item;
        if (
            (ItemType === ItemShowType.SvodPackage ||
                ItemType === ItemShowType.Package) &&
            ItemCount
        ) {
            try {
                item["metadataLine2"] =
                    ItemCount === 1
                        ? format(
                            AppStrings.str_details_package_item,
                            ItemCount.toString()
                        )
                        : ItemCount > 1
                            ? format(
                                AppStrings.str_details_package_items,
                                ItemCount.toString()
                            )
                            : "";
            } catch (e) {
                console.log("Something went wrong", e)
            }
        } else {
            item["metadataLine2"] = getMetadataLine2(item);
        }
        item["episodeInfo"] = getEpisodeInfo(item);
        item["ratingValues"] =
            (ContentRatings?.length && ContentRatings[0]?.RatingValues) || [];

        //checking is adultStore locked or not
        if (GLOBALS.allowAdultLocks || !item?.IsAdultStore) {
            return item;
        }
    })?.filter((i: any) => i);
};

export const getDefaultStore = (): string | undefined => {
    let versionSet = GLOBALS.bootstrapSelectors?.VersionSet;
    if (versionSet && versionSet.Versions) {
        let versions = versionSet.Versions;
        for (let i = 0; i < versions.length; i++) {
            if (versions[i].IsDefaultStore) {
                return versions[i].StoreId;
            }
        }
    } else {
        return undefined
    }

}
export const setDefaultStore = async (storeresponse: any, bootstrapSelectors: any) => {
    if (bootstrapSelectors) {
        console.log(storeresponse);
        const stores = storeresponse?.data;
        const STORE_TYPE = "HubsAndFeeds";
        const defaultMainStore = "HubsAndFeeds-Main";

        if (!bootstrapSelectors || !bootstrapSelectors.VersionSet) {
            // When user does not have any experience group, search for defaultMainStore
            // if  defaultMainStore exists return
            // else search for non adult, default and 'HubsAndFeeds' store and return
            if (!stores) {
                DefaultStore.Id = defaultMainStore;
                return;
            }

            const store = stores.filter((s: any) => defaultMainStore === s.Id);
            if (store && store.length > 0) {
                console.log("returning default main storeId:", store[0].Id);
                DefaultStore.Id = store[0].Id;
                return;
            }

            for (const store of stores) {
                if (
                    store.IsDefault &&
                    !store.IsAdult &&
                    store.StoreType === STORE_TYPE
                ) {
                    console.log("returning stores storeId:", store.Id);
                    DefaultStore.Id = store.Id;
                    return;
                }
            }
        } else {
            for (const version of bootstrapSelectors.VersionSet.Versions) {
                if (version.IsDefaultStore) {
                    console.log(
                        "returning versionSet storeId: ",
                        version.StoreId
                    );
                    DefaultStore.Id = version.StoreId;
                    return;
                }
            }
        }

        DefaultStore.Id = defaultMainStore?.Id;
        return;
    }
}



export const DefaultStore: IStore = {
    Id: HUBS_AND_FEEDS + "-Main",
    Name: "",
    Locale: "",
    IsAdult: false,
    IsDefault: true
};


