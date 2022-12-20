// @ts-nocheck
import { some } from "lodash";
import { PurchaseAction } from "../@types/SubscriberFeed";
import { PlayAction, Library } from "../@types/UDLResponse";
import { config } from "../config/config";
import { appUIDefinition } from "../config/constants";
import { AppStrings } from "../config/strings";
import { bookmarkType, browseType, DvrRecordedState, encodings, feedBaseURI, generalizeQualityLevels, iso639LangaugeCodeMapping, ItemShowType, monthNames, networkLogoPlaceholder, orderedQualityLevels, pbr, RestrictionValue, sourceTypeString, transactionType } from "./analytics/consts";
import { SourceType, IPlayAction, TransactionType, ItemType, Definition, DvrItemState } from "./common";
import { convertSecondsToDayHourMinStrings, padLeft } from "./dataUtils";
import { discoveryFeedItem } from "./DiscoveryUtils";
import { getNetworkImageUri } from "./images";
import { replacePlaceHoldersInTemplatedString } from "./strings";
import { generateType, getImageUri, isScheduleCurrent, metadataSeparator } from "./Subscriber.utils";
import { getFontIcon } from "../config/strings";

export const assetExpiryDaysThreshold = 14;

type AspectRatioString = "16:9" | "4:3" | "3:4" | "2:3" | "1:1";

const secondsInYear = 31536000; // 60 * 60 * 24 * 365;

const audioTagIndicator: any = {
    ClosedCaptioned: "1",
    AudioDescription: "1",
    Dolby: "1",
};
export enum DvrButtonAction {
    None,
    Record,
    Edit,
    Promote,
    ResolveConflicts,
    Wait,
}

export enum DvrCapabilityType {
    NODVR = "NoDvr",
    MEDIAROOMDVR = "MediaroomDvr",
    CLOUDDVR = "CloudDvr",
    ZEROQUOTA = "ZeroQuota",
}

export enum RequestType {
    GET,
    SCHEDULE,
    UPDATE,
    CANCEL,
    STOP,
    DELETE,
    RESOLVE_CONFLICT,
}

export interface FeedContentItem {
    Id: string;
    assetType: any;
    title: string;
    image16x9PosterURL: {
        uri: string;
    };
    image16x9KeyArtURL: {
        uri: string;
    };
    image2x3PosterURL: {
        uri: string;
    };
    image2x3KeyArtURL: {
        uri: string;
    };
    image3x4PosterURL: {
        uri: string;
    };
    image13x4KeyArtURL: {
        uri: string;
    };
    aspectRatio: AspectRatioString;
    metadata: any;
    isPlayable: any;
}

export type FeedContent = FeedContentItem[];

export type WaysToWatchObj = {
    watchLive: Object[] | [];
    playVod: Object[] | [];
    playDvr: Object[] | [];
    restart: Object[] | [];
    rentBuy: Object[] | [];
    subscribe: Object[] | [];
    upcoming: Object[] | [];
};

export type Network = {
    Id: string;
    Images?: any[];
    Name: string;
    PFImages?: any[];
};

export type SubscriptionPackages = {
    purchaseNetwork: Network;
    purchaseActions: PurchaseAction[];
};

export function fromSecondsToHHMMSS(value: string | number) {
    let sec = typeof value === "string" ? parseInt(value, 10) : value;
    sec = Math.round(sec);
    const hours = Math.floor(sec / 3600); // get hours
    const minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
    const seconds = sec - hours * 3600 - minutes * 60; //  get seconds
    return `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)}`;
}

export function durationInMinutes(dataObject: any): string {
    if (!dataObject || !dataObject.RuntimeSeconds) {
        return "";
    }

    return Math.round(dataObject.RuntimeSeconds / 60) + "mins";
}

export function durationInHoursMinutes(dataObject: any): string {
    if (!dataObject || !dataObject.RuntimeSeconds) {
        return "";
    }

    let hours;
    let mins = Math.round(dataObject.RuntimeSeconds / 60);
    if (mins > 60) {
        hours = Math.floor(mins / 60);
        mins = mins - 60 * hours;
    }

    return `${hours ? hours + "h " : ""}${mins ? mins + "m" : ""}`;
}

const playIcon = getFontIcon("play");
const restart = getFontIcon("restart");
const trailerIcon = getFontIcon("trailer");
const subscribeIcon = getFontIcon("subscribe");
const episodeListIcon = getFontIcon("episode_list");
const waysToWatchIcon = getFontIcon("ways_to_watch");
const rentBuyIcon = getFontIcon("rent_buy");
const moreInfoIcon = getFontIcon("info");
const recordSingle = getFontIcon("record");
const recordSeries = getFontIcon("record_series");
const recordEdit = getFontIcon("edit");


const getPlayableCatchupSchedule = (
    programPlayOptions: any,
    params: any,
    channelMap: any,
    account: any,
    isFromEPG?: boolean,
    StationIdFromEPG?: any,
    ipStatus?: any,
    playAction?: any,
    ctaButtonGroup?: any
) => {
    if (!programPlayOptions) {
        return;
    }

    const { CatchupSchedules, Bookmark, Vods } = programPlayOptions;
    const ctaButtonList: any = [];

    if (CatchupSchedules) {
        let contextualSchedule: any = null;
        let validCatchupSchedule: any = null;
        let validCatchupChannel: any = null;

        const bookmark =
            Bookmark || (Vods?.length > 0 && Vods[0].BookmarkDetail) || null;
        const bookmarkSeconds: number =
            (bookmark && bookmark?.TimeSeconds) ||
            bookmark?.LastBookmarkSeconds ||
            0;
        const runTimeSeconds: number =
            (bookmark && bookmark.RuntimeSeconds) || 0;

        contextualSchedule = find(CatchupSchedules, (schedule: any) => {
            const entitlements: string[] = schedule.Entitlements;
            const channel: any = findChannelByStationId(
                isFromEPG ? StationIdFromEPG : schedule?.StationId,
                undefined,
                undefined,
                channelMap
            ).channel;
            const isSchedulePlayable =
                isPlayable(entitlements, account) && isChannelPlayable(channel);
            const isCurrentSchedule = isScheduleCurrent({
                StartUtc: schedule.CatchupStartUtc,
                EndUtc: schedule.CatchupEndUtc,
            });
            //Check Channel Recently Aired Restriction
            if (isSchedulePlayable && isCurrentSchedule) {
                // If the catchup schedule is current and playable, use it
                validCatchupSchedule = schedule;
                validCatchupChannel = channel;

                // Contextual button based on passed in channelNumber, start and end times
                if (
                    (schedule?.ChannelNumber === +params?.channelNumber ||
                        schedule?.ChannelNumber === +params?.ChannelNumber) &&
                    (schedule.StartUtc === params.startUtc ||
                        schedule.StartUtc === params.StartUtc) &&
                    (schedule.EndUtc === params.endUtc ||
                        schedule.EndUtc === params.EndUtc) &&
                    recentlyAiredRights(channel)
                ) {
                    const channelInfo = {
                        Schedule: schedule,
                        Channel: channel,
                        Service: channelMap.getService(channel),
                    };

                    if (
                        !playAction &&
                        bookmark &&
                        bookmarkSeconds > 0 &&
                        hasRemainingSeconds(bookmarkSeconds, runTimeSeconds) &&
                        bookmark?.BookmarkType === bookmarkType.Catchup &&
                        ctaButtonGroup?.length < 2
                    ) {
                        ctaButtonList.push({
                            button: {
                                buttonType: "TextIcon",
                                buttonText:
                                    global.lStrings?.str_details_cta_resume,
                                buttonAction:
                                    global.lStrings?.str_details_cta_restart,
                                iconSource: playIcon,
                            },
                            ChannelInfo: channelInfo,
                        });
                    } else {
                        ctaButtonList.push({
                            button: {
                                buttonType: "TextIcon",
                                buttonText:
                                    global.lStrings?.str_details_cta_restart,
                                buttonAction:
                                    global.lStrings?.str_details_cta_restart,
                                iconSource: playIcon,
                            },
                            ChannelInfo: channelInfo,
                        });
                    }
                    return true;
                }
            }
            return false;
        });

        // If no contextualSchedule, keep searching for the "best option" (catchup schedule that is current)
        if (
            !contextualSchedule &&
            validCatchupSchedule &&
            validCatchupChannel
        ) {
            //Check Channel Recently Aired Restriction
            if (recentlyAiredRights(validCatchupChannel)) {
                const validChannelInfo = {
                    Schedule: validCatchupSchedule,
                    Channel: validCatchupChannel,
                    Service: channelMap.getService(validCatchupChannel),
                };

                const combinedEntitlements =
                    (validCatchupSchedule?.Entitlements &&
                        removeEntitlementsAbbreviationsAndSort(
                            validCatchupSchedule.Entitlements
                        )) ||
                    [];

                if (isInHome(combinedEntitlements, ipStatus)) {
                    // with out subscription also able to see restart button
                    const channelInfo = findChannelByField(
                        params?.ChannelNumber ||
                        validCatchupSchedule?.ChannelNumber ||
                        validCatchupChannel?.Number,
                        "Number",
                        undefined,
                        undefined,
                        channelMap?.Channels
                    ).channel;
                    if (
                        channelInfo &&
                        channelInfo.isSubscribed &&
                        channelInfo.isPermitted &&
                        channelMap.getService(channelInfo)
                    ) {
                        if (
                            playAction &&
                            bookmark &&
                            bookmarkSeconds > 0 &&
                            hasRemainingSeconds(
                                bookmarkSeconds,
                                runTimeSeconds
                            ) &&
                            bookmark?.BookmarkType === bookmarkType.Catchup
                        ) {
                            ctaButtonList.push({
                                button: {
                                    buttonType: "TextIcon",
                                    buttonText:
                                        global.lStrings?.str_details_cta_resume,
                                    buttonAction:
                                        global.lStrings
                                            ?.str_details_cta_restart,
                                    iconSource: playIcon,
                                },
                                ChannelInfo: validChannelInfo,
                            });
                        } else {
                            ctaButtonList.push({
                                button: {
                                    buttonType: "TextIcon",
                                    buttonText:
                                        global.lStrings
                                            ?.str_details_cta_restart,
                                    buttonAction:
                                        global.lStrings
                                            ?.str_details_cta_restart,
                                    iconSource: playIcon,
                                },
                                ChannelInfo: validChannelInfo,
                            });
                        }
                    }
                }
            }
        }
    }
    return ctaButtonList;
};

export const isPlayable = (entitlements: any, account: any) => {
    // TODO
    if (account?.pbrOverride) {
        return true;
    }

    if (0 === entitlements?.length) {
        return true;
    }

    // if (
    //     isPhoneBlocked(entitlements) ||
    //     isIOsBlocked(entitlements) ||
    //     isAndroidBlocked(entitlements) ||
    //     isTabletBlocked(entitlements) ||
    //     isBrowserBlocked(entitlements) ||
    //     isOutOfHomeBlocked(entitlements) ||
    //     isWifiBlocked(entitlements) ||
    //     isCellularBlocked(entitlements)
    //     isHdmiBlocked(entitlements) ||
    //     isRecentlyAiredBlocked(entitlements)
    // ) {
    //     return false;
    // }
    return true;
};

export const isInHome = (restrictions: any, ipStatus: any) => {
    const { InHome = undefined, InCountry = undefined } = ipStatus || {};

    if (InCountry !== RestrictionValue.Yes) {
        return false;
    }

    if (!restrictions || !restrictions.length) {
        return true;
    }

    const { OUTOFHOME_BLOCKED, OH } = pbr.RestrictionsType;

    let isAllowedToPlay = true;
    for (let restriction of restrictions) {
        // Is 'out_of_home_blocked' or 'oh' exists in the restrictions list?
        if (restriction === OUTOFHOME_BLOCKED || restriction === OH) {
            isAllowedToPlay =
                InHome === RestrictionValue.Yes &&
                InCountry === RestrictionValue.Yes;
            break;
        }
    }

    return isAllowedToPlay;
};

export function durationInDaysHoursMinutes(seconds: number): string {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const mins = Math.floor((((seconds % (24 * 3600)) / 3600) % 1) * 60);

    return `${days ? days + "d " : ""}${hours ? hours + "h " : ""}${mins ? mins + "m" : seconds ? seconds + "s " : ""
        }`;
}

export function durationInYearsMonthsDays(seconds: number): string {
    const numberOfDays = Math.floor(seconds / (24 * 3600));

    const years = Math.floor(numberOfDays / 365);
    const months = Math.floor((numberOfDays % 365) / 30);
    const days = Math.floor((numberOfDays % 365) % 30);
    return `${years ? years + "y " : ""}${months ? months + "m " : ""}${days ? days + "d" : ""
        }`;
}

export function getDateFormat(date: Date): string {
    if (!date) {
        return "";
    }
    const day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Valid Rating system is declared at str_rating_providers
const ratingProvidersObject = AppStrings.str_rating_providers || {};

export function chooseRating(ratings: any): string {
    if (!ratings || !Array.isArray(ratings)) {
        return "";
    }

    let value = "";

    // Get the first rating whose System is valid.
    ratings.some((rating: any): boolean => {
        //@ts-ignore
        if (ratingProvidersObject[rating.System]) {
            value = rating.Value;
            return true;
        }
        return false;
    });

    // Otherwise pick the first. There's generally only one anyway.
    if (!value && ratings?.length) {
        value = ratings[0].Value;
    }

    return value || "";
}

export function getMetadataLine2(item: any): string {
    if (!item) {
        return "";
    }
    let callLetter = undefined, channelNumber = undefined;
    const releaseYear = item.ReleaseYear || item.CatalogInfo?.ReleaseYear || "";
    const contentRatings = chooseRating(
        item.Ratings || item.CatalogInfo?.Ratings
    );

    if (item?.Schedule?.channel) {
        callLetter = `${item?.Schedule?.channel?.CallLetters}`
        channelNumber = `${item?.Schedule?.channel?.Number}`
    }
    const replacements = { ReleaseYear: releaseYear, Ratings: contentRatings, CallLetter: callLetter, ChannelNumber: channelNumber }
    const replacedString = replacePlaceHoldersInTemplatedString(appUIDefinition.config.metadataTemplate, replacements);
    const tempArray = replacedString.split(" ").filter((e) => !e.includes('null'));
    return tempArray.join(metadataSeparator);
}

export const getEpisodeInfo = (item: any): string | undefined => {
    if (!item) {
        return;
    }
    if (item && !item.SeasonNumber && !item.EpisodeNumber) {
        return;
    }

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

export const getNetworkInfo = (item: any) => {
    const networkInfo: any = {};
    const network = item?.CatalogInfo?.Network || item?.Network;
    if (network) {
        const networkImages: any = {};
        if (network?.Images) {
            for (const images of network?.Images) {
                networkImages[images.ImageType] = images;
            }

            networkInfo["tenFootLargeURL"] = getNetworkImageUri(
                networkImages,
                "TenFootLarge"
            );
            networkInfo["twoFootLargeURL"] = getNetworkImageUri(
                networkImages,
                "OneFootLarge"
            );
            networkInfo["oneFootLargeURL"] = getNetworkImageUri(
                networkImages,
                "TwoFootLarge"
            );
            networkInfo["tenFootSmallURL"] = getNetworkImageUri(
                networkImages,
                "TenFootSmall"
            );
            networkInfo["twoFootSmallURL"] = getNetworkImageUri(
                networkImages,
                "OneFootSmall"
            );
            networkInfo["oneFootSmallURL"] = getNetworkImageUri(
                networkImages,
                "TwoFootSmall"
            );
        }
        networkInfo["name"] = network?.Name;
        return networkInfo;
    }
    return;
};

export const removeEntitlementsAbbreviationsAndSort = (entitlements: any) => {
    if (!entitlements || !entitlements.length) {
        return;
    }

    entitlements.forEach((entitlement, index) => {
        if (pbr.AbbreviatedRestrictions[entitlement]) {
            entitlements[index] = pbr.AbbreviatedRestrictions[entitlement];
        }
    });
    return sortInorder(entitlements, null);
};

export const massageDiscoveryFeed = (
    feed: any,
    sourceType: SourceType,
    liveSchedules?: any
): discoveryFeedItem => {
    return feed.Items?.map((item: any) => {
        if (
            item["ItemType"] === ItemShowType.Channel ||
            item["ItemType"] === ItemShowType.FavoriteChannel
        ) {
            const schedule = liveSchedules?.[item.Id]?.now || undefined;
            item = {
                ...schedule,
            };
            item["Schedule"] = schedule;
            item["assetType"] = generateType(item, SourceType.LIVE);
            item["CallLetters"] = schedule?.channel?.CallLetters;
            item["networkInfo"] = schedule?.channel?.LogoUri && {
                logoUri: schedule?.channel?.LogoUri && {
                    uri: schedule?.channel?.LogoUri,
                },
            };
            item["metadataLine3"] = schedule
                ? `${DateToAMPM(new Date(schedule.StartUtc))}-${DateToAMPM(
                    new Date(schedule.EndUtc)
                )}`
                : "";
            item["progress"] = schedule
                ? getDateDifferenceInSeconds(
                    new Date(),
                    new Date(item?.Schedule?.StartUtc)
                ) /
                getDateDifferenceInSeconds(
                    new Date(item?.Schedule?.EndUtc),
                    new Date(item?.Schedule?.StartUtc)
                )
                : undefined;
        } else {
            if (!sourceType) {
                item["assetType"] = generateType(item, item?.ItemType);
            } else {
                item["assetType"] = generateType(item, sourceType);
            }
        }
        item["title"] = item.Name || item.CatalogInfo?.Name;
        item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
        item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
        item["ItemType"] = item?.ItemType;
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
            item["metadataLine2"] =
                ItemCount === 1
                    ? format(
                        AppStrings.str_packageDetails_item_count,
                        ItemCount.toString()
                    )
                    : ItemCount > 1
                        ? format(
                            AppStrings?.str_packageDetails_items_count,
                            ItemCount.toString()
                        )
                        : "";
        } else {
            item["metadataLine2"] = getMetadataLine2(item);
        }
        item["episodeInfo"] = getEpisodeInfo(item);
        item["ratingValues"] =
            (ContentRatings?.length && ContentRatings[0]?.RatingValues) || [];

        //checking is adultStore locked or not
        if (config.allowAdultLocks || !item?.IsAdultStore) {
            return item;
        }
    })?.filter((i: any) => i);
};

export const massageDVRManagerFeed = (feedContent: any): discoveryFeedItem => {
    return feedContent.map((item: any) => {
        if (!item) {
            return;
        }
        item["title"] = item.Name || item.Title || item.CatalogInfo?.Name || "";
        item["assetType"] = item.SeasonId
            ? generateType(item, SourceType.LIVE)
            : generateType(item, SourceType.VOD);
        item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
        item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
        if (!item["metadataLine2"]) {
            item["metadataLine2"] = getMetadataLine2(item);
        }
        item["episodeInfo"] = item.SeasonId ? getEpisodeInfo(item) : "";
        item["Rating"] = chooseRating(
            item.Ratings || item.CatalogInfo?.Ratings
        );
        item["ItemType"] = item.SeriesId
            ? ItemShowType.DvrRecording
            : ItemShowType.DvrProgram;
        item["Id"] = item.programId;
        return item;
    });
};

export const massageDiscoveryFeedAsset = (
    item: any,
    sourceType: SourceType
): any => {
    if (!item) {
        return;
    }

    item["assetType"] = generateType(item, sourceType);
    item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
    item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
    item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
    item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
    item["genre"] = item.Genres?.length && item.Genres[0].Name;
    return item;
};

export const isExpiringSoon = (item: any): boolean => {
    if (item) {
        const expiryDate = new Date(item.ContentExpiryUtc);
        let itemExpires = false;
        if (item.ItemState === DvrItemState.RECORDED) {
            itemExpires =
                isDateWithinExpiryThreshold(
                    expiryDate,
                    assetExpiryDaysThreshold
                ) || hasRecordingExpired(expiryDate);
        }
        return itemExpires;
    }
    return false;
};

export const timeLeft = (expirationUtc: string): string => {
    if (!expirationUtc) {
        return "";
    }

    const differenceInSeconds = getDateDifferenceInSeconds(
        new Date(),
        new Date(expirationUtc)
    );
    return `${AppStrings?.str_asset_expires} ${differenceInSeconds >= secondsInYear
        ? durationInYearsMonthsDays(differenceInSeconds)
        : durationInDaysHoursMinutes(differenceInSeconds)
        }`;
};


export const massageResult = {
    Movie: (itemList: any, type?: any) => {
        return massageSubscriberFeed(itemList, "", SourceType.VOD, type);
    },
    Dvr: (itemList: any, type?: any) => {
        return massageDVRFeed(
            { SubscriptionGroups: itemList.LibraryItems },
            SourceType.DVR,
            type
        );
    },
    TVShow: (itemList: any, type?: any, liveSchedules?: any) => {
        return massageSubscriberFeed(
            itemList,
            "",
            SourceType.LIVE,
            type,
            liveSchedules
        );
    },
    Person: (itemList: any) => {
        return massageCastAndCrew(itemList.LibraryItems, SourceType.PERSON);
    },
    MixedShow: (itemList: any) => {
        return massageDVRManagerFeed(itemList);
    },
};

export const RentalTimeLeft = (
    PlayActions: any,
    posterStampFormat: boolean
): string => {
    // if no usable actions, use expiration time of first action.

    const usablePlayAction =
        PlayActions?.filter((playAction: IPlayAction) => {
            // Usable play actions
            return filterUsablePlayActions(playAction);
        }) || (PlayActions || [])[0];

    return getRentalTimeLeftFromExpirationDate(
        usablePlayAction[0] || {},
        posterStampFormat
    );
};

export const getRentalTimeLeftFromExpirationDate = (
    playAction: IPlayAction,
    posterStampFormat?: boolean
): string => {
    if (!playAction) {
        return "";
    }

    if (playAction.TransactionType === TransactionType.PURCHASE) {
        return AppStrings?.str_ppv_message_4;
    } else if (playAction.TransactionType === TransactionType.SUBSCRIBE) {
        return "";
    }

    if (!playAction.ExpirationUtc) {
        return "";
    }

    let expirationDate: Date = new Date(playAction.ExpirationUtc);
    const expiryInSeconds = Math.floor(
        durationStringToSeconds(playAction.TimeToExpiry)
    );

    return formatExpirationString(
        expirationDate,
        expiryInSeconds,
        posterStampFormat
    );
};

export const formatExpirationString = (
    expirationDate: Date,
    expiryInSeconds: number,
    posterStampFormat?: boolean
): string => {
    let dateStr, timeStr;

    let now = new Date().getTime();
    let todayMidnight: Date = new Date(now);
    todayMidnight.setHours(24, 0, 0, 0);
    let tomorrowMidnight: Date = new Date(now);
    tomorrowMidnight.setHours(24, 0, 0, 0);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    let timeTillTodayMidnight = (todayMidnight.getTime() - now) / 1000;
    let timeTillTomorrowMidnight = (tomorrowMidnight.getTime() - now) / 1000;

    if (posterStampFormat) {
        if (expiryInSeconds < timeTillTodayMidnight) {
            // do not display date if expiry is today.
            dateStr = "";
            timeStr = format_time(expirationDate);
        } else if (expiryInSeconds < timeTillTomorrowMidnight) {
            dateStr = AppStrings?.str_dates.str_tomorrow;
            timeStr = posterStampFormat ? format_time(expirationDate) : "";
        } else {
            dateStr = posterStampFormat
                ? format_date_year_month_day(expirationDate)
                : format_date_month_day(expirationDate);
            timeStr = posterStampFormat ? format_time(expirationDate) : "";
        }

        return `${AppStrings?.str_purchase_message_exp} ${dateStr !== "" ? dateStr : timeStr
            }`;
    } else {
        if (expiryInSeconds < timeTillTodayMidnight) {
            dateStr = "";
            if (expiryInSeconds > 3600) {
                const hours = Math.floor(expiryInSeconds / 3600);
                timeStr = `${AppStrings?.str_asset_expires} ${hours} ${hours > 1
                    ? AppStrings?.str_purchase_message_hours
                    : AppStrings?.str_purchase_message_hour
                    }`;
            } else {
                timeStr =
                    expiryInSeconds > 60
                        ? `${AppStrings?.str_asset_expires} ${Math.floor(
                            expiryInSeconds / 60
                        )} ${AppStrings?.str_purchase_message_mins}`
                        : AppStrings?.str_purchase_message_expires_now;
            }
        } else if (expiryInSeconds < 86400) {
            dateStr = "";
            const hours = Math.floor(expiryInSeconds / 3600);
            timeStr = `${AppStrings?.str_asset_expires} ${hours} ${hours > 1
                ? AppStrings?.str_purchase_message_hours
                : AppStrings?.str_purchase_message_hour
                }`;
        } else {
            timeStr = "";
            const days = Math.floor(expiryInSeconds / (3600 * 24));
            const hoursLeft = Math.floor(
                (expiryInSeconds - days * (3600 * 24)) / 3600
            );
            if (hoursLeft > 6) {
                dateStr = `${AppStrings?.str_asset_expires} ${days} ${days > 1
                    ? AppStrings?.str_purchase_message_days
                    : AppStrings?.str_purchase_message_day
                    } ${AppStrings?.str_purchase_message_and} ${hoursLeft} ${hoursLeft > 1
                        ? AppStrings?.str_purchase_message_hours
                        : AppStrings?.str_purchase_message_hour
                    }`;
            } else {
                dateStr = `${AppStrings?.str_asset_expires} ${days} ${days > 1
                    ? AppStrings?.str_purchase_message_days
                    : AppStrings?.str_purchase_message_day
                    }`;
            }
        }
        return dateStr !== "" ? dateStr : timeStr;
    }
};

export function format_date_month_day(date: Date): string {
    let displayDate = "M/d";
    if (displayDate) {
        const dLength = displayDate.match(/d/g),
            mLength = displayDate.match(/m/g);
        let getMonth, getdate;
        //@ts-ignore
        displayDate = dLength && displayDate.replace(dLength.join(""), "{0}");
        //@ts-ignore
        displayDate = mLength && displayDate.replace(mLength.join(""), "{1}");

        if (dLength && dLength.length) {
            getdate = getDayString(dLength.length, date);
        }
        if (mLength && mLength.length) {
            getMonth = getMonthString(mLength.length, date);
        }
        displayDate = displayDate
            .replace("{0}", getdate)
            .replace("{1}", getMonth);
    }
    return displayDate;
}

export const format_time = (time: Date): string => {
    if (!(time instanceof Date) || isNaN(time.getTime())) {
        return "";
    }
    return format_time_options(time, "h:mm A");
};

export const format_time_options = (time: Date, format: string): string => {
    let milliSeconds = time.getMilliseconds();
    // round up seconds
    if (format.indexOf("SSS") === -1 && milliSeconds > 500) {
        const roundedToSeconds =
            Math.floor((time.getTime() + 500) / 1000) * 1000;
        time = new Date(roundedToSeconds);
    }
    let H_hours: number = time.getHours();
    let h_hours: number = H_hours < 12 ? H_hours : H_hours - 12;
    if (h_hours === 0) {
        h_hours = 12;
    }
    let m_minutes: number = time.getMinutes();
    let seconds = time.getSeconds();

    format = format.replace(
        /HH/g,
        H_hours < 10 ? "0" + H_hours : String(H_hours)
    );
    format = format.replace(/H/g, String(H_hours));
    format = format.replace(
        /hh/g,
        h_hours < 10 ? "0" + h_hours : String(h_hours)
    );
    format = format.replace(/h/g, String(h_hours));
    format = format.replace(
        /mm/g,
        m_minutes < 10 ? "0" + m_minutes : String(m_minutes)
    );
    format = format.replace(/m/g, String(m_minutes));
    format = format.replace(/a/g, H_hours > 11 ? "pm" : "am");
    format = format.replace(/ss/g, padLeftWithZero(seconds));
    format = format.replace(/SSS/g, String(milliSeconds));
    format = format.replace(/A/g, H_hours > 11 ? "PM" : "AM");
    return format;
};

function padLeftWithZero(num: number): string {
    return num > 9 ? num.toString() : "0" + num;
}

export const durationStringToSeconds = (duration: string): number => {
    if (!duration) {
        return NaN;
    }
    const negative = duration.indexOf("-") === 0 ? -1 : 1;
    if (negative < 0) {
        duration = duration.slice(1);
    }

    let fraction = 0;
    const iDot = duration.indexOf(".");
    if (iDot !== -1) {
        if (duration.indexOf(":") > iDot) {
            duration = duration.replace(".", ":");
        }
    }
    const split = duration.split(".");

    if (split.length === 2) {
        fraction = parseFloat("0." + split[1]);
        duration = split[0];
    }
    if (split.length < 3) {
        let durationParts = duration.split(":");
        if (durationParts.length <= 1) {
            return negative * Number(durationParts) + fraction;
        } else if (durationParts.length > 1 && durationParts.length <= 4) {
            const secondsInHour = 3600;
            durationParts = durationParts.reverse();
            let hours = Number(durationParts[2] || 0);
            let days = 0;
            if (durationParts.length === 4) {
                if (hours < 24) {
                    days = Number(durationParts[3] || 0);
                } else {
                    return NaN;
                }
            } else if (hours > 24) {
                days += Math.floor(hours / 24);
                hours -= days * 24;
            }
            const t =
                negative * days * 24 * secondsInHour +
                Math.min(24, hours) * secondsInHour +
                Math.min(59, Number(durationParts[1]) || 0) * 60 +
                Math.min(59, Number(durationParts[0]) || 0) +
                fraction;
            return t;
        }
    }
    return Infinity;
};

export function format_date_year_month_day(date: Date): string {
    let displayDate = "mm/dd/yyyy";
    if (displayDate) {
        const dLength = displayDate.match(/d/g) || [],
            mLength = displayDate.match(/m/g) || [],
            yLength = displayDate.match(/y/g) || [];
        displayDate = displayDate.replace(dLength.join(""), "{0}");
        displayDate = displayDate.replace(mLength.join(""), "{1}");
        displayDate = displayDate.replace(yLength.join(""), "{2}");
        let getdate, getMonth, getYear;

        if (dLength && dLength.length) {
            getdate = getDayString(dLength.length, date);
        }
        if (mLength && mLength.length) {
            getMonth = getMonthString(mLength.length, date);
        }
        if (yLength && yLength.length) {
            getYear = getYearString(yLength.length, date);
        }

        displayDate = displayDate
            .replace("{0}", getdate)
            .replace("{1}", getMonth)
            //@ts-ignore
            .replace("{2}", getYear);
    }
    return displayDate;
}

function getDayString(dLength: number, dateString: Date): any {
    const str_day_short_names = [
        AppStrings?.str_dates.str_sunday_short,
        AppStrings?.str_dates.str_monday_short,
        AppStrings?.str_dates.str_tuesday_short,
        AppStrings?.str_dates.str_wednesday_short,
        AppStrings?.str_dates.str_thursday_short,
        AppStrings?.str_dates.str_friday_short,
        AppStrings?.str_dates.str_saturday_short,
    ];
    const str_day_names = [
        AppStrings?.str_dates.str_sunday,
        AppStrings?.str_dates.str_monday,
        AppStrings?.str_dates.str_tuesday,
        AppStrings?.str_dates.str_wednesday,
        AppStrings?.str_dates.str_thursday,
        AppStrings?.str_dates.str_friday,
        AppStrings?.str_dates.str_saturday,
    ];
    let date: any;
    switch (dLength) {
        case 1: {
            date = dateString.getDate();
            break;
        }
        case 2: {
            const dateDigi = dateString.getDate();
            date = dateDigi < 10 ? "0" + dateDigi : dateDigi;
            break;
        }
        case 3: {
            date = str_day_short_names[dateString.getDay()];
            break;
        }
        case 4: {
            date = str_day_names[dateString.getDay()];
            break;
        }
        default: {
            date = "";
            break;
        }
    }
    return date;
}

function getYearString(yLength: number, dateString: Date): string {
    let year: any;
    switch (yLength) {
        case 2: {
            year = dateString.getFullYear() % 100;
            break;
        }
        case 4: {
            year = dateString.getFullYear();
            break;
        }
        default: {
            year = "";
            break;
        }
    }
    return year;
}

function getMonthString(mLength: number, dateString: Date): any {
    const str_month_names = [
        AppStrings?.str_dates.str_january,
        AppStrings?.str_dates.str_february,
        AppStrings?.str_dates.str_march,
        AppStrings?.str_dates.str_april,
        AppStrings?.str_dates.str_may,
        AppStrings?.str_dates.str_june,
        AppStrings?.str_dates.str_july,
        AppStrings?.str_dates.str_august,
        AppStrings?.str_dates.str_september,
        AppStrings?.str_dates.str_october,
        AppStrings?.str_dates.str_november,
        AppStrings?.str_dates.str_december,
    ];
    let month: any;
    switch (mLength) {
        case 1: {
            month = dateString.getMonth() + 1;
            break;
        }
        case 2: {
            const monthDigi = dateString.getMonth() + 1;
            month = monthDigi < 10 ? "0" + monthDigi : monthDigi;
            break;
        }
        case 3: {
            month = str_month_names[dateString.getMonth()].substr(0, 3);
            break;
        }
        case 4: {
            month = str_month_names[dateString.getMonth()];
            break;
        }
        default: {
            month = "";
            break;
        }
    }
    return month;
}

export const massageSubscriberFeed = (
    feedContent: any,
    libraryId: string,
    sourceType: SourceType,
    type?: any,
    liveSchedules?: any
): any => {
    if (!feedContent.LibraryItems && !feedContent.LibraryItems?.length) {
        return;
    }

    return feedContent.LibraryItems?.map((item: any) => {
        item["libraryId"] = libraryId;
        const { PlayActions } = item;
        let isRentOrPurchased = false;
        if (PlayActions) {
            isRentOrPurchased = PlayActions.some(
                (pa: any) =>
                    pa?.TransactionType === TransactionType.RENT ||
                    pa?.TransactionType === TransactionType.PURCHASE ||
                    pa?.TransactionType === TransactionType.SUBSCRIBE
            );
            if (isRentOrPurchased) {
                item["metadataLine3"] = RentalTimeLeft(PlayActions, true);
            }
        }
        let contextualSourceType = sourceType;
        let hasLiveSchedule = isScheduleCurrent(item.Schedule);

        if (item.isLive || hasLiveSchedule) {
            contextualSourceType = SourceType.LIVE;
        } else if (item.ItemType === ItemType.RECORDING) {
            contextualSourceType = SourceType.DVR;
        }

        item["assetType"] =
            item.assetType || generateType(item, contextualSourceType);
        item["title"] =
            item?.Name || item?.Title || item?.CatalogInfo?.Name || "";
        item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
        item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
        item["progress"] = item.Bookmark
            ? item.Bookmark.TimeSeconds / item.Bookmark.RuntimeSeconds
            : undefined;

        if (
            item.Bookmark &&
            item.Bookmark.RuntimeSeconds &&
            item.Bookmark.TimeSeconds >= 0
        ) {
            item["metadataLine3"] = `${durationInDaysHoursMinutes(
                item.Bookmark.RuntimeSeconds - item.Bookmark.TimeSeconds
            )} ${AppStrings?.str_yourstuff_asset_duration_left}`;
        }

        item["durationMinutesString"] =
            (item.CatalogInfo && durationInHoursMinutes(item.CatalogInfo)) ||
            "";
        item["Rating"] = chooseRating(
            item.Ratings || item.CatalogInfo?.Ratings
        );
        item?.CatalogInfo?.RuntimeSeconds
            ? (item["runtime"] = ` • ${fromSecondsToHHMMSS(
                item.CatalogInfo.RuntimeSeconds
            )}`)
            : (item["runtime"] = "");
        item["metadataLine2"] = item?.metadataLine2 || getMetadataLine2(item);

        item["usablePlayActions"] = [];

        item.PlayActions?.length > 0 &&
            item.PlayActions.map((playAction: IPlayAction) => {
                // Usable play actions
                if (filterUsablePlayActions(playAction)) {
                    playAction["Tags"] = item?.CatalogInfo?.Tags;
                    playAction["Bookmark"] = item?.Bookmark;
                    playAction["CatalogInfo"] = item?.CatalogInfo;
                    item["usablePlayActions"].push(playAction);
                }
            });
        item["isAssetPlayable"] = item.usablePlayActions.length > 0;

        item["ItemType"] =
            type || item["ItemType"] === "PayPerView" ? item["ItemType"] : "";

        if (liveSchedules && item?.StationIds?.length) {
            item?.StationIds?.forEach((stationId: string) => {
                if (
                    item?.Id === liveSchedules[stationId]?.now?.SeriesId ||
                    item?.Id === liveSchedules[stationId]?.now?.ProgramId
                ) {
                    item["Schedule"] = liveSchedules[stationId]?.now;
                }
            });
        }

        return item;
    });
};

export const massageDVRFeed = (
    list: any,
    sourceType: SourceType = SourceType.DVR,
    type?: any,
    channelMap?: any,
    requiredAll?: boolean,
    recordingBookmarks?: any
): any => {
    let requiredList = [];
    if (!requiredAll && list?.SubscriptionGroups?.length) {
        requiredList = list.SubscriptionGroups.slice(
            0,
            config.defaultFeedItemsCount
        );
    } else {
        requiredList = list?.SubscriptionGroups;
    }
    return (
        requiredList.length &&
        requiredList.map((item: any) => {
            let feed = null;
            if (
                item.Definition === Definition.SERIES ||
                item.Definition === Definition.GENERIC_PROGRAM
            ) {
                feed = item.SeriesDetails;
                item["Id"] =
                    (item?.SubscriptionItems?.length &&
                        item?.SubscriptionItems[0]?.ProgramId) ||
                    feed?.Id ||
                    item?.Id ||
                    "";
            } else if (item.Definition === Definition.SINGLE_PROGRAM) {
                feed =
                    item?.SubscriptionItems?.length &&
                    item?.SubscriptionItems[0].ProgramDetails;
                item["Id"] =
                    (item?.SubscriptionItems?.length &&
                        item?.SubscriptionItems[0]?.ProgramId) ||
                    feed?.Id ||
                    item?.Id ||
                    "";
            }

            if (
                !feed &&
                (item.ShowType === ItemShowType.TVShow ||
                    item.ShowType === ItemShowType.Series)
            ) {
                item.Definition = Definition.SERIES;
            } else if (
                !feed &&
                (item.ShowType === ItemShowType.Program ||
                    item.ShowType === ItemShowType.SingleProgram)
            ) {
                item.Definition = Definition.SINGLE_PROGRAM;
            }

            item["durationMinutesString"] = durationInMinutes(item);
            item["Rating"] = chooseRating(item.Ratings);
            item["assetType"] = generateType(item, sourceType);
            item["title"] = feed ? feed.Title : item["Name"];
            item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
            item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
            item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
            item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");

            const {
                SeriesDetails: {
                    StartYear = "",
                    Ratings: SeriesDetailsRatings = undefined,
                } = {},
            } = item;
            const [SubscriptionItem = {}] = item.SubscriptionItems || [];
            const {
                ProgramDetails,
                Settings: { ChannelNumber = undefined } = {},
                ScheduledAvailabilityStartUtc,
                ActualAvailabilityEndUtc,
                ItemState,
            } = SubscriptionItem || {};
            const {
                SeasonNumber,
                EpisodeNumber,
                Ratings: ProgramDetailsRatings,
                ReleaseDate,
                EpisodeTitle,
            } = ProgramDetails || {};

            if (SeasonNumber && EpisodeNumber) {
                item["episodeInfo"] = `S${SeasonNumber} E${EpisodeNumber}`;
            }

            if (
                EpisodeTitle &&
                !ProgramDetails?.Title?.includes(EpisodeTitle)
            ) {
                ProgramDetails.Title = `${ProgramDetails.Title}${metadataSeparator}${EpisodeTitle}`;
            }
            if (
                ScheduledAvailabilityStartUtc &&
                ActualAvailabilityEndUtc &&
                ItemState !== DvrRecordedState.Recording
            ) {
                const duration = getDurationSeconds(SubscriptionItem);
                item["metadataLine3"] = convertSecondsToDayHourMinStrings(
                    duration
                );
                item["recordingIcon"] = false;
            } else if (ItemState === DvrRecordedState.Recording) {
                item["metadataLine3"] = undefined;
                item["recordingIcon"] = true;
            }

            if (ChannelNumber && channelMap) {
                let channel =
                    channelMap.findChannelByNumber(ChannelNumber) || {};
                channel = channel.channel || {};

                const { LiveRights, CallLetters } = channel;
                const metadata = [];
                const ratings = SeriesDetailsRatings || ProgramDetailsRatings;
                const chosenRating = chooseRating(ratings);

                if (chosenRating && (StartYear || ReleaseDate)) {
                    const releaseYear = new Date(ReleaseDate);
                    metadata.push(
                        StartYear ? StartYear : releaseYear.getFullYear()
                    );
                    metadata.push(chosenRating);
                } else if (StartYear || ReleaseDate) {
                    const releaseYear = new Date(ReleaseDate);
                    metadata.push(
                        StartYear ? StartYear : releaseYear.getFullYear()
                    );
                } else if (chosenRating) {
                    metadata.push(chosenRating);
                }

                if (LiveRights && CallLetters) {
                    metadata.push(`${CallLetters} ${ChannelNumber}`);
                    // Quality
                    if (LiveRights.length) {
                        const qualities = generalizeQuality(LiveRights);
                        const quality = qualities && qualities[0];
                        metadata.push(quality?.q);
                    }
                }
                item["metadataLine2"] = metadata.join(metadataSeparator);
            }

            recordingBookmarks?.length &&
                recordingBookmarks.map((bookmark: any) => {
                    if (
                        (item.SeriesId === bookmark.SeriesId &&
                            SubscriptionItem.ProgramId ===
                            bookmark.ProgramId) ||
                        SubscriptionItem.ProgramId === bookmark.ProgramId
                    ) {
                        if (bookmark.TimeSeconds < bookmark.RuntimeSeconds) {
                            item["progress"] = bookmark
                                ? bookmark.TimeSeconds / bookmark.RuntimeSeconds
                                : undefined;
                            item["isWatched"] = false;
                        } else if (
                            bookmark.TimeSeconds >= bookmark.RuntimeSeconds
                        ) {
                            item["isWatched"] = true;
                        }
                    }
                });

            const {
                episodeInfo = undefined,
                metadataLine2 = undefined,
                metadataLine3 = undefined,
                recordingIcon = undefined,
            } = SubscriptionItem || {};
            if (episodeInfo) {
                item["episodeInfo"] = episodeInfo;
            }
            if (metadataLine2) {
                item["metadataLine2"] = metadataLine2;
            }
            if (metadataLine3) {
                item["metadataLine3"] = metadataLine3;
            }
            item["recordingIcon"] =
                recordingIcon === undefined
                    ? item["recordingIcon"]
                    : recordingIcon;
            item["ItemType"] = type || "";
            return item;
        })
    );
};

export const massageLiveFeed = (
    liveItems: any,
    sourceType: SourceType,
    feedType?: any
): any => {
    return liveItems.map((item: any) => {
        if (!item) {
            return {};
        }

        const { Schedule } = item;
        const {
            Name = undefined,
            ShowType = undefined,
            SeriesId = undefined,
            ProgramId = undefined,
            Description = undefined,
            ReleaseYear = undefined,
        } = Schedule || {};

        item["title"] = item.Name || Name || "";
        item["ProgramId"] =
            ShowType === ItemShowType.TVShow ? SeriesId : ProgramId;
        item["CallLetters"] = item.ChannelInfo?.channel?.CallLetters;
        item["networkLogo"] = item.ChannelInfo?.channel?.LogoUri;

        item["networkInfo"] = {
            logoUri:
                (item.ChannelInfo?.channel?.LogoUri && {
                    uri: item.ChannelInfo?.channel?.LogoUri,
                }) ||
                networkLogoPlaceholder,
        };

        item["Description"] = Description;
        item["ReleaseYear"] = ReleaseYear;

        item["assetType"] = generateType(item, sourceType);
        item["image16x9PosterURL"] = getImageUri(Schedule, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(Schedule, "16x9/KeyArt");
        item["image3x4PosterURL"] = getImageUri(Schedule, "3x4/Poster");
        item["image3x4KeyArtURL"] = getImageUri(Schedule, "3x4/KeyArt");
        item["image2x3PosterURL"] = getImageUri(Schedule, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(Schedule, "2x3/KeyArt");

        item["metadataLine2"] = getMetadataLine2(item);
        item["episodeInfo"] = getEpisodeInfo(Schedule);
        item["metadataLine3"] =
            feedType && Schedule
                ? `${DateToAMPM(
                    new Date(item?.Schedule?.StartUtc)
                )}-${DateToAMPM(new Date(item?.Schedule?.EndUtc))}`
                : "";
        item["progress"] =
            feedType && Schedule
                ? getDateDifferenceInSeconds(
                    new Date(),
                    new Date(item?.Schedule?.StartUtc)
                ) /
                getDateDifferenceInSeconds(
                    new Date(item?.Schedule?.EndUtc),
                    new Date(item?.Schedule?.StartUtc)
                )
                : undefined;
        return item;
    });
};


export const massageCastAndCrew = (
    castAndCrewItems: any[],
    sourceType: SourceType
): any => {
    let mapObj = new Map();
    let len = castAndCrewItems.length;
    for (let i = 0; i < len; i++) {
        if (!mapObj.get(castAndCrewItems[i].PersonId)) {
            mapObj.set(
                castAndCrewItems[i].PersonId || castAndCrewItems[i]?.Id,
                castAndCrewItems[i]
            );
        } else if (
            mapObj.get(castAndCrewItems[i].PersonId) &&
            !mapObj
                .get(castAndCrewItems[i].PersonId)
                .RoleName.includes(castAndCrewItems[i].RoleName)
        ) {
            mapObj.get(castAndCrewItems[i].PersonId).RoleName +=
                " | " + castAndCrewItems[i].RoleName;
        }
    }
    castAndCrewItems = Array.from(mapObj.values());

    return castAndCrewItems?.map((item: any) => {
        item["Id"] = item.PersonId || item.Id;
        item["assetType"] = generateType(item, sourceType);
        item["title"] = item.PersonName || item.FullName || "";
        item["image16x9PosterURL"] = getImageUri(item, "16x9/Poster");
        item["image16x9KeyArtURL"] = getImageUri(item, "16x9/KeyArt");
        item["image2x3PosterURL"] = getImageUri(item, "2x3/Poster");
        item["image2x3KeyArtURL"] = getImageUri(item, "2x3/KeyArt");
        item["image3x4PosterURL"] = getImageUri(item, "3x4/Poster");
        item["image3x4KeyArtURL"] = getImageUri(item, "3x4/KeyArt");
        item["metadataLine2"] = item.RoleName || item.Roles[0];

        return item;
    });
};

export function getDateDifferenceInSeconds(date1: Date, date2: Date): number {
    const dateDiffInMS = date2.getTime() - date1.getTime();
    return Math.abs(Math.floor(dateDiffInMS / 1000));
}

export function getAudioTags(audioEntries: any): any {
    //@ts-ignore
    const combinedAudioIndicator = [];

    if (!audioEntries?.length) {
        //@ts-ignore
        return combinedAudioIndicator;
    }

    for (const audioEntry of audioEntries) {
        audioTagIndicator[audioEntry] &&
            combinedAudioIndicator.push(audioEntry);
    }

    return sortInorder(combinedAudioIndicator);
}

export const getCurrentCatchupScheduleData = (
    catchupSchedulesList: any,
    data: any
) => {
    let currentCatchupSchedule = undefined;
    if (!catchupSchedulesList?.length) {
        return currentCatchupSchedule;
    }

    for (const cs of catchupSchedulesList) {
        if (
            cs.StationId ===
            (data.StationId ||
                data.channel?.id ||
                data.Schedule?.StationId) &&
            cs.CatchupStartUtc ===
            (data?.CatchupStartUtc || data?.Schedule?.CatchupStartUtc) &&
            isScheduleCurrent({
                StartUtc: cs.CatchupStartUtc,
                EndUtc: cs.CatchupEndUtc,
            })
        ) {
            currentCatchupSchedule = cs;
            break;
        }
    }
    return currentCatchupSchedule;
};

export const getChannelName = (channel: any) => {
    return `${channel?.CallLetters || ""} ${channel?.Number || ""}`;
};

const isChannelNotSubscribed = (playOptions: any, channelMap: any) => {
    if (playOptions?.Schedules?.length) {
        return playOptions?.Schedules?.every(
            (schedule: any) => !schedule?.Channel?.isSubscribed
        );
    } else {
        return playOptions?.CatchupSchedules?.every((catchupSchedule: any) => {
            const channel = channelMap.findChannelByStationId(
                catchupSchedule?.StationId
            )?.channel;
            return !channel?.isSubscribed;
        });
    }
};

const getPlayableLiveSchedule = (
    liveSchedules: any,
    params: any,
    channelMap: any,
    account: any,
    isFromEPG?: boolean,
    StationIdFromEPG?: any,
    channelInfo?: any,
    programSubscriberData?: any
) => {
    if (!liveSchedules || !liveSchedules.length || !params) {
        return;
    }

    // Watch Live button
    // Find currently playing schedule based on startUtc, endUtc, channelNumber, if the asset is not playable on the current (contextual) channel then pick the 'best option'
    // NOTE: it is ok for the button to not be contextual is the correct schedule is not avaialble. Ex. user opens details page from guide channel 1 but when they hit "Watch Live" it plays from channel 2
    let validLiveSchedule: any = null;
    let validLiveChannel: any = null;
    let contextualChannel: any = null;
    const contextualSchedule = find(liveSchedules, (schedule: any) => {
        const { StartUtc, EndUtc, ChannelNumber, Entitlements, StationId } =
            schedule || {};
        const channel: any = findChannelByStationId(
            isFromEPG ? StationIdFromEPG : StationId,
            undefined,
            undefined,
            channelMap
        ).channel;

        if (
            (channelInfo &&
                channelInfo.channel &&
                channelInfo.channel.StationId !== StationId) ||
            (programSubscriberData &&
                programSubscriberData.Schedule?.channelId &&
                programSubscriberData.Schedule.channelId !== StationId)
        ) {
            return false;
        }

        const isSchedulePlayable =
            isPlayable(Entitlements, account) && isChannelPlayable(channel);
        const isCurrentSchedule = isScheduleCurrent(schedule);

        // Current schedule must match the passed in start and end time, if there is an asset that is playing on repeat we do not want to render the Watch Live button for the upcoming time slot
        if (
            isSchedulePlayable &&
            isCurrentSchedule &&
            ((StartUtc === params.StartUtc && EndUtc === params.EndUtc) ||
                (Date.parse(StartUtc) === params.startTime * 1000 &&
                    Date.parse(EndUtc) === params.endTime * 1000))
        ) {
            validLiveSchedule = schedule;
            validLiveChannel = channel;
            // Contextual button based on passed in channelNumber
            if (ChannelNumber === +params.ChannelNumber) {
                contextualChannel = channel;
                return true;
            }
        }
        return false;
    });

    // If no contextualSchedule, take the "best option" validLiveSchedule (schedule that is current but might not match the channel number)
    const schedule = contextualSchedule || validLiveSchedule;
    const channel = contextualChannel || validLiveChannel;

    if (schedule && channel) {
        const isSchedulePlayable =
            isPlayable(schedule.Entitlements, account) &&
            isChannelPlayable(channel);

        if (
            isSchedulePlayable &&
            isScheduleCurrent(schedule) &&
            isChannelPlayable(channel)
        ) {
            return {
                Schedule: schedule,
                Channel: channel,
                Service: channelMap.getService(channel),
            };
        }
    }
};

export const massageProgramDataForUDP = (
    playOptions: any,
    subscriberData: any,
    discoveryData: any,
    channelMap: any,
    programSchedulesData: any,
    liveSchedules: any,
    allSubcriptionGroups: any,
    account: any,
    subscriberProgramData: any,
    filteredEpisodePlayOptions?: any,
    viewableRecordings?: any,
    scheduledSubscriptionGroup?: any,
    recorders: any,
    networkIHD: any,
    isSeriesRecordingBlocked?: boolean,
    stationIdFromNavigation?: any,
    startDateFromEPG?: any,
    endDateFromEPG?: any,
    channeRights?: any,
    isFromEPG?: boolean,
    StationIdFromEPG?: any,
    hasFeatureIosCarrierBilling?: boolean
): any => {
    console.log("playOptions", playOptions)
    let programUDPData: any = {};
    let ipStatus = account?.ClientIpStatus || {};
    if (!config.inhomeDetection.useSubscriberInHome) {
        // networkIHD data
        const inHomeValue =
            networkIHD?.status === "inHome" ||
            config.inhomeDetection.inHomeDefault;
        ipStatus["InHome"] = inHomeValue
            ? RestrictionValue.Yes
            : RestrictionValue.No;
    }

    if (
        playOptions?.Bookmark ||
        subscriberData?.Bookmark ||
        subscriberProgramData?.Bookmark
    ) {
        const { RuntimeSeconds, TimeSeconds } =
            subscriberData?.Bookmark ||
            subscriberProgramData?.Bookmark ||
            playOptions?.Bookmark;

        if (RuntimeSeconds && TimeSeconds >= 0) {
            programUDPData["timeLeft"] = durationInDaysHoursMinutes(
                RuntimeSeconds - TimeSeconds
            );
        }
        programUDPData["Bookmark"] =
            subscriberData?.Bookmark ||
            subscriberProgramData?.Bookmark ||
            playOptions?.Bookmark;
    }
    const catchupSchedules = playOptions?.CatchupSchedules;
    const firstCatchupSchedule =
        catchupSchedules &&
        catchupSchedules.length &&
        catchupSchedules[catchupSchedules.length - 1];

    const {
        StartUtc = undefined,
        currentSchedule = {},
        ChannelInfo = {},
    } = subscriberData;

    let { Schedule = {} } = subscriberData;

    if (stationIdFromNavigation) {
        Schedule =
            programSchedulesData?.find(
                (s) => s?.StationId === stationIdFromNavigation
            ) || Schedule;
    }

    // if recorded item, take the channel from Setting of SubscriptionGroup
    if (subscriberData?.Definition) {
        Schedule =
            playOptions?.CatchupSchedules?.find(
                (s) =>
                    s.StartUtc >= subscriberData.Settings?.StartUtc &&
                    s.StationId === subscriberData.Settings.StationId &&
                    s.ChannelNumber === subscriberData.Settings.ChannelNumber
            ) || Schedule;
    } else if (subscriberData.recentlyRecordedId) {
        let subscriptionGrp = scheduledSubscriptionGroup.SubscriptionGroups?.find(
            (s) =>
                s.Id === subscriberData.recentlyRecordedId ||
                s.SubscriptionItems.some(
                    (si) => si.Id === subscriberData.recentlyRecordedId
                )
        );
        if (!subscriptionGrp) {
            subscriptionGrp = viewableRecordings.SubscriptionGroups?.find(
                (s) =>
                    s.Id === subscriberData.recentlyRecordedId ||
                    s.SubscriptionItems.some(
                        (si) => si.Id === subscriberData.recentlyRecordedId
                    )
            );
        }
        const {
            Settings: {
                StartUtc: StartUtcForProgram = undefined,
                StationId: StationIdForProgram = undefined,
                ChannelNumber: ChannelNumberForProgram = undefined,
            } = {},
        } = subscriptionGrp;

        Schedule =
            playOptions?.CatchupSchedules?.find(
                (s) =>
                    s.StartUtc >= StartUtcForProgram &&
                    s.StationId === StationIdForProgram &&
                    s.ChannelNumber === ChannelNumberForProgram
            ) || Schedule;
    }

    let startUTC =
        StartUtc ||
        Schedule.StartUtc ||
        currentSchedule.StartUtc ||
        firstCatchupSchedule?.StartUtc;
    let channelNumber =
        Schedule.channel?.Number ||
        Schedule?.ChannelNumber ||
        ChannelInfo.channel?.Number ||
        currentSchedule?.ChannelNumber ||
        firstCatchupSchedule?.ChannelNumber;
    const programID =
        Schedule.ProgramId ||
        currentSchedule.ProgramId ||
        playOptions?.ProgramId;
    let stationID =
        Schedule.StationId ||
        currentSchedule.StationId ||
        firstCatchupSchedule?.StationId;

    let subscriptionItemForProgram = undefined;
    let combinedEntitlements = subscriberData?.CatalogInfo?.Entitlements || [];
    // Play DVR CTA
    let playDvr = false;
    if (programID) {
        // find viewable subscription group
        const filteredRecording = viewableRecordings?.SubscriptionGroups?.filter(
            (item: any) => {
                return item.SubscriptionItems.length > 0;
            }
        );
        const subscriptionGroupForProgram = filteredRecording?.find((sg: any) =>
            sg?.SubscriptionItems?.find(
                (si: any) =>
                    si &&
                    si.ProgramDetails &&
                    (si.ItemState === DvrItemState.RECORDED ||
                        si.ItemState === DvrItemState.RECORDING) &&
                    si.ProgramDetails.UniversalProgramId === programID
            )
        );
        subscriptionItemForProgram = subscriptionGroupForProgram?.SubscriptionItems?.find(
            (si: any) =>
                si &&
                si.ProgramDetails &&
                (si.ItemState === DvrItemState.RECORDED ||
                    si.ItemState === DvrItemState.RECORDING) &&
                si.ProgramDetails.UniversalProgramId === programID
        );

        if (
            subscriptionItemForProgram &&
            subscriptionItemForProgram?.PlayInfo &&
            subscriptionItemForProgram?.PlayInfo?.length
        ) {
            // Found dvr and  have play info
            // We have an subscription Item with correct state, add CTA
            const entitlements = removeEntitlementsAbbreviationsAndSort(
                subscriptionItemForProgram.PlayInfo[0].Entitlements
            );
            combinedEntitlements.push(
                ...subscriptionItemForProgram.PlayInfo[0].Entitlements
            );
            playDvr = isInHome(entitlements, ipStatus);

            programUDPData["playDvr"] = playDvr;
            programUDPData[
                "subscriptionItemForProgram"
            ] = subscriptionItemForProgram;
        }
    }

    programUDPData["SeriesId"] = discoveryData?.SeriesId;
    programUDPData["Id"] = discoveryData?.Id;
    programUDPData["EpisodeNumber"] = discoveryData?.EpisodeNumber;
    programUDPData["SeasonNumber"] = discoveryData?.SeasonNumber;

    let purchaseActionsExists = false;
    let purchasePackageExists = false;
    let playActionsExists = false;

    const schedules =
        playOptions?.Schedules || filteredEpisodePlayOptions?.Schedules;
    const vods = playOptions?.Vods;
    const subscriptionPackages: SubscriptionPackages[] = [];

    let usablePlayActions: any = [];
    let purchaseActions: any = [];
    let purchasePackageActions: any = [];
    let subscribeActions: PurchaseAction[] = [];
    let purchaseNetwork: Network;
    let expirationUTC;
    let vodCatalogInfo;

    let networkInfo: any = [];
    //Network Logo
    if (subscriberProgramData?.length > 0) {
        for (const programData of subscriberProgramData) {
            networkInfo.push(getNetworkInfo(programData));
        }
    } else {
        playOptions?.Vods &&
            playOptions.Vods.length &&
            networkInfo.push(getNetworkInfo(playOptions.Vods[0]));
    }
    programUDPData["networkInfo"] = networkInfo || [];
    // Quality Indicators
    let combinedQualityLevels: string[] = [];
    let combinedAudioIndicator = [];
    let isRentalPurchaseOrSubscribed = false;
    let isRent = false;
    let rentalWindowMassage = "";
    vods?.length > 0 &&
        vods.map((vod: any) => {
            // Networks
            purchaseNetwork = vod.CatalogInfo?.Network;
            // Purchase Actions
            vod.PurchaseActions?.length > 0 &&
                vod.PurchaseActions.map((purchaseAction: any) => {
                    purchaseAction.VideoProfiles.map((videoProfile: any) => {
                        if (
                            Object.keys(
                                config.playerConfig.supportedEncodings
                            ).includes(videoProfile.Encoding)
                        ) {
                            if (
                                Object.keys(purchaseAction).includes(
                                    "ResourceType"
                                ) &&
                                purchaseAction.ResourceType === "Package" &&
                                purchaseAction.Price !== 0
                            ) {
                                purchasePackageExists = true;
                                purchasePackageActions.push(purchaseAction);
                            } else if (
                                Object.keys(purchaseAction).includes(
                                    "ResourceType"
                                ) &&
                                purchaseAction.TransactionType ===
                                transactionType.SUBSCRIBE &&
                                purchaseAction.Price !== 0
                            ) {
                                subscribeActions.push(purchaseAction);
                            } else if (
                                !Object.keys(purchaseAction).includes(
                                    "ResourceType"
                                ) &&
                                purchaseAction?.ResourceType !==
                                "Subscription" &&
                                purchaseAction?.Price !== 0
                            ) {
                                purchaseActionsExists = true;
                                purchaseActions.push(purchaseAction);
                            }
                        }
                    });

                    // Combined Quality Levels
                    purchaseAction.QualityLevels &&
                        combinedQualityLevels.push(
                            ...purchaseAction.QualityLevels
                        );

                    if (
                        purchaseAction.TransactionType ===
                        TransactionType.RENT ||
                        purchaseAction.TransactionType ===
                        TransactionType.PURCHASE
                    ) {
                        isRent = true;
                    }
                });

            subscriptionPackages.push({
                purchaseNetwork,
                purchaseActions: subscribeActions,
            });

            // Collect Entitlements from CatalogInfo
            vodCatalogInfo = vod.CatalogInfo;
            vod.CatalogInfo?.Entitlements?.length &&
                combinedEntitlements.push(...vod.CatalogInfo?.Entitlements);

            // Play Actions
            vod.PlayActions?.length > 0 &&
                vod.PlayActions.map((playAction: any) => {
                    playActionsExists = true;
                    // Usable play actions
                    if (filterUsablePlayActions(playAction)) {
                        playAction["Tags"] = vod?.CatalogInfo?.Tags;
                        playAction["Bookmark"] = vod?.Bookmark;
                        playAction["CatalogInfo"] = vod?.CatalogInfo;
                        usablePlayActions.push(playAction);
                    }

                    // Restrictions
                    playAction.Restrictions?.length &&
                        combinedEntitlements.push(...playAction.Restrictions);

                    // Expiry attribute
                    if (
                        (playAction.TransactionType ===
                            TransactionType.PURCHASE ||
                            playAction.TransactionType ===
                            TransactionType.RENT ||
                            playAction.TransactionType ===
                            TransactionType.SUBSCRIBE) &&
                        usablePlayActions &&
                        usablePlayActions.length
                    ) {
                        isRentalPurchaseOrSubscribed = true;
                    } else {
                        expirationUTC =
                            playAction.ExpirationUtc ||
                            playAction.CatchupEndUtc;
                    }

                    // Combined Quality Levels
                    combinedQualityLevels.push(
                        playAction.VideoProfile.QualityLevel
                    );

                    //combined Audio indicators
                    let audioEntries = playAction.VideoProfile?.AudioTags
                        ? getAudioTags(
                            Object.keys(playAction.VideoProfile?.AudioTags)
                        )
                        : [];
                    combinedAudioIndicator.push(...getAudioTags(audioEntries));
                });

            if (
                isRentalPurchaseOrSubscribed &&
                !vod.CatalogInfo.Tags.includes("Trailer")
            ) {
                rentalWindowMassage = RentalTimeLeft(usablePlayActions, false);
            }
        });

    const processedSchedules = processSchedules(schedules, channelMap, account);
    if (
        processedSchedules?.combinedAudioTags &&
        processedSchedules?.combinedAudioTags.length
    ) {
        combinedAudioIndicator.push(
            ...sortInorder(processedSchedules?.combinedAudioTags)
        );
    }

    programUDPData["combinedAudioIndicator"] = sortInorder(
        combinedAudioIndicator
    );

    subscriberData["currentSchedule"] =
        processedSchedules?.liveSchedulesList &&
        processedSchedules?.liveSchedulesList?.length &&
        processedSchedules.liveSchedulesList[0];

    const catchupSchedulesList =
        catchupSchedules || filteredEpisodePlayOptions?.Catchups;
    if (catchupSchedulesList && catchupSchedulesList.length) {
        subscriberData[
            "currentCatchupSchedule"
        ] = getCurrentCatchupScheduleData(catchupSchedulesList, subscriberData);
        if (subscriberData?.currentCatchupSchedule) {
            Schedule["Entitlements"] =
                subscriberData?.currentCatchupSchedule?.Entitlements;
        }
    }

    subscriberData["hasUpcomingSchedules"] =
        processedSchedules?.upcomingSchedulesList;

    const { hasUpcomingSchedules: upcomingSchedulesList = [] } = subscriberData;
    const inProgressDVR = [DvrItemState.RECORDED, DvrItemState.RECORDING];
    if (
        subscriptionItemForProgram &&
        inProgressDVR.includes(subscriptionItemForProgram.ItemState)
    ) {
        // if subscriptionItem exists and item is recorded or recording, take settings from it
        const {
            Settings: { ChannelNumber } = {},
            ActualAvailabilityStartUtc,
            ScheduledAvailabilityStartUtc,
            StationId,
        } = subscriptionItemForProgram;
        startUTC =
            subscriptionItemForProgram.ItemState === DvrItemState.RECORDED
                ? ActualAvailabilityStartUtc
                : ScheduledAvailabilityStartUtc;
        channelNumber = ChannelNumber;
        stationID = StationId;
    } else if (upcomingSchedulesList && upcomingSchedulesList.length) {
        let sortedUpciomingByEarliest = upcomingSchedulesList.sort(
            (a, b) => new Date(a.StartUtc) - new Date(b.StartUtc)
        );
        if (sortedUpciomingByEarliest[0].ChannelNumber) {
            sortedUpciomingByEarliest = sortedUpciomingByEarliest.sort(
                (a, b) => new Date(b.ChannelNumber) - new Date(a.ChannelNumber)
            );
        } else if (sortedUpciomingByEarliest[0].Number) {
            sortedUpciomingByEarliest = sortedUpciomingByEarliest.sort(
                (a, b) => new Date(b.Number) - new Date(a.Number)
            );
        } else if (
            sortedUpciomingByEarliest[0].ChannelInfo &&
            sortedUpciomingByEarliest[0].ChannelInfo.Channel
        ) {
            sortedUpciomingByEarliest = sortedUpciomingByEarliest.sort(
                (a, b) =>
                    new Date(a.ChannelInfo.channel?.Number) -
                    new Date(a.ChannelInfo.channel?.Number)
            );
        }

        const latestSchedule = sortedUpciomingByEarliest[0];
        const {
            ChannelNumber: latestChannelNumber,
            StationId: latestStationId,
        } = latestSchedule;
        const firstScheduleOfSameChannelAndStationId = upcomingSchedulesList?.find(
            (schedule: any) =>
                schedule.ChannelNumber === latestChannelNumber &&
                schedule.StationId === latestStationId
        );
        if (firstScheduleOfSameChannelAndStationId) {
            startUTC =
                startUTC || firstScheduleOfSameChannelAndStationId.StartUtc;
        }
        stationID = stationID || latestStationId;
        channelNumber = channelNumber || latestChannelNumber;
    } else if (subscriberData["currentCatchupSchedule"]) {
        const {
            StartUtc: catchupStartUtc,
            StationId: catchupStationId,
            ChannelNumber: catchupChannelNumber,
        } = subscriberData["currentCatchupSchedule"];
        startUTC = startUTC || catchupStartUtc;
        stationID = stationID || catchupStationId;
        channelNumber = channelNumber || catchupChannelNumber;
    } else if (
        subscriberData &&
        subscriberData.hasUpcomingSchedules &&
        subscriberData.hasUpcomingSchedules.length > 0
    ) {
        const {
            StartUtc: upcomingStartUtc,
            StationId: upcomingStationId,
            ChannelNumber: upcomingChannelNumber,
        } = subscriberData.hasUpcomingSchedules[0];
        startUTC = startUTC || upcomingStartUtc;
        stationID = stationID || upcomingStationId;
        channelNumber = channelNumber || upcomingChannelNumber;
    }

    if (!channelNumber && stationID) {
        const currentChannel = channelMap.Channels?.find(
            (c) => c.StationId === stationID
        );
        channelNumber = currentChannel?.Number;
    }

    // if from EPG, correct channel number, stationid
    const {
        Schedule: { channelId: StationIdFromEPGSchedule = "" } = {},
        channel: { id: StationIdFromEPGChannel = "" } = {},
    } = subscriberData || {};
    const stationIdFromEPG =
        StationIdFromEPGSchedule || StationIdFromEPGChannel;
    if (subscriberData && stationIdFromEPG) {
        const epgChannel = channelMap.Channels?.find(
            (c) => c.StationId === stationIdFromEPG
        );
        channelNumber = epgChannel?.Number;
        stationID = stationIdFromEPG;
    }

    let dvrPlayActions = DvrButtonAction.None;
    let hasCloudDvr = false;
    if (account) {
        hasCloudDvr = account.DvrCapability === DvrCapabilityType.CLOUDDVR;
    }
    if (filteredEpisodePlayOptions) {
        const {
            episodeChannelNumber,
            episodeStartUtc,
            episodeStationId,
        } = filterUsablePlayActions;
        startUTC = episodeStartUtc || startUTC;
        channelNumber = episodeChannelNumber || channelNumber;
        stationID = episodeStationId || stationID;
    }

    if (
        hasCloudDvr &&
        programID &&
        programSchedulesData &&
        allSubcriptionGroups &&
        recorders &&
        recorders?.recorders &&
        recorders?.recorders?.length &&
        channelMap &&
        !isSeriesRecordingBlocked
    ) {
        dvrPlayActions = calculateProgramButtonAction(
            programID,
            startUTC,
            stationID,
            channelNumber,
            [],
            [],
            programSchedulesData,
            allSubcriptionGroups,
            viewableRecordings,
            scheduledSubscriptionGroup,
            recorders.recorders,
            hasCloudDvr,
            channelMap,
            firstCatchupSchedule?.EndUtc
        );
    }

    programUDPData["statusText"] = [];

    Schedule?.Entitlements &&
        Schedule?.Entitlements.length &&
        combinedEntitlements.push(...Schedule.Entitlements);

    combinedEntitlements = removeEntitlementsAbbreviationsAndSort(
        combinedEntitlements
    );
    programUDPData["combinedEntitlements"] = combinedEntitlements;

    programUDPData["isInHome"] = isInHome(combinedEntitlements, ipStatus);
    if (programUDPData["isInHome"] && combinedEntitlements) {
        combinedEntitlements = combinedEntitlements.filter(
            (entitle) => entitle !== pbr.RestrictionsType.OUTOFHOME_BLOCKED
        );
    }

    const pbrCheck: boolean = isPlayable(combinedEntitlements, account);

    // Status Text
    if (
        isRent &&
        purchaseActionsExists &&
        !isRentalPurchaseOrSubscribed &&
        hasFeatureIosCarrierBilling
    ) {
        const minPrice = Math.min(
            ...purchaseActions.map(
                (purchaseAction: any) => purchaseAction.Price
            )
        );
        const minPurchaseAction = purchaseActions.filter(
            (purchaseAction: any) => purchaseAction.Price === minPrice
        );
        programUDPData.statusText.push(
            replacePlaceHoldersInTemplatedString(
                AppStrings?.str_purchase_vod_message,
                {
                    Currency: minPurchaseAction[0]?.Currency,
                    Price: minPurchaseAction[0]?.Price,
                }
            )
        );
    }
    if (
        isRent &&
        purchaseActionsExists &&
        !isRentalPurchaseOrSubscribed &&
        !hasFeatureIosCarrierBilling
    ) {
        programUDPData.statusText.push(AppStrings?.str_purchase_blocked);
    }
    if (!isRentalPurchaseOrSubscribed && expirationUTC) {
        programUDPData["isExpiringSoon"] = isExpiringSoon(programUDPData);
        programUDPData.statusText.push(timeLeft(expirationUTC));
    } else {
        if (rentalWindowMassage !== "") {
            programUDPData.statusText.push(rentalWindowMassage);
        }
    }

    // Call to action buttons
    // Play Live, Resume, PlayVod, Play, Restart, Rent, Buy, RentBuy, Unsubscribe, Subscribe, WaysToWatch, Trailer, Favorite, Unfavorite, Upcoming, Episodes, Record, Packages, Downlaod
    subscriberData["playActionsExists"] = playActionsExists;
    subscriberData["purchaseActionsExists"] = purchaseActionsExists;
    subscriberData["purchasePackageExists"] = purchasePackageExists;
    subscriberData["PbrOverride"] = account?.PbrOverride;
    subscriberData["IsLive"] = discoveryData?.IsLive;

    programUDPData["ChannelInfo"] = subscriberData?.ChannelInfo;
    programUDPData["SourceIndicators"] = undefined;
    programUDPData["SourceType"] = SourceType.UNDEFINED;

    const [ctaButtonGroup, ppvInfo] = getCTAButtons(
        usablePlayActions,
        purchaseActions,
        subscriptionPackages,
        programUDPData,
        null,
        schedules,
        dvrPlayActions,
        false,
        subscriberData,
        playOptions,
        channelMap,
        account,
        null,
        playDvr,
        ipStatus,
        undefined,
        startDateFromEPG,
        endDateFromEPG,
        channeRights,
        isFromEPG,
        StationIdFromEPG,
        hasFeatureIosCarrierBilling
    );

    programUDPData["ctaButtons"] = ctaButtonGroup;
    programUDPData["ppvInfo"] = ppvInfo;

    //CatchupEndUtc time
    const catchupEndUtc =
        programUDPData?.currentCatchupSchedule?.CatchupEndUtc ||
        programUDPData?.currentCatchupSchedule?.Schedule?.CatchupEndUtc;
    if (!expirationUTC && catchupEndUtc) {
        programUDPData["statusText"].push(timeLeft(catchupEndUtc));
        programUDPData["isExpiringSoon"] = isExpiringSoon(programUDPData);
    }

    // Banned Purchase Text
    // if all the channels in schedules is not subscribed the text should be shown, or else no
    if (subscriberData?.IsLive) {
        if (playOptions?.Schedules?.length || playOptions?.CatchupSchedules) {
            isChannelNotSubscribed(playOptions, channelMap) &&
                !playActionsExists &&
                programUDPData.statusText.push(
                    AppStrings?.str_subscription_required
                );
        } else {
            subscriberData?.channel &&
                !subscriberData?.channel?.isSubscribed &&
                !playActionsExists &&
                programUDPData.statusText.push(
                    AppStrings?.str_subscription_required
                );
        }
    } else if (purchaseActionsExists && subscriptionPackages?.length) {
        if (playOptions?.Schedules?.length || playOptions?.CatchupSchedules) {
            isChannelNotSubscribed(playOptions, channelMap) &&
                !playActionsExists &&
                programUDPData.statusText.push(
                    AppStrings?.str_subscription_required
                );
        } else {
            !playActionsExists &&
                programUDPData.statusText.push(
                    AppStrings?.str_subscription_required
                );
        }
    }

    if (programUDPData?.ChannelInfo?.Schedule) {
        if (!combinedEntitlements) {
            combinedEntitlements = [];
        }
        programUDPData.ChannelInfo.Schedule.Entitlements &&
            combinedEntitlements.push(
                ...programUDPData.ChannelInfo.Schedule.Entitlements
            );
        combinedEntitlements = removeEntitlementsAbbreviationsAndSort(
            combinedEntitlements
        );
        programUDPData["combinedEntitlements"] = combinedEntitlements;

        programUDPData["isInHome"] = isInHome(combinedEntitlements, ipStatus);
        if (programUDPData["isInHome"] && combinedEntitlements) {
            combinedEntitlements = combinedEntitlements.filter(
                (entitle: string) =>
                    entitle !== pbr.RestrictionsType.OUTOFHOME_BLOCKED
            );
        }
    }

    // Status Text Order: Banned Purchase Text, Watched Text, Playback restricts
    const { OUTOFHOME_BLOCKED, OH } = pbr.RestrictionsType;
    if (combinedEntitlements && combinedEntitlements.length) {
        for (let entitlement of combinedEntitlements) {
            if ([OUTOFHOME_BLOCKED, OH].includes(entitlement)) {
                if (!programUDPData["isInHome"]) {
                    programUDPData.statusText.push(
                        getRestrictionsText(entitlement)
                    );
                }
            } else {
                const restrictionText = getRestrictionsText(entitlement);
                restrictionText &&
                    programUDPData.statusText.push(restrictionText);
            }
        }
    }

    programUDPData["isPlayable"] =
        pbrCheck && programUDPData.ctaButtons.length > 0;
    programUDPData["usablePlayActions"] = usablePlayActions;
    programUDPData["purchaseActions"] = purchaseActions;
    programUDPData["purchasePackageActions"] = purchasePackageActions;
    programUDPData["subscriptionPackages"] = subscriptionPackages;
    programUDPData["image16x9PosterURL"] =
        subscriberData?.image16x9PosterURL || discoveryData?.image16x9PosterURL;
    programUDPData["image16x9KeyArtURL"] =
        subscriberData?.image16x9KeyArtURL || discoveryData?.image16x9KeyArtURL;
    programUDPData["image2x3PosterURL"] =
        subscriberData?.image2x3PosterURL || discoveryData?.image2x3PosterURL;
    programUDPData["image2x3KeyArtURL"] =
        subscriberData?.image2x3KeyArtURL || discoveryData?.image2x3KeyArtURL;
    programUDPData["assetType"] =
        ((subscriberData?.assetType?.itemType ||
            subscriberData?.assetType?.sourceType) &&
            subscriberData?.assetType) ||
        generateType(discoveryData, programUDPData.SourceType);

    programUDPData["ReleaseYear"] =
        subscriberData?.ReleaseYear ||
        subscriberData?.CatalogInfo?.ReleaseYear ||
        subscriberData?.Schedule?.year ||
        "";

    let RuntimeSeconds: string | undefined;
    if (
        programUDPData?.ChannelInfo?.Schedule ||
        programUDPData?.ppvInfo?.currentSelectedSchedule
    ) {
        const { StartUtc, EndUtc } =
            programUDPData?.ChannelInfo?.Schedule ||
            programUDPData?.ppvInfo?.currentSelectedSchedule;
        const startEpoc = Date.parse(StartUtc);
        const endEpoc = Date.parse(EndUtc);

        if (startEpoc && endEpoc) {
            RuntimeSeconds = ((endEpoc - startEpoc) / 1000).toFixed(1);
        }
    }
    if (vods) {
        programUDPData["durationMinutesString"] =
            subscriberData?.durationMinutesString ||
            durationInHoursMinutes(vods[0]?.CatalogInfo) ||
            (RuntimeSeconds && durationInHoursMinutes({ RuntimeSeconds })) ||
            "";
    }
    programUDPData["Rating"] =
        subscriberData?.Rating || chooseRating(vodCatalogInfo?.Ratings) || "";
    programUDPData["locale"] =
        subscriberData?.CatalogInfo?.Locale || vodCatalogInfo?.Locale || "";
    programUDPData["title"] =
        subscriberData?.CatalogInfo?.Name || discoveryData?.Name || "";
    programUDPData["Bookmark"] =
        playOptions?.Bookmark || subscriberData?.Bookmark;

    programUDPData["genre"] = discoveryData?.Genres?.length
        ? discoveryData?.Genres
        : [];
    programUDPData["description"] =
        subscriberData?.CatalogInfo?.Description ||
        discoveryData?.Description ||
        "";
    programUDPData["ratingValues"] =
        (discoveryData?.ContentRatings &&
            discoveryData?.ContentRatings[0]?.RatingValues) ||
        [];

    const channelQuality =
        programUDPData.ChannelInfo?.Service?.QualityLevel ||
        programUDPData.ChannelInfo?.service?.QualityLevel ||
        (subscriberData?.Schedule?.Tags &&
            subscriberData?.Schedule?.Tags.length &&
            subscriberData?.Schedule?.Tags[0]) ||
        programUDPData?.ppvInfo?.currentSelectedSchedule?.Service
            ?.QualityLevel ||
        programUDPData?.ppvInfo?.currentSelectedSchedule?.Tags[1];
    channelQuality && combinedQualityLevels.push(channelQuality);

    combinedQualityLevels = generalizeQuality(combinedQualityLevels);

    // Remove duplicates and Sort Quality Levels with order
    programUDPData["combinedQualityLevels"] = sortInorder(
        combinedQualityLevels,
        orderedQualityLevels
    );

    if (programUDPData?.ChannelInfo?.Channel) {
        const { Channel } = programUDPData?.ChannelInfo;
        programUDPData.ChannelInfo.Channel["name"] =
            getChannelName(Channel) || subscriberData?.Schedule?.channelName;
        programUDPData.ChannelInfo.Channel["logoUri"] = Channel?.LogoUri && {
            uri: Channel?.LogoUri,
        };
    }
    // Remove duplicates and Sort Audio Tags
    programUDPData["combinedAudioTags"] = sortInorder(
        processedSchedules?.combinedAudioTags ||
        programUDPData.ChannelInfo?.Schedule?.AudioTags,
        null
    );

    programUDPData["statusText"] = filterStatusList(
        programUDPData["statusText"],
        programUDPData["ctaButtons"]
    );

    //Priority for subscription require
    let index = programUDPData["statusText"].indexOf(
        AppStrings?.str_subscription_required
    );
    if (index !== -1 && !programUDPData?.ppvInfo?.hasPPV && !isRent) {
        programUDPData["statusText"].splice(index, 1);
        programUDPData["statusText"].unshift(
            AppStrings?.str_subscription_required
        );
    }

    if (
        !programUDPData?.ChannelInfo &&
        subscriberData?.playSource === sourceTypeString.UPCOMING &&
        subscriberData?.Schedule
    ) {
        programUDPData["ChannelInfo"] = { Schedule: subscriberData.Schedule };
    }

    return programUDPData;
};

export const massageSeasonPlayOptionData = (
    seasonPlayOptions: any,
    channelMap: LiveChannelMap,
    stationId: string,
    allSubscriptionGrp: any,
    account: any,
    networkIHD: any
): any => {
    seasonPlayOptions?.Episodes.map((episode: any, index: number) => {
        massageEpisodePlayOption(
            episode,
            channelMap,
            stationId,
            allSubscriptionGrp,
            index,
            account,
            networkIHD
        );
    });
    return seasonPlayOptions;
};

export const massageEpisodePlayOption = (
    episode: any,
    channelMap?: LiveChannelMap,
    stationId?: string,
    allSubscriptionGrp?: any,
    index?: number,
    account?: any,
    networkIHD?: any
) => {
    let metadata = "";
    let channelStationId = "";
    let catchup;
    let episodeStartUtc;
    let episodeEndUtc;
    let episodeChannelNumber;
    let episodeStationId;

    for (let i = episode?.Catchups?.length - 1; i >= 0; i--) {
        if (episode?.Catchups[i]?.StationId === stationId) {
            catchup = episode?.Catchups[i];
            break;
        }
    }

    let ipStatus = account?.ClientIpStatus || {};
    if (!config.inhomeDetection.useSubscriberInHome) {
        // networkIHD data
        const inHomeValue =
            networkIHD?.status === "inHome" ||
            config.inhomeDetection.inHomeDefault;
        ipStatus["InHome"] = inHomeValue
            ? RestrictionValue.Yes
            : RestrictionValue.No;
    }

    if (!catchup) {
        catchup =
            episode?.Catchups?.length &&
            episode?.Catchups[episode?.Catchups?.length - 1];
    }

    if (episode?.Schedules?.length) {
        let waystoWatchSchedulesObj: any = {
            restart: [],
            watchLive: [],
            upcoming: [],
        };
        let runtimeSeconds;
        let timeSeconds;

        if (channelMap) {
            waystoWatchSchedulesObj = waystoWatchSchedules(
                episode?.Schedules || [],
                channelMap,
                catchup,
                null,
                null,
                account,
                ipStatus
            );
        }

        if (waystoWatchSchedulesObj?.watchLive?.length) {
            const schedule = waystoWatchSchedulesObj.watchLive[0];
            const startEpoc = Date.parse(schedule?.StartUtc);
            const endEpoc = Date.parse(schedule.endUtc || schedule.EndUtc);

            runtimeSeconds = endEpoc - startEpoc;
            timeSeconds = new Date().getTime() - startEpoc;

            metadata =
                schedule?.StartUtc &&
                schedule?.EndUtc &&
                `${AppStrings?.str_dates.str_today
                }${metadataSeparator}${DateToAMPM(
                    new Date(schedule?.StartUtc)
                )} - ${DateToAMPM(new Date(schedule?.EndUtc))}`;

            channelStationId = schedule?.StationId;
            episodeStartUtc = schedule?.StartUtc;
            episodeEndUtc = schedule?.EndUtc;
            episodeStationId = channelStationId;
        } else if (waystoWatchSchedulesObj?.upcoming?.length && !catchup) {
            let schedule: any;
            for (const upcoming of waystoWatchSchedulesObj.upcoming) {
                if (upcoming?.StationId === stationId) {
                    schedule = upcoming;
                    break;
                }
            }
            channelStationId = schedule?.StationId;

            metadata =
                schedule?.StartUtc &&
                schedule?.EndUtc &&
                `${getDateFormat(
                    new Date(schedule?.StartUtc)
                )}${metadataSeparator}${DateToAMPM(
                    new Date(schedule?.StartUtc)
                )} - ${DateToAMPM(new Date(schedule?.EndUtc))}`;

            episodeStartUtc = schedule?.StartUtc;
            episodeEndUtc = schedule?.EndUtc;
            episodeStationId = channelStationId;
        }

        if (!episode?.Bookmark) {
            episode["Bookmark"] = {
                RuntimeSeconds: runtimeSeconds,
                TimeSeconds: timeSeconds,
            };
        }
    }
    if (catchup) {
        channelStationId = catchup?.StationId;
        metadata =
            catchup?.StartUtc &&
            catchup?.EndUtc &&
            `${getDateFormat(
                new Date(catchup?.StartUtc)
            )}${metadataSeparator}${DateToAMPM(
                new Date(catchup?.StartUtc)
            )} - ${DateToAMPM(new Date(catchup?.EndUtc))}`;
        episodeStartUtc = catchup?.StartUtc;
        episodeEndUtc = catchup?.EndUtc;
        episodeStationId = channelStationId;
    }

    episode["episodeInfo"] = getEpisodeInfo(episode?.CatalogInfo);

    const { channel }: any = channelMap?.findChannelByStationId(
        channelStationId
    ) || { channel: undefined };

    episodeChannelNumber = channel?.Number;

    episode["metadata"] = channel
        ? `${channel?.Number} ${channel?.CallLetters}${metadataSeparator}${metadata}`
        : metadata;

    if (!metadata) {
        const metadataList: string[] = [];

        if (
            episode?.CatalogInfo?.RuntimeSeconds &&
            episode?.CatalogInfo?.RuntimeSeconds > 0
        ) {
            metadataList.push(
                durationInDaysHoursMinutes(episode?.CatalogInfo?.RuntimeSeconds)
            );
        }

        if (chooseRating(episode?.CatalogInfo?.Ratings)) {
            metadataList.push(chooseRating(episode?.CatalogInfo?.Ratings));
        }

        if (episode?.CatalogInfo?.OriginalAirDate) {
            metadataList.push(
                getDateFormat(new Date(episode?.CatalogInfo?.OriginalAirDate))
            );
        } else if (episode?.CatalogInfo?.ReleaseDate) {
            metadataList.push(
                getDateFormat(new Date(episode?.CatalogInfo?.ReleaseDate))
            );
        } else if (episode?.CatalogInfo?.ReleaseYear) {
            metadataList.push(episode?.CatalogInfo?.ReleaseYear);
        }

        episode["metadata"] = metadataList?.join(metadataSeparator);
    }

    episode["networkInfo"] = getNetworkInfo(episode);

    episode["channelLogoUri"] = channel?.LogoUri
        ? { uri: channel?.LogoUri }
        : undefined;
    if (allSubscriptionGrp && allSubscriptionGrp?.SubscriptionGroups) {
        for (const subscriptiongroup of allSubscriptionGrp?.SubscriptionGroups) {
            if (
                subscriptiongroup.SeriesId === episode?.CatalogInfo?.SeriesId &&
                subscriptiongroup.SubscriptionItems.length > 0
            ) {
                subscriptiongroup.SubscriptionItems.map((item: any) => {
                    if (episode.ProgramId === item.ProgramId) {
                        const itemState: string = item.ItemState;
                        episode["dvrItemsState"] = itemState.toUpperCase();
                        episode["ContentExpiryUtc"] = item.ContentExpiryUtc;
                        episode["ItemState"] = item.ItemState;
                    }
                });
            }
        }
    }

    episode["episodeStartUtc"] = episodeStartUtc;
    episode["episodeEndUtc"] = episodeEndUtc;
    episode["episodeStationId"] = episodeStationId;
    episode["episodeChannelNumber"] = episodeChannelNumber;
    episode["index"] = index;

    const vods = episode?.Vods;

    let usablePlayActions: any = [];
    let purchaseActions: any = [];

    let isVod;
    vods?.length > 0 &&
        vods.map((vod: any) => {
            // Play Actions
            vod.PlayActions?.length > 0 &&
                vod.PlayActions.map((playAction: any) => {
                    isVod = true;

                    // Usable play actions
                    if (filterUsablePlayActions(playAction)) {
                        playAction["Tags"] = vod?.CatalogInfo?.Tags;
                        playAction["Bookmark"] = vod?.Bookmark;
                        playAction["CatalogInfo"] = vod?.CatalogInfo;
                        usablePlayActions.push(playAction);
                    }
                });
        });

    episode["usablePlayActions"] = usablePlayActions;
    episode["purchaseActions"] = purchaseActions;
    episode["title"] =
        episode?.CatalogInfo?.EpisodeName || episode?.CatalogInfo?.Name;
    episode["IsVOD"] = isVod;
    episode["image16x9PosterURL"] = getImageUri(
        episode?.CatalogInfo,
        "16x9/Poster"
    );
    episode["image16x9KeyArtURL"] = getImageUri(
        episode?.CatalogInfo,
        "16x9/KeyArt"
    );
    episode["image2x3PosterURL"] = getImageUri(
        episode?.CatalogInfo,
        "2x3/Poster"
    );
    episode["image2x3KeyArtURL"] = getImageUri(
        episode?.CatalogInfo,
        "2x3/KeyArt"
    );
    episode["assetType"] = generateType(vods[0], isVod && SourceType.VOD);
    return episode;
};

// Rename ReachUHD, ReachHD, ReachSD to UHD, HD, SD respectively
export const generalizeQuality = (sortedQualityLevels: any) => {
    return sortedQualityLevels?.map((qLevel: string) => {
        return qLevel in generalizeQualityLevels
            ? (qLevel = (generalizeQualityLevels as any)[qLevel])
            : qLevel;
    });
};



export const filterUsablePlayActions = (action: any): boolean => {
    return (
        action.VideoProfile &&
        (config.playerConfig.supportedEncodings as any)[
        action.VideoProfile.Encoding
        ] &&
        action.VideoProfile.Encoding in encodings &&
        action.VideoProfile.QualityLevel in orderedQualityLevels
    );
};

export const filterUsablePurchaseActions = (action: any): boolean => {
    return (
        action.VideoProfiles &&
        (config.playerConfig.supportedEncodings as any)[
        action.VideoProfiles.map((videoProfile: any) => {
            return videoProfile.Encoding;
        })
        ] &&
        action.VideoProfiles.map((videoProfile: any) => {
            return videoProfile.Encoding in encodings;
        }) &&
        action.VideoProfiles.map((videoProfile: any) => {
            return videoProfile.QualityLevel in orderedQualityLevels;
        })
    );
};

export const sortInorder = (gArray: string[], order?: any) => {
    if (!gArray?.length) {
        return;
    }

    if (!order) {
        return [...new Set(gArray)];
    }

    // Place elements in the order. This might have empty elements .
    let sortedArray: any = [];
    [...new Set(gArray)].map((element: any) => {
        const position = order[element];
        if (!sortedArray[position]) {
            sortedArray[position] = element;
        }
    });

    // Remove empty elements before returning
    return sortedArray.filter((n: any) => n);
};


export const format = (str: string, ...obj: string[]) => {
    if (!str) {
        return "";
    }

    for (let index = 0; index < obj.length; index++) {
        str = str.replace(`{${index}}`, obj[index]);
    }
    return str;
};

const getCurrentSchedules = (schedules: any[], dateFromEPG: any) => {
    const now = new Date(dateFromEPG ? new Date(dateFromEPG) : Date.now());
    return schedules.filter(
        (schedule: any) =>
            now >= new Date(schedule.StartUtc) &&
            now <= new Date(schedule.EndUtc)
    );
};

const getFutureSchedules = (schedules: any[], startDate?: any) => {
    const now = new Date(Date.now());
    if (startDate) {
        return schedules.filter(
            (schedule: any) => new Date(schedule.StartUtc) >= startDate
        );
    } else {
        return schedules.filter(
            (schedule: any) => new Date(schedule.StartUtc) >= now
        );
    }
};

const getSchedulesWithPPVChannels = (
    schedules: any,
    channelMap: any,
    channelRights: any
) => {
    schedules.forEach((schedule: any) => {
        const { ChannelNumber = -1 } = schedule || {};
        const ch = channelMap.findChannelByNumber(ChannelNumber);
        const service = ch && channelMap.getService(ch?.channel);

        const rights = channelRights?.channels[ChannelNumber];
        const now = new Date(Date.now());
        const hasLiveRights =
            rights &&
            some(rights, (s) => !!s.s && !!s.e && new Date(s.e) >= now);
        const serviceCollectionId = ch?.channel?.ServiceCollectionId;
        const serviceItms = channelMap.ServiceCollections.find(
            (s: any) => s.Id === serviceCollectionId
        );

        if (ch.channel) {
            schedule["Channel"] = ch.channel;
            let hasPPV = false;
            for (let j = 0; j < serviceItms?.ServiceItems?.length || 0; j++) {
                const serviceItem = serviceItms.ServiceItems[j];
                if (
                    !ch.channel.IsApplication &&
                    serviceItem.ServiceGrouping === 1
                ) {
                    if (hasLiveRights) {
                        hasPPV = true;
                    }
                }
            }
            if (hasPPV) {
                schedule["Channel"].hasPPV = !!hasPPV;
            }
        }
        if (service) {
            schedule["Service"] = service;
        }
    });

    return schedules.filter(
        (schedule: any) =>
            schedule && schedule.Channel && schedule.Channel?.hasPPV
    );
};

const createPPVMsg = (
    mins: number,
    replacements: any,
    templateString0: string,
    templateString1: string,
    templateString2: string,
    templateString3: string,
    templateString4: string,
    templateString5: string,
    templateString6: string,
    templateString7: string,
    templateString8: string
) => {
    let StatusMessage = "";
    if (replacements["Price"] === 0) {
        if (replacements["Mins"] < 200) {
            StatusMessage = replacePlaceHoldersInTemplatedString(
                templateString3,
                replacements
            );
        } else {
            replacements.hours = Math.floor(mins / 60);
            if (replacements.hours < 1) {
                StatusMessage = replacePlaceHoldersInTemplatedString(
                    templateString3,
                    replacements
                );
            } else if (replacements.hours > 1) {
                replacements.days = Math.floor(replacements.hours / 24);
                if (replacements.days > 1) {
                    StatusMessage = replacePlaceHoldersInTemplatedString(
                        templateString5,
                        replacements
                    );
                } else {
                    StatusMessage = replacePlaceHoldersInTemplatedString(
                        templateString4,
                        replacements
                    );
                }
            }
        }
    } else if (replacements["Mins"] < 200) {
        StatusMessage = replacePlaceHoldersInTemplatedString(
            templateString0,
            replacements
        );
    } else {
        replacements.hours = Math.floor(mins / 60);
        if (replacements.hours < 1) {
            StatusMessage = replacePlaceHoldersInTemplatedString(
                templateString1,
                replacements
            );
        } else if (replacements.hours > 1) {
            replacements.days = Math.floor(replacements.hours / 24);
            if (replacements.days > 1) {
                StatusMessage = replacePlaceHoldersInTemplatedString(
                    templateString7,
                    replacements
                );
            } else {
                StatusMessage = replacePlaceHoldersInTemplatedString(
                    templateString2,
                    replacements
                );
            }
        }
    }
    return StatusMessage;
};

const isPPVRightInRange = (
    right: any,
    dNow: number
): { startsIn?: number; endsIn?: number } | null => {
    if (right && right.isPPV && right.s && right.e) {
        if (dNow > right.e) {
            // this PPV offer is in the past
            return null;
        } else if (dNow < right.s) {
            // purchased PPV on this channel scheduled in the future
            // need to tune to the PPV stream at start time
            return { startsIn: right.s };
        } else if (dNow >= right.s && dNow < right.e) {
            // schedule to tune back to Preview stream
            return { endsIn: right.e };
        }
    }
    return null;
};

const getPPVServiceId = (
    channel: IChannel,
    channelRights: any,
    channelMap: any
): string => {
    const serviceId: string = channel?.ServiceCollectionId;
    const lr = channelRights?.channels[channel?.Number];
    if (channel?.hasPPV && lr) {
        const ppvQualities = [];
        for (const r of lr) {
            const s = isPPVRightInRange(r, Date.now());
            if (s && s.endsIn) {
                ppvQualities.push(r.q || "");
            }
        }
        if (ppvQualities.length > 0) {
            const validIds = Object.keys(channelMap.ServiceMap);
            // Commented for React
            // ppvQualities = sortQualityLevels(ppvQualities);
            for (const q of ppvQualities) {
                const qid = serviceId + "_ppv_" + q;
                if (validIds.indexOf(qid) >= 0) {
                    return qid;
                }
            }
            console.error("ppv quality service not present");
        }
    }

    return serviceId;
};

// don't cache this, it may depend on live rights which depend on current time
export const getRefreshedService = (
    channel: IChannel,
    channelMap: any,
    channelRights: any
): any => {
    let ch;
    if (typeof channel === "object") {
        ch = channelMap.findChannelByNumber(channel.Number);
    } else if (typeof channel === "number" || typeof channel === "string") {
        ch = channelMap.findChannelByNumber(channel);
    }
    const serviceMap = channelMap.ServiceMap;
    const service =
        ch &&
        serviceMap &&
        serviceMap[getPPVServiceId(ch?.channel, channelRights, channelMap)];
    if (service && ch?.channel?.ServiceCollectionId && service.DataSource) {
        service.DataSource.appToken = ch?.channel?.ServiceCollectionId;
    }
    return service;
};

export const getPPVService = (
    chanelNumber: number,
    channelMap: any,
    channelRights: any
) => {
    const ch = channelMap.findChannelByNumber(chanelNumber);
    const service = getRefreshedService(ch?.channel, channelMap, channelRights);
    if (service?.Type === "HlsPlayback") {
        return service;
    }
    return undefined;
};

export const getPPVInfo = (
    programPlayOption: any,
    channelMap: any,
    isLive: boolean,
    channelRights?: any,
    startDateFromEPG?: any,
    endDateFromEPG?: any,
    isFromPurchase?: boolean,
    assetType?: any,
    StationIdFromEPG?: any,
    isFromEPG?: boolean,
    ipStatus?: any
) => {
    let hasPPV = false;
    let isPPVWatchable = false;
    let isPPVPreviwable = false;
    let isPPVRecordable = false;
    let StatusMessage = undefined;
    let Entitlement = undefined;
    let LiveRight = [];
    let liveRightWithDate = [];
    let currentSelectedSchedule = undefined;
    let isFree = false;
    let isExpired = false;
    let isPurchased = false;
    let isinHome = false;
    let services;

    const { Schedules = [], ChannelActions = [] } = programPlayOption || {};
    const purchased = Object.keys(ChannelActions).length
        ? ChannelActions[Schedules[0]?.ChannelNumber]?.IsPurchased
        : false;
    const currentSchedules = getCurrentSchedules(Schedules, startDateFromEPG);
    const schedulesWithPPV = getSchedulesWithPPVChannels(
        currentSchedules,
        channelMap,
        channelRights
    );
    const dateNow = new Date(Date.now());
    if (!startDateFromEPG && schedulesWithPPV && schedulesWithPPV.length) {
        startDateFromEPG = new Date(schedulesWithPPV[0].StartUtc);
    }
    if (
        startDateFromEPG < dateNow &&
        schedulesWithPPV &&
        schedulesWithPPV.length &&
        (isFromPurchase ? assetType === "LIVE" : true)
    ) {
        hasPPV = true;
        currentSelectedSchedule = isFromEPG
            ? schedulesWithPPV?.find(
                (schedulesWithPPV: any) =>
                    schedulesWithPPV.StationId === StationIdFromEPG
            )
            : schedulesWithPPV[0];
        const {
            Rented,
            PurchaseActions,
            Service,
            Channel,
            Entitlements,
            Channel: { LiveRights = [] },
        } = currentSelectedSchedule;
        if (channelRights) {
            services = getRefreshedService(
                currentSelectedSchedule?.ChannelNumber,
                channelMap,
                channelRights
            );
        } else {
            services = getPPVService(
                currentSelectedSchedule?.ChannelNumber,
                channelMap,
                channelRights
            );
        }

        Entitlement = Entitlements;
        LiveRight = LiveRights || [];
        if (!Rented && PurchaseActions) {
            if (Service) {
                isPPVPreviwable = true;
                if (services) {
                    console.log(
                        "*************** PPV Service ****************",
                        services
                    );
                    currentSelectedSchedule.Service = services;
                }
            }
            const [PurchaseAction] = PurchaseActions;
            const { Price, ExpirationUtc, ScheduleStartUtc } =
                PurchaseAction || {};
            const now = new Date(Date.now());
            const expiration = new Date(ExpirationUtc);
            const startUtc = new Date(ScheduleStartUtc);
            if (now < expiration) {
                const mins = Math.floor((expiration - now) / 1000 / 60);
                if (Price > 0) {
                    const replacements = {
                        Price: Price,
                        Mins: mins,
                    };
                    StatusMessage = createPPVMsg(
                        mins,
                        replacements,
                        AppStrings?.str_ppv_message_1,
                        AppStrings?.str_ppv_message_2,
                        AppStrings?.str_ppv_message_5,
                        AppStrings?.str_ppv_message_6,
                        AppStrings?.str_ppv_message_7,
                        AppStrings?.str_ppv_message_8,
                        AppStrings?.str_ppv_message_9,
                        AppStrings?.str_ppv_message_10,
                        AppStrings?.str_ppv_message_11
                    );
                } else {
                    isFree = true;
                    const replacements = {
                        Price: Price,
                        Mins: mins,
                    };
                    StatusMessage = createPPVMsg(
                        mins,
                        replacements,
                        AppStrings?.str_ppv_message_1,
                        AppStrings?.str_ppv_message_2,
                        AppStrings?.str_ppv_message_5,
                        AppStrings?.str_ppv_message_6,
                        AppStrings?.str_ppv_message_7,
                        AppStrings?.str_ppv_message_8,
                        AppStrings?.str_ppv_message_9,
                        AppStrings?.str_ppv_message_10,
                        AppStrings?.str_ppv_message_11
                    );
                    if (now > startUtc) {
                        isPPVPreviwable = false;
                        isPPVWatchable = true;
                    }
                    isPPVRecordable = true;
                    if (services) {
                        currentSelectedSchedule.Service = services;
                    }
                }
            } else {
                isExpired = true;
                StatusMessage = AppStrings?.str_ppv_message_3;
            }
        } else if (Service) {
            isPurchased = true;
            isPPVWatchable = true;
            isPPVPreviwable = false;
            isPurchased = true;
            isPPVRecordable = true;
            StatusMessage = AppStrings?.str_ppv_message_4;
            if (services) {
                currentSelectedSchedule.Service = services;
            }
        } else {
            isExpired = true;
            StatusMessage = AppStrings?.str_ppv_message_3;
        }
        liveRightWithDate = LiveRight.map((lr: any) => {
            if (lr.s && lr.e) {
                return {
                    ...lr,
                    s: new Date(lr.s),
                    e: new Date(lr.e),
                };
            } else return lr;
        });
    } else if (Schedules && Schedules.length) {
        const futreSchedules = getFutureSchedules(Schedules, startDateFromEPG);
        const futureSchedulesWithPPV = getSchedulesWithPPVChannels(
            futreSchedules,
            channelMap,
            channelRights
        );
        if (futureSchedulesWithPPV && futureSchedulesWithPPV.length) {
            hasPPV = true;
            currentSelectedSchedule = isFromEPG
                ? futureSchedulesWithPPV?.find(
                    (futureScheduleWithPPV: any) =>
                        futureScheduleWithPPV.StationId === StationIdFromEPG
                )
                : futureSchedulesWithPPV[0];
            if (channelRights) {
                services = getRefreshedService(
                    currentSelectedSchedule?.ChannelNumber,
                    channelMap,
                    channelRights
                );
            } else {
                services = getPPVService(
                    currentSelectedSchedule?.ChannelNumber,
                    channelMap,
                    channelRights
                );
            }
            isPPVWatchable = false;
            const {
                Rented,
                Service,
                Channel,
                Entitlements,
                Channel: { LiveRights = [] },
            } = currentSelectedSchedule;
            Entitlement = Entitlements;
            LiveRight = LiveRights;
            if (Rented || (isFromPurchase && purchased)) {
                isPurchased = true;
                isPPVPreviwable = true;
                isPPVRecordable = true;
                StatusMessage = AppStrings?.str_ppv_message_4;
                if (services) {
                    console.log(
                        "*************** PPV Service ****************",
                        services
                    );
                    currentSelectedSchedule.Service = services;
                }
            } else {
                const { PurchaseActions } = futureSchedulesWithPPV[0];
                isPurchased = false;
                isPPVPreviwable = true;
                if (services) {
                    currentSelectedSchedule.Service = services;
                }
                const [PurchaseAction] = PurchaseActions || [{}];
                const { Price, ExpirationUtc } = PurchaseAction || {};
                const now = new Date(Date.now());
                const expiration = new Date(ExpirationUtc);
                if (now < expiration) {
                    const mins = Math.floor((expiration - now) / 1000 / 60);
                    if (Price > 0) {
                        const replacements = {
                            Price: Price,
                            Mins: mins,
                        };
                        StatusMessage = createPPVMsg(
                            mins,
                            replacements,
                            AppStrings?.str_ppv_message_1,
                            AppStrings?.str_ppv_message_2,
                            AppStrings?.str_ppv_message_5,
                            AppStrings?.str_ppv_message_6,
                            AppStrings?.str_ppv_message_7,
                            AppStrings?.str_ppv_message_8,
                            AppStrings?.str_ppv_message_9,
                            AppStrings?.str_ppv_message_10,
                            AppStrings?.str_ppv_message_11
                        );
                    } else {
                        isFree = true;
                        const replacements = {
                            Price: Price,
                            Mins: mins,
                        };
                        StatusMessage = createPPVMsg(
                            mins,
                            replacements,
                            AppStrings?.str_ppv_message_1,
                            AppStrings?.str_ppv_message_2,
                            AppStrings?.str_ppv_message_5,
                            AppStrings?.str_ppv_message_6,
                            AppStrings?.str_ppv_message_7,
                            AppStrings?.str_ppv_message_8,
                            AppStrings?.str_ppv_message_9,
                            AppStrings?.str_ppv_message_10,
                            AppStrings?.str_ppv_message_11
                        );
                        isPPVRecordable = true;
                    }
                }
            }
        }
        liveRightWithDate = LiveRight.map((lr: any) => {
            if (lr.s && lr.e) {
                return {
                    ...lr,
                    s: new Date(lr.s),
                    e: new Date(lr.e),
                };
            } else return lr;
        });
    }
    isinHome = isInHome(Entitlement, ipStatus);
    if (isinHome && Entitlement) {
        Entitlement = Entitlement.filter(
            (entitle: string) =>
                entitle !== pbr.RestrictionsType.OUTOFHOME_BLOCKED
        );
    }

    return {
        hasPPV,
        isPPVWatchable,
        isPPVPreviwable,
        isPPVRecordable,
        StatusMessage,
        Entitlement,
        LiveRight,
        liveRightWithDate,
        currentSelectedSchedule,
        isFree,
        isPurchased,
        isExpired,
        isinHome,
    };
};

export const getCTAButtons = (
    playActions?: any,
    purchaseActions?: any,
    subscriptions?: any,
    programUDPData?: any,
    seriesUDPData?: any,
    schedules?: any,
    dvrPlayActions?: DvrButtonActionType | undefined,
    isFromSeries?: boolean,
    programSubscriberData?: any,
    programPlayOptions?: any,
    channelMap?: any,
    account?: any,
    seriesSubscriberData?: any,
    playDvr?: boolean,
    ipStatus?: any,
    seriesData?: any,
    startDateFromEPG?: any,
    endDateFromEPG?: any,
    channelRights?: any,
    isFromEPG?: boolean,
    StationIdFromEPG?: any,
    hasFeatureIosCarrierBilling?: boolean
): any => {
    console.log("Reading AppStrings", AppStrings?.str_details_cta_more_info);
    const { episodes, assetType } = seriesUDPData || {};
    const isLive = isFromSeries
        ? seriesData?.assetType?.sourceType === sourceTypeString.LIVE
        : programSubscriberData?.assetType?.sourceType ===
        sourceTypeString.LIVE ||
        (playActions?.length &&
            playActions[0].assetType?.sourceType === sourceTypeString.LIVE) ||
        programSubscriberData?.IsLive ||
        false;

    const ctaButtonGroup = [];
    const sourceIndicators: { [key: string]: boolean } = {};
    let sourceType = SourceType.UNDEFINED;
    let playExists = false;

    const ppvInfo = programPlayOptions
        ? getPPVInfo(
            programPlayOptions,
            channelMap,
            isLive,
            channelRights,
            startDateFromEPG,
            endDateFromEPG,
            programSubscriberData?.libraryId === "Library",
            programSubscriberData?.assetType?.sourceType,
            StationIdFromEPG,
            isFromEPG,
            ipStatus
        )
        : {
            hasPPV: false,
            isPPVWatchable: false,
            isPPVPreviwable: false,
            isPPVRecordable: false,
            StatusMessage: "",
            Entitlement: [],
            LiveRight: [],
            isLive,
        };

    // PPV Trailer Buttonn
    if (ppvInfo.hasPPV && ppvInfo.isPPVPreviwable) {
        ctaButtonGroup.push({
            buttonType: "TextIcon",
            buttonText: AppStrings?.str_details_cta_trailer,
            buttonAction: AppStrings?.str_details_cta_trailer,
            iconSource: trailerIcon,
        });
    }

    if (ppvInfo.hasPPV && ppvInfo.isPPVWatchable) {
        if (!sourceType) {
            sourceType = SourceType.LIVE;
        }
        sourceIndicators["IsLive"] = true;
    }

    if (
        (programSubscriberData?.assetType?.sourceType ===
            sourceTypeString.VOD &&
            (playActions?.length > 0 ||
                programSubscriberData?.purchaseActionsExists)) ||
        seriesUDPData?.IsVOD
    ) {
        sourceIndicators["IsVOD"] = true;
    }

    // WatchLive CTA Button Logic
    if (isLive) {
        const schedule = isFromSeries
            ? seriesData?.Schedule
            : programSubscriberData?.Schedule ||
            (playActions?.length && playActions[0].Schedule);
        const channel = isFromSeries
            ? seriesData.ChannelInfo?.channel
            : programSubscriberData?.ChannelInfo?.channel ||
            (playActions?.length && playActions[0].ChannelInfo?.channel) ||
            (schedule &&
                findChannelByStationId(
                    schedule?.StationId,
                    undefined,
                    undefined,
                    channelMap
                ).channel);

        const playableLiveSchedule = getPlayableLiveSchedule(
            schedules,
            schedule || programSubscriberData?.currentSchedule,
            channelMap,
            account,
            isFromEPG,
            StationIdFromEPG,
            !isFromSeries
                ? programUDPData["ChannelInfo"]
                : seriesUDPData["ChannelInfo"],
            programSubscriberData
        );

        let isInhome;

        const isUpcomingProgram =
            playableLiveSchedule?.Schedule?.ProgramId ===
            programSubscriberData?.udpData?.ChannelInfo?.Schedule
                ?.ProgramId &&
            programSubscriberData?.udpData?.ChannelInfo?.Schedule
                ?.playSource === sourceTypeString.UPCOMING;

        if (!!playableLiveSchedule && !isFromSeries) {
            programUDPData["ChannelInfo"] = playableLiveSchedule;

            const combinedEntitlements =
                (playableLiveSchedule?.Schedule?.Entitlements &&
                    removeEntitlementsAbbreviationsAndSort(
                        playableLiveSchedule.Schedule.Entitlements
                    )) ||
                [];

            programUDPData["isInHome"] = isInHome(
                combinedEntitlements,
                ipStatus
            );
            isInhome = programUDPData?.isInHome;
        } else if (seriesUDPData) {
            const channelService = channelMap.getService(channel);
            seriesUDPData["ChannelInfo"] = playableLiveSchedule || {
                Schedule: { ...schedule },
                Channel: channel,
                Service: channelService,
            };
            isInhome = seriesUDPData?.isInHome;
        }

        if (programUDPData && !programUDPData["ChannelInfo"]) {
            programUDPData["ChannelInfo"] = {
                Schedule: schedule,
                Channel: channel,
                Service: channelMap?.getService(channel) || '',
            };
        }

        const isWatchLive =
            programSubscriberData?.PbrOverride ||
            (isPlayable(schedule?.Entitlements, account) &&
                isScheduleCurrent(schedule) &&
                isChannelPlayable(channel)) ||
            (!!playableLiveSchedule && !isUpcomingProgram);

        // Live CTA buttons
        if (
            (playableLiveSchedule &&
                isWatchLive &&
                isInhome &&
                !ppvInfo.hasPPV) ||
            (ppvInfo.hasPPV && ppvInfo.isPPVWatchable && isInHome)
        ) {
            playExists = true;
            if (!sourceType) {
                sourceType = SourceType.LIVE;
            }
            sourceIndicators["IsLive"] = true;
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_watch_live,
                buttonAction: AppStrings?.str_details_cta_watch_live,
                iconSource: playIcon,
            });
        }
    }

    //VOD CTA Button Logic
    let playAction = undefined;
    if (
        playActions?.length > 0 &&
        (programUDPData?.isInHome || seriesUDPData?.isInHome)
    ) {
        if (!sourceType) {
            sourceType = SourceType.VOD;
        }
        sourceIndicators.IsVOD = true;
        const isTrailer = playActions.find((playAction: PlayAction) => {
            if (playAction?.Tags?.includes("Trailer")) {
                return true;
            } else {
                return false;
            }
        });

        playAction = getRestrictionsForVod(playActions, false);

        if (playAction) {
            if (
                sourceIndicators.IsVOD &&
                (programSubscriberData?.Bookmark?.TimeSeconds > 0 ||
                    programPlayOptions?.Bookmark?.TimeSeconds > 0 ||
                    playAction?.Bookmark?.TimeSeconds > 0) &&
                (programSubscriberData?.Bookmark?.BookmarkType ===
                    bookmarkType.Video ||
                    programPlayOptions?.Bookmark?.BookmarkType ===
                    bookmarkType.Video ||
                    playAction?.Bookmark?.BookmarkType ===
                    bookmarkType.Video) &&
                ctaButtonGroup.length < 2
            ) {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: AppStrings?.str_details_cta_resume,
                    buttonAction: AppStrings?.str_details_cta_play,
                    iconSource: playIcon,
                });

                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText:
                        AppStrings?.str_details_cta_play_from_beginning,
                    buttonAction:
                        AppStrings?.str_details_cta_play_from_beginning,
                    iconSource: restart,
                });
            } else if (
                programSubscriberData?.assetType?.sourceType ===
                sourceTypeString.VOD &&
                ctaButtonGroup.length < 2
            ) {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: `${AppStrings?.str_details_cta_play} ${programSubscriberData?.assetType?.sourceType || ""
                        }`,
                    buttonAction: AppStrings?.str_details_cta_play,
                    iconSource: playIcon,
                });
            } else {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: AppStrings?.str_details_cta_play,
                    buttonAction: AppStrings?.str_details_cta_play,
                    iconSource: playIcon,
                });
            }
        }
        //Trailer CTA button Logic
        if (isTrailer) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_trailer,
                buttonAction: AppStrings?.str_details_cta_trailer,
                iconSource: trailerIcon,
            });
        }
    }

    //If Purchase is allowed ? Show Rent/Subscribe Logic
    if (hasFeatureIosCarrierBilling) {
        const isRent =
            purchaseActions?.find(
                (obj: any) => obj?.TransactionType === "Rent"
            ) ||
            (discoveryPackageAsset &&
                discoveryPackageAsset.PurchaseActions?.find(
                    (obj: any) => obj?.TransactionType === "Rent"
                ));
        const isBuy =
            purchaseActions?.find(
                (obj: any) => obj?.TransactionType === "Purchase"
            ) ||
            (discoveryPackageAsset &&
                discoveryPackageAsset.PurchaseActions?.find(
                    (obj: any) => obj?.TransactionType === "Purchase"
                ));
        //Rent CTA Button Logic'
        if (
            programSubscriberData?.purchaseActionsExists &&
            !programSubscriberData.isPurchased
        ) {
            if (isRent && isBuy) {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: AppStrings?.str_details_cta_rentbuy,
                    buttonAction: AppStrings?.str_details_cta_rentbuy,
                    iconSource: rentBuyIcon,
                });
            } else if (isRent) {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: AppStrings?.str_details_cta_rent,
                    buttonAction: AppStrings?.str_details_cta_rent,
                    iconSource: rentBuyIcon,
                });
            } else if (isBuy) {
                ctaButtonGroup.push({
                    buttonType: "TextIcon",
                    buttonText: AppStrings?.str_details_cta_buy,
                    buttonAction: AppStrings?.str_details_cta_buy,
                    iconSource: rentBuyIcon,
                });
            }
        }
        //Package CTA Button Logic
        if (programSubscriberData?.purchasePackageExists) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_package,
                buttonAction: AppStrings?.str_details_cta_package,
                iconSource: rentBuyIcon,
            });
        }

        //Subscribe CTA Button Logic
        if (subscriptions?.length > 0) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_subscribe,
                buttonAction: AppStrings?.str_details_cta_subscribe,
                iconSource: subscribeIcon,
            });
        }
    }

    //PlayDVR CTA button Logic
    if (playDvr && !ppvInfo.hasPPV) {
        sourceIndicators["IsDVR"] = true;
        if (
            (programUDPData?.Bookmark || seriesUDPData?.Bookmark) &&
            (programUDPData?.Bookmark?.BookmarkType ===
                bookmarkType.Recording ||
                seriesUDPData?.Bookmark?.BookmarkType ===
                bookmarkType.Recording) &&
            ctaButtonGroup.length < 2
        ) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_resume,
                buttonAction: AppStrings?.str_details_cta_playdvr,
                iconSource: playIcon,
            });
        } else if (ctaButtonGroup.length < 2) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_playdvr,
                buttonAction: AppStrings?.str_details_cta_playdvr,
                iconSource: playIcon,
            });
        }
    }

    const playableCatchupSchedule = !(
        programSubscriberData?.playSource === sourceTypeString.UPCOMING ||
        seriesData?.playSource === sourceTypeString.UPCOMING
    )
        ? getPlayableCatchupSchedule(
            programPlayOptions,
            programSubscriberData?.currentCatchupSchedule,
            channelMap,
            account,
            isFromEPG,
            StationIdFromEPG,
            ipStatus,
            playAction
        )
        : undefined;

    //Restart CTA Button Logic
    if (
        playableCatchupSchedule &&
        playableCatchupSchedule.length &&
        (programUDPData?.isInHome || seriesUDPData?.isInHome) &&
        !ppvInfo.hasPPV
    ) {
        for (const cta of playableCatchupSchedule) {
            if (
                cta?.ChannelInfo?.Schedule?.ProgramId ===
                programSubscriberData?.udpData?.ChannelInfo?.Schedule
                    ?.ProgramId &&
                programSubscriberData?.udpData?.ChannelInfo?.Schedule
                    ?.playSource === sourceTypeString.UPCOMING
            ) {
                continue;
            }

            if (
                cta.button.buttonText ===
                AppStrings?.str_details_cta_restart ||
                cta.button.buttonText ===
                AppStrings?.str_details_cta_resume
            ) {
                if (!sourceType) {
                    sourceType = SourceType.CATCHUP;
                }
                sourceIndicators["IsRestart"] = true;
            }
            if (!isFromSeries && programUDPData) {
                if (
                    !programUDPData?.ChannelInfo?.Schedule ||
                    !programUDPData?.ChannelInfo?.Channel
                ) {
                    programUDPData["ChannelInfo"] = cta?.ChannelInfo;
                }
                if (!programUDPData?.Bookmark) {
                    programUDPData["Bookmark"] = cta?.bookmark;
                }
                programUDPData["currentCatchupSchedule"] = cta?.ChannelInfo;
                programUDPData["playSource"] = sourceTypeString.CATCHUP;
            } else if (seriesUDPData) {
                if (!seriesUDPData?.ChannelInfo) {
                    seriesUDPData["ChannelInfo"] = cta?.ChannelInfo;
                }

                if (!seriesUDPData?.Bookmark) {
                    seriesUDPData["Bookmark"] = cta?.bookmark;
                }
                seriesUDPData["currentCatchupSchedule"] = cta?.ChannelInfo;
                seriesUDPData["playSource"] = sourceTypeString.CATCHUP;
            }
            playExists = true;
            ctaButtonGroup.push(cta.button);
        }
    }

    if (episodes?.length > 0) {
        // const getPlayableEpisode = () => {
        //         let playActionsExists = false;
        //         let futurePlayActionExists = false;
        //         for (let episode of episodes) {
        //             const isEpisodePlayable =
        //                 episode.PlayActions?.length &&
        //                 episode.PlayActions.some((playAction: any) => {
        //                     return (config.playerConfig.supportedEncodings as any)[
        //                         playAction.VideoProfile.Encoding
        //                     ];
        //                 });

        //             if (!playActionsExists && episode.PlayActions?.length) {
        //                 playActionsExists = true;
        //             }
        //             if (
        //                 !futurePlayActionExists &&
        //                 (programUDPData?.isInHome || seriesUDPData?.isInHome) &&
        //                 (isLive ||
        //                     programSubscriberData?.currentCatchupSchedule ||
        //                     seriesUDPData?.isPlayable)
        //             ) {
        //                 futurePlayActionExists = true;
        //             }
        //             if (
        //                 isEpisodePlayable &&
        //                 (programUDPData?.isInHome || seriesUDPData?.isInHome)
        //             ) {
        //                 if (!sourceType) {
        //                     sourceType = SourceType.VOD;
        //                 }
        //                 episode?.PlayActions?.map((playAction: any) => {
        //                     // Usable play actions
        //                     if (filterUsablePlayActions(playAction)) {
        //                         playAction["Tags"] = episode?.CatalogInfo?.Tags;
        //                         playAction["Bookmark"] = episode?.Bookmark;
        //                         playAction["CatalogInfo"] = episode?.CatalogInfo;
        //                         seriesUDPData["usablePlayActions"].push(playAction);
        //                     }
        //                 });

        //                 seriesUDPData["Id"] = episode.Id;

        //                 const { SeasonNumber, EpisodeNumber } = episode.CatalogInfo;
        //                 if (
        //                     (episode?.Bookmark ||
        //                         seriesSubscriberData?.Bookmark ||
        //                         seriesUDPData?.Bookmark) &&
        //                     (episode?.Bookmark?.BookmarkType ===
        //                         bookmarkType.Video ||
        //                         seriesSubscriberData?.Bookmark?.BookmarkType ===
        //                             bookmarkType.Video ||
        //                         seriesUDPData?.Bookmark?.BookmarkType ===
        //                             bookmarkType.Video)
        //                 ) {
        //                     if (!seriesUDPData?.Bookmark) {
        //                         seriesUDPData["Bookmark"] =
        //                             episode?.Bookmark ||
        //                             seriesSubscriberData?.Bookmark;
        //                     }

        //                     ctaButtonGroup.push({
        //                         buttonType: "TextIcon",
        //                         buttonText: `${AppStrings?.str_details_cta_resume} ${assetType?.sourceType} S${SeasonNumber} E${EpisodeNumber}`,
        //                         buttonAction: AppStrings?.str_details_cta_play,
        //                         iconSource: playIcon,
        //                     });

        //                     ctaButtonGroup.push({
        //                         buttonType: "TextIcon",
        //                         buttonText: `${AppStrings?.str_details_cta_play_from_beginning}`,
        //                         buttonAction:
        //                             AppStrings
        //                                 ?.str_details_cta_play_from_beginning,
        //                         iconSource: playIcon,
        //                     });
        //                 } else {
        //                     ctaButtonGroup.push({
        //                         buttonType: "TextIcon",
        //                         buttonText: `${AppStrings?.str_details_cta_play} ${assetType?.sourceType} S${SeasonNumber}E${EpisodeNumber}`,
        //                         buttonAction: AppStrings?.str_details_cta_play,
        //                         iconSource: playIcon,
        //                     });
        //                 }
        //                 return;
        //             }
        //         }
        // };

        const getStatusText = (
            statusText: any,
            futurePlayActionExists: boolean
        ) => {
            if (statusText.length === 0) {
                if (futurePlayActionExists) {
                    statusText.unshift(
                        AppStrings
                            ?.str_playback_unavailable_currently_message
                    );
                } else {
                    statusText.unshift(
                        AppStrings?.str_playback_unavailable_error_message
                    );
                }
                return;
            } else {
                if (futurePlayActionExists) {
                    statusText.unshift(
                        AppStrings
                            ?.str_playback_unavailable_currently_message
                    );
                } else {
                    statusText.unshift(
                        AppStrings?.str_playback_unavailable_error_message
                    );
                }

                let index = statusText.indexOf(
                    AppStrings?.str_subscription_required
                );
                if (index != -1) {
                    statusText.splice(index, 1);
                    statusText.unshift(
                        AppStrings?.str_subscription_required
                    );
                }
            }
        };

        !playExists &&
            (isFromSeries
                ? seriesData?.playSource !== sourceTypeString.UPCOMING
                : programSubscriberData?.playSource !==
                sourceTypeString.UPCOMING) &&
            getStatusText(seriesUDPData.statusText);

        if (!seriesUDPData?.IsGeneric || seriesUDPData?.episodes?.length > 0) {
            ctaButtonGroup.push({
                buttonType: "TextIcon",
                buttonText: AppStrings?.str_details_cta_more_episodes,
                buttonAction: AppStrings?.str_details_cta_more_episodes,
                iconSource: episodeListIcon,
            });
        }
    }

    if (
        !ppvInfo.hasPPV &&
        (schedules?.length > 0 ||
            programPlayOptions?.CatchupSchedules?.length ||
            playActions.length > 0)
    ) {
        let upcomingProgramSchedule;

        if (
            isFromSeries &&
            seriesData?.playSource === sourceTypeString.UPCOMING &&
            seriesData.isFromEPG
        ) {
            upcomingProgramSchedule =
                seriesData?.Schedule || seriesData?.ChannelInfo.Schedule;
        } else if (
            programSubscriberData?.playSource === sourceTypeString.UPCOMING ||
            programSubscriberData?.udpData?.ChannelInfo?.Schedule
                ?.playSource === sourceTypeString.UPCOMING
        ) {
            upcomingProgramSchedule =
                programSubscriberData?.udpData?.ChannelInfo?.Schedule ||
                programSubscriberData?.ChannelInfo?.Schedule;
        }
        handleWaysToWatchCtaButton(
            playActions,
            undefined,
            schedules,
            channelMap,
            programPlayOptions,
            account,
            ipStatus,
            upcomingProgramSchedule,
            sourceIndicators,
            isFromSeries,
            programUDPData,
            seriesUDPData,
            ctaButtonGroup
        );
    }

    if (
        dvrPlayActions &&
        dvrPlayActions?.buttonAction !== DvrButtonAction.None &&
        !ppvInfo.hasPPV
    ) {
        const recordButton =
            dvrPlayActions?.buttonAction &&
            getRecordButton(
                dvrPlayActions.buttonAction,
                isFromSeries,
                dvrPlayActions.subscription
            );
        if (recordButton) {
            if (!sourceType) {
                sourceType = SourceType.DVR;
            }
            ctaButtonGroup.push(recordButton);
        }
    } else if (ppvInfo.hasPPV && ppvInfo.isPPVRecordable) {
        const recordButton =
            dvrPlayActions?.buttonAction &&
            getRecordButton(
                dvrPlayActions.buttonAction,
                isFromSeries,
                dvrPlayActions.subscription
            );
        if (recordButton) {
            if (!sourceType) {
                sourceType = SourceType.DVR;
            }
            ctaButtonGroup.push(recordButton);
        }
    }

    if (isFromSeries) {
        seriesUDPData.SourceType = sourceType;
        seriesUDPData.SourceIndicators = sourceIndicators;
    } else {
        programUDPData.SourceType = sourceType;
        programUDPData.SourceIndicators = sourceIndicators;
    }

    if (isFromSeries && ppvInfo.hasPPV) {
        seriesUDPData.statusText = ppvInfo.StatusMessage;
    } else if (ppvInfo.hasPPV) {
        programUDPData.statusText.push(ppvInfo.StatusMessage);
    }

    ctaButtonGroup.push({
        buttonType: "TextIcon",
        buttonText: AppStrings?.str_details_cta_more_info || "ABC",
        buttonAction: AppStrings?.str_details_cta_more_info || "ABNC",
        iconSource: moreInfoIcon,
    });

    return [ctaButtonGroup, ppvInfo];
};

const handleWaysToWatchCtaButton = (
    playActions: any,
    purchaseActions: any,
    schedules: any,
    channelMap: any,
    programPlayOptions: any,
    account: any,
    ipStatus: any,
    upcomingProgramSchedule: any,
    sourceIndicators: any,
    isFromSeries: any,
    programUDPData: any,
    seriesUDPData: any,
    ctaButtonGroup: any
) => {
    const waysToWatchSchedules = waystoWatchSchedules(
        schedules || [],
        channelMap,
        (programPlayOptions?.CatchupSchedules?.length &&
            programPlayOptions?.CatchupSchedules) ||
        [],
        playActions,
        isFromSeries
            ? seriesUDPData.subscriptionItemForProgram
            : programUDPData.subscriptionItemForProgram,
        account,
        ipStatus,
        upcomingProgramSchedule,
        ctaButtonGroup
    );

    if (waysToWatchSchedules.restart?.length) {
        sourceIndicators["IsRestart"] = true;
    }

    if (waysToWatchSchedules.upcoming?.length) {
        sourceIndicators["IsUpcoming"] = true;
    }

    if (
        !sourceIndicators?.IsLive &&
        waysToWatchSchedules.restart?.length === 1
    ) {
        waysToWatchSchedules.restart = [];
    }

    if (!isFromSeries && programUDPData) {
        programUDPData["waysToWatchSchedules"] = waysToWatchSchedules;
    } else if (seriesUDPData) {
        seriesUDPData["waysToWatchSchedules"] = waysToWatchSchedules;
    }

    if (
        waysToWatchSchedules.restart?.length ||
        waysToWatchSchedules.upcoming?.length ||
        waysToWatchSchedules.watchLive?.length ||
        waysToWatchSchedules.playDvr?.length ||
        (waysToWatchSchedules.playVod?.length &&
            waysToWatchSchedules.restart?.length) ||
        (waysToWatchSchedules.watchLive?.length &&
            waysToWatchSchedules.playDvr?.length)
    ) {
        ctaButtonGroup.push({
            buttonType: "TextIcon",
            buttonText: AppStrings?.str_details_cta_waystowatch,
            buttonAction: AppStrings?.str_details_cta_waystowatch,
            iconSource: waysToWatchIcon,
        });
    }
};

export const waystoWatchSchedules = (
    schedules: any,
    channelMap: any,
    catchupSchedules?: any,
    playActions?: any,
    subscriptionItem?: any,
    account?: any,
    ipStatus?: any,
    upcomingSchedule?: any,
    ctaButtonGroup?: any
) => {
    const waystoWatchSchedulesObj: WaysToWatchObj = {
        watchLive: [],
        playVod: [],
        playDvr: [],
        restart: [],
        rentBuy: [],
        subscribe: [],
        upcoming: [],
    };
    if (
        subscriptionItem &&
        (subscriptionItem.ItemState === DvrItemState.RECORDED ||
            subscriptionItem.ItemState === DvrItemState.RECORDING) &&
        subscriptionItem?.PlayInfo &&
        subscriptionItem?.PlayInfo?.length
    ) {
        waystoWatchSchedulesObj.playDvr.push(subscriptionItem);
    }

    const featurePlayActions = [];
    playActions?.map((playAction: PlayAction) => {
        if (playAction?.Tags?.includes("Feature")) {
            featurePlayActions.push(playAction);
        }
    });

    if (
        (playActions &&
            !ctaButtonGroup.some(
                (button: any) =>
                    button.buttonAction ===
                    AppStrings?.str_details_cta_play
            )) ||
        featurePlayActions.length > 1
    ) {
        playActions.map((playAction: PlayAction) => {
            if (playAction?.Tags?.includes("Feature")) {
                waystoWatchSchedulesObj.playVod.push(playAction);
            }
        });
    }
    if (catchupSchedules && catchupSchedules.length) {
        for (const schedule of catchupSchedules) {
            const channel: IChannelCache = findChannelByStationId(
                schedule.StationId,
                undefined,
                undefined,
                channelMap
            );

            if (
                upcomingSchedule &&
                upcomingSchedule?.ProgramId === schedule?.ProgramId
            ) {
                continue;
            }

            const service = channelMap.getService(channel?.channel);
            const isSchedulePlayable =
                isPlayable(schedule?.Entitlements, account) &&
                isChannelPlayable(channel?.channel) &&
                isCatchupEnabled(schedule?.Entitlements) &&
                isScheduleCurrent({
                    StartUtc: schedule?.CatchupStartUtc,
                    EndUtc: schedule?.CatchupEndUtc,
                });
            const combinedEntitlements =
                (schedule?.Entitlements &&
                    removeEntitlementsAbbreviationsAndSort(
                        schedule.Entitlements
                    )) ||
                [];

            if (
                isSchedulePlayable &&
                service &&
                recentlyAiredRights(channel?.channel) &&
                isInHome(combinedEntitlements, ipStatus)
            ) {
                schedule["ChannelInfo"] = {
                    Schedule: { ...schedule },
                    Channel: channel?.channel,
                    Service: service,
                };
                waystoWatchSchedulesObj.restart.push(schedule);
            }
        }
    }

    if (!schedules || !schedules.length) {
        return waystoWatchSchedulesObj;
    }

    for (const schedule of schedules) {
        const scheduleTime = getScheduleTime(schedule);
        const channel = findChannelByStationId(
            schedule.StationId,
            undefined,
            undefined,
            channelMap
        );
        const service = channelMap.getService(channel?.channel);

        const setWaysToWatchSchedules = (
            channelInfo: {
                Schedule: any;
                Channel?: IChannel;
                Service: any;
            },
            scheduleTime: string
        ) => {
            if (
                !(
                    upcomingSchedule &&
                    upcomingSchedule?.ProgramId ===
                    channelInfo?.Schedule?.ProgramId &&
                    scheduleTime === "restart"
                )
            ) {
                schedule["ChannelInfo"] = channelInfo;
                waystoWatchSchedulesObj[scheduleTime].push(schedule);
            }
        };

        const isSchedulePlayable =
            isPlayable(schedule?.Entitlements, account) &&
            isChannelPlayable(channel?.channel) &&
            isScheduleCurrent({
                StartUtc: schedule?.CatchupStartUtc,
                EndUtc: schedule?.CatchupEndUtc,
            });
        const combinedEntitlements =
            (schedule?.Entitlements &&
                removeEntitlementsAbbreviationsAndSort(
                    schedule.Entitlements
                )) ||
            [];

        if (
            scheduleTime === "watchLive" &&
            isSchedulePlayable &&
            service &&
            recentlyAiredRights(channel?.channel) &&
            isInHome(combinedEntitlements, ipStatus)
        ) {
            setWaysToWatchSchedules(
                {
                    Schedule: { ...schedule },
                    Channel: channel?.channel,
                    Service: service,
                },
                scheduleTime
            );
        } else if (
            scheduleTime === "restart" &&
            isSchedulePlayable &&
            isCatchupEnabled(schedule?.Entitlements) &&
            service &&
            recentlyAiredRights(channel?.channel) &&
            isInHome(combinedEntitlements, ipStatus)
        ) {
            setWaysToWatchSchedules(
                {
                    Schedule: { ...schedule },
                    Channel: channel?.channel,
                    Service: service,
                },
                scheduleTime
            );
        } else if (service && scheduleTime) {
            setWaysToWatchSchedules(
                {
                    Schedule: { ...schedule },
                    Channel: channel?.channel,
                    Service: service,
                },
                scheduleTime
            );
        }
    }

    return waystoWatchSchedulesObj;
};

export function isScheduleFuture(schedule: {
    StartUtc: string;
    EndUtc: string;
}): boolean {
    if (schedule && schedule.StartUtc && schedule.EndUtc) {
        const startTime: Date = new Date(schedule.StartUtc);
        const endTime: Date = new Date(schedule.EndUtc);
        return (
            startTime &&
            endTime &&
            startTime < endTime &&
            startTime > new Date()
        );
    }
    return false;
}

const processSchedules = (
    liveSchedules: any,
    channelMap: any,
    account: any
) => {
    if (!liveSchedules || !liveSchedules.length) {
        return;
    }

    const liveSchedulesList: any = [];
    const upcomingSchedulesList: any = [];
    const combinedAudioTags: string[] = [];

    for (const schedule of liveSchedules) {
        combinedAudioTags.push(...Object.keys(schedule.AudioTags || {}));
        const entitlements: string[] = schedule.Entitlements;
        const channel: any = findChannelByStationId(
            schedule?.StationId,
            undefined,
            undefined,
            channelMap
        ).channel;
        const isSchedulePlayable =
            isPlayable(entitlements, account) && isChannelPlayable(channel);
        const isCurrentSchedule = isScheduleCurrent(schedule);
        const isFutureSchedule =
            schedule?.StartUtc && Date.parse(schedule.StartUtc) > Date.now();
        // Current schedule must match the passed in start and end time, if there is an asset that is playing on repeat we do not want to render the Watch Live button for the upcoming time slot
        if (isSchedulePlayable) {
            if (isCurrentSchedule) {
                liveSchedulesList.push(schedule);
            } else if (isFutureSchedule) {
                upcomingSchedulesList.push(schedule);
            }
        }
    }
    return {
        liveSchedulesList,
        upcomingSchedulesList,
        combinedAudioTags,
    };
};



export function hasRemainingSeconds(
    bookmarkSeconds: number,
    durationSeconds: number
): boolean {
    return (
        bookmarkSeconds >= 0 &&
        durationSeconds - bookmarkSeconds >
        config.playerConfig.bookmarkCreditThresholdSeconds
    );
}


export const getBaseValues = (feed: any, browsePageConfig: any) => {
    const browseFeedObject = getBrowseFeedObject(feed, browsePageConfig);
    let pivots =
        feed.NavigationTargetUri?.split("?")[1]?.split("&")[0] || undefined;
    let orderBy = browseFeedObject?.params?.$orderBy;
    if (pivots) {
        pivots = pivots?.replace("=", "|");
    }
    if (browseFeedObject?.params?.baseFilters) {
        pivots = pivots
            ? pivots?.concat(",", browseFeedObject.params?.baseFilters)
            : browseFeedObject.params?.baseFilters;
    }
    if (feed?.ItemType && feed?.ItemType === ItemShowType.App) {
        orderBy = feed.NavigationTargetUri?.split("&")[1].split("=")[1];
    }
    return {
        orderBy,
        pivots,
    };
};

export const getBrowseFeed = (
    feed: any,
    baseValues: any,
    parsedState: { pivots?: string; orderBy?: string; showType?: string },
    page: number,
    browsePageConfig: any
) => {
    const browseFeed = { ...feed };
    const navigationTargetUri = feed.NavigationTargetUri?.split("?")[0];
    const browseFeedObject = getBrowseFeedObject(feed, browsePageConfig);

    let pivots = parsedState?.pivots || "";

    const baseValuePivots = baseValues?.pivots?.split(",") || [];

    for (const pivot of baseValuePivots) {
        if (!pivots.includes(pivot?.split("|")[0])) {
            pivots += pivots ? "," + pivot : pivot;
        }
    }

    if (feed.pivotGroup) {
        pivots = pivots + `,${feed.pivotGroup}|${feed.Id}`;
    }
    if (
        (navigationTargetUri === browseType.browsepromotions &&
            feedBaseURI.subscriber.test(feed.Uri)) ||
        navigationTargetUri === browseType.libraries
    ) {
        const libraryId = <Library>feed.Uri?.split("/").pop();
        browseFeed["Uri"] = `${browseFeedObject.uri}/${libraryId}`;
    } else if (feedBaseURI.catchup.test(feed.Uri)) {
        const catchupUri = feed.Uri?.split("/").pop();
        browseFeed["Uri"] = `${browseFeedObject.uri}/${catchupUri}`;
    } else {
        browseFeed["Uri"] = browseFeedObject.uri;
    }
    if (feed.ItemType === ItemShowType.SvodPackage) {
        browseFeed["CategoryId"] = parsedState.pivots
            ? parsedState.pivots
            : feed.CategoryId;
    }

    browseFeed["pivots"] = pivots;
    browseFeed["$top"] = browseFeedObject.params.$top;
    browseFeed["$orderBy"] = parsedState.orderBy || baseValues.orderBy;
    browseFeed["types"] =
        browseFeedObject.params.types &&
        browseFeedObject.params.types?.split("|");
    browseFeed["$skip"] = browseFeedObject.params.$top * page;
    browseFeed["ShowType"] =
        parsedState.showType || browseFeedObject.params.showType;
    return browseFeed;
};

export const getBrowseFeedObject = (feed: any, browsePageConfig: any): any => {
    let browseFeedObject: any;
    const navigationTargetUri = feed.NavigationTargetUri?.split("?")[0];
    if (!navigationTargetUri && feed.ItemType === ItemShowType.SvodPackage) {
        browseFeedObject = browsePageConfig[ItemShowType.browseSvodPackage];
    } else if (navigationTargetUri === browseType.browsepromotions) {
        if (feedBaseURI.discovery.test(feed.Uri)) {
            if (feed.ItemType === ItemShowType.SvodPackage) {
                browseFeedObject =
                    browsePageConfig[navigationTargetUri][feed?.ItemType];
            } else {
                browseFeedObject =
                    browsePageConfig[navigationTargetUri][
                    ItemShowType.discovery
                    ];
            }
        } else if (feedBaseURI.subscriber.test(feed.Uri)) {
            browseFeedObject =
                browsePageConfig[navigationTargetUri][ItemShowType.subscriber];
        } else if (feedBaseURI.catchup.test(feed.Uri)) {
            browseFeedObject =
                browsePageConfig[navigationTargetUri][ItemShowType.Catchup];
        }
    } else if (navigationTargetUri === browseType.browsemoviesandtv) {
        if (feed.ItemType === ItemShowType.SvodPackage) {
            browseFeedObject =
                browsePageConfig[navigationTargetUri][feed?.ItemType];
        } else {
            browseFeedObject =
                browsePageConfig[navigationTargetUri][ItemShowType.Program];
        }
    } else {
        browseFeedObject = browsePageConfig[navigationTargetUri];
    }
    return browseFeedObject;
};


export const getVodVideoProfileId = (
    usablePlayActions: any,
    isTrailer: boolean
) => {
    const playActions = getRestrictionsForVod(usablePlayActions, isTrailer);
    return playActions.VideoProfile.Id.split(
        `_${playActions.VideoProfile.Encoding}`
    )[0];
};

export const DateToAMPM = (date: Date) => {
    let hours = date?.getHours();
    let minutes = date?.getMinutes();
    const ampm =
        hours >= 12 ? AppStrings?.str_pm : AppStrings?.str_am;
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    //@ts-ignore
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return strTime;
};

export const getMonthName = (date: Date, isNotUTC?: boolean) => {
    // Months of the year.
    const monthList = new Array(12);
    monthList[0] = AppStrings?.str_dates.str_january;
    monthList[1] = AppStrings?.str_dates.str_february;
    monthList[2] = AppStrings?.str_dates.str_march;
    monthList[3] = AppStrings?.str_dates.str_april;
    monthList[4] = AppStrings?.str_dates.str_may;
    monthList[5] = AppStrings?.str_dates.str_june;
    monthList[6] = AppStrings?.str_dates.str_july;
    monthList[7] = AppStrings?.str_dates.str_august;
    monthList[8] = AppStrings?.str_dates.str_september;
    monthList[9] = AppStrings?.str_dates.str_october;
    monthList[10] = AppStrings?.str_dates.str_november;
    monthList[11] = AppStrings?.str_dates.str_december;
    return isNotUTC
        ? monthList[date.getUTCMonth()]
        : monthList[date.getMonth()];
};

export const DateToParsedDate = (date: Date) => {
    // Days of the week.
    const weekDayList = new Array(7);
    weekDayList[0] = AppStrings?.str_dates.str_sunday;
    weekDayList[1] = AppStrings?.str_dates.str_monday;
    weekDayList[2] = AppStrings?.str_dates.str_tuesday;
    weekDayList[3] = AppStrings?.str_dates.str_wednesday;
    weekDayList[4] = AppStrings?.str_dates.str_thursday;
    weekDayList[5] = AppStrings?.str_dates.str_friday;
    weekDayList[6] = AppStrings?.str_dates.str_saturday;

    const weekDayName = weekDayList[date.getDay()];
    return `${weekDayName}, ${getMonthName(date)} ${date.getDate()}`;
};

export const nth = function (d: number) {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
};

export const massagePreviousDate = (startUtc: any, hasPPV = false) => {
    if (!hasPPV) {
        // Today's date.
        const todaysDate = new Date(Date.now());
        const currentDate = new Date(startUtc);
        // yest's date.
        const yesterdaysDate = new Date();
        yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);
        const yesterday = yesterdaysDate.getDate();
        const today = todaysDate?.getDate();
        const currentDay = currentDate?.getDate();

        const convertedStartDate = new Date(startUtc);

        if (currentDay === today) {
            return AppStrings?.str_dates.str_today;
        } else if (currentDay === yesterday) {
            return AppStrings?.str_dates.str_yesterday;
        } else {
            return DateToParsedDate(convertedStartDate);
        }
    } else {
        const date = new Date(startUtc).getDate();
        const today = new Date(Date.now()).getDate();
        const convertedStartDate = new Date(startUtc);

        if (date === today + 1) {
            return AppStrings?.str_dates.str_tomorrow;
        } else if (date === today) {
            return AppStrings?.str_dates.str_today;
        } else {
            return DateToParsedDate(convertedStartDate);
        }
    }
};


const datePerUri: { [key: string]: Date } = {};
const EXPIRY_TIME = 5000; // 5 seconds

/**
 * Get date per feed uri.
 * Used to generate params for use in UDL methods.
 * Renews date base on setIfExpired value on expiry.
 * @param uri Feed URI
 * @param setIfExpired Flag to determine if the date has to be reseton expired
 */
export function getDate(uri: string, setIfExpired = false) {
    const date = datePerUri[uri];
    if (date) {
        if (setIfExpired) {
            // If date set is expired, then reset it to current time.
            if (Date.now() - date.getTime() > EXPIRY_TIME) {
                datePerUri[uri] = new Date();
            }
        }

        return datePerUri[uri];
    } else {
        datePerUri[uri] = new Date();
        return datePerUri[uri];
    }
}

export const isTimeRangeCurrent = (
    startTime: number,
    endTime: number,
    rangeStartTime?: Date,
    rangeEndTime?: Date
): boolean => {
    if (startTime && endTime) {
        // show has offer
        // now check if the show is a current or a future show
        // if no start or end time then setting the value to 0.
        const startTimeDelta = startTime
            ? startTime -
            (rangeStartTime ? rangeStartTime.getTime() : Date.now())
            : 0,
            endTimeDelta = endTime
                ? endTime - (rangeEndTime ? rangeEndTime.getTime() : Date.now())
                : 0;

        return (
            ((rangeEndTime ? startTimeDelta >= 0 : startTimeDelta <= 0) &&
                (rangeEndTime ? endTimeDelta <= 0 : endTimeDelta > 0)) ||
            startTime === endTime
        );
    }
    return false;
};

export const isDvrPlayable = (programId: string, dvrItems: any): boolean => {
    if (!dvrItems) {
        return false;
    }

    const isDvrPlayable: boolean = some(dvrItems.models, (dvrItem: any) => {
        const itemAttr: any = dvrItem.attributes;
        return (
            itemAttr.ProgramId === programId &&
            itemAttr &&
            itemAttr.DvrPlayInfo &&
            !!itemAttr.DvrPlayInfo.PlayInfo &&
            isNetworkDvrPlayable(itemAttr.DvrPlayInfo.PlayInfo)
        );
    });
    return isDvrPlayable;
};

export const isNetworkDvrPlayable = (playInfo: any): boolean => {
    if (!playInfo || !!(playInfo.StartTime && playInfo.EndTime)) {
        return false;
    }

    const now = new Date();
    //start and end time for download content convert to string while json parsing to save in local db(online content it won't  change anything)
    //changing again to Date object to compare with other Date objects
    const startTime =
        typeof playInfo.StartTime === "string"
            ? new Date(playInfo.StartTime)
            : playInfo.StartTime;
    const endTime =
        typeof playInfo.EndTime === "string"
            ? new Date(playInfo.EndTime)
            : playInfo.EndTime;
    const isCompleted = now > endTime;

    const isInProgress = now >= startTime && now <= endTime;
    const canPlay = isCompleted || isInProgress;

    return canPlay;
};

export interface IChannelIndex {
    channel: IChannel;
    channelIndex: number;
}

const _byNumber: any = {};
export const findChannelByStationId = (
    stationId: string | number,
    defaultIndex?: number,
    force = false,
    channelMap: any
): IChannelIndex => {
    const ci = findChannelByField(
        stationId,
        "StationId",
        defaultIndex,
        force,
        channelMap?.Channels
    );
    if (ci.channel) {
        _byNumber[ci.channel.Number] = ci; // manage other caches.
    }
    return ci;
};

const cache:
    | { [index: string]: IChannelIndex }
    | { [index: number]: IChannelIndex } = {};

export const findChannelByField = (
    value: number | string,
    channels: any,
    field: string,
    defaultIndex?: number,
    force = false,
): IChannelIndex => {
    if (!force && _byNumber && (_byNumber as any)[value]) {
        return (_byNumber as any)[value];
    }

    if (channels && channels.length > 0) {
        let ret_channel;
        let ret_index = -1;
        let found_channel = false;

        if (field === "Name" && typeof value === "string") {
            // The first pass for finding channel with the full match
            for (const channel of channels) {
                if (found_channel === true) {
                    break;
                }

                if (
                    typeof value === "string" &&
                    channel[field].toLowerCase().includes(value.toLowerCase())
                ) {
                    const array = channel[field].toLowerCase().split(/[()]+/);
                    for (let j = 0, len = array.length; j < len; j += 1) {
                        const name = array[j].split(/[- ,_/]+/).join(" ");
                        if (
                            typeof value === "string" &&
                            name.toLowerCase() === value.toLowerCase()
                        ) {
                            ret_channel = channel;
                            found_channel = true;
                            break;
                        }
                    }
                }
            }
        } else {
            // Finding channel by number or some other field
            for (const channel of channels) {
                if ((channel as any)[field] === value) {
                    found_channel = true;
                    ret_channel = channel;
                    break;
                }
            }
        }

        if (found_channel === true) {
            const ret = {
                channel: ret_channel,
                channelIndex: ret_index,
            };
            if (cache) {
                (cache as any)[value] = ret;
            }
            return ret;
        }

        if (defaultIndex !== undefined) {
            return {
                channel: channels[defaultIndex],
                channelIndex: defaultIndex,
            };
        }
    }
    return { channel: undefined, channelIndex: undefined };
};

export interface AudioTracks {
    audioTracks: string[];
    currentAudioTrack: string;
}

export interface PlayerSlidePanelTracks {
    id: string | number;
    label: string;
}

export const massageSubtitles = (subtitles?: string[]) => {
    if (!subtitles?.length) {
        return [];
    }

    const massagedSubtitlesTracks: PlayerSlidePanelTracks[] = [
        { id: "off", label: AppStrings?.str_app_off },
    ];
    subtitles?.map((subtitle: string) => {
        massagedSubtitlesTracks.push({
            id: subtitle,
            label: iso639LangaugeCodeMapping[subtitle],
        });
    });

    return massagedSubtitlesTracks;
};

export interface MassagedAudioTracks {
    audioTracks: PlayerSlidePanelTracks[];
    languageMap: any;
    audioLangCode: string | undefined;
}

export const massageAudioTracks = (audioTracks: AudioTracks) => {
    const massagedAudioTracks: MassagedAudioTracks = {
        audioTracks: [],
        languageMap: {},
        audioLangCode: undefined,
    };

    if (!audioTracks.audioTracks.length) {
        return massagedAudioTracks;
    }

    const audioLangCodesObject = getAudioDescriptionTrackLanguageCodes();

    audioTracks.audioTracks.map((audioTrack) => {
        const language = audioTrack.split("-").pop() || "";
        const languageCode = audioTrack.split("-").slice(-3).join("-") || "";
        massagedAudioTracks.languageMap[languageCode] = audioTrack;
        if (audioLangCodesObject[language]) {
            massagedAudioTracks.audioLangCode = languageCode;
        }
        if (language != audioLangCodesObject[language]) {
            massagedAudioTracks.audioTracks.push({
                id: languageCode,
                label: iso639LangaugeCodeMapping[language].concat(
                    getAudioTrackLocalisedCodec(audioTrack)
                ),
            });
        }
    });

    return massagedAudioTracks;
};

export function getAudioTrackLocalisedCodec(audioTrack: string): string {
    let localizedCodec = "";
    if (!isValidAudioTrackName(audioTrack)) {
        return localizedCodec;
    }
    let splittedAudioTrack = audioTrack.split("-");
    const audioCodecIndex = 2; // array index pointing to audio codec string
    const audioStreamTypeStringAC3 = "129"; // string representing audio stream type for AC3 audio returned by UCPlayer for RTP Live
    const audioStreamTypeStringEAC3 = "135"; // string representing audio stream type for EAC3 audio returned by UCPlayer for RTP Live
    if (
        splittedAudioTrack[audioCodecIndex] === "ac3" ||
        (splittedAudioTrack[audioCodecIndex] === "ac" &&
            splittedAudioTrack[audioCodecIndex + 1] === "3") ||
        splittedAudioTrack[audioCodecIndex] === audioStreamTypeStringAC3
    ) {
        localizedCodec = AppStrings.str_playback_audio_codec_ac3;
    } else if (
        splittedAudioTrack[audioCodecIndex] === "eac3" ||
        (splittedAudioTrack[audioCodecIndex] === "ec" &&
            splittedAudioTrack[audioCodecIndex + 1] === "3") ||
        splittedAudioTrack[audioCodecIndex] === audioStreamTypeStringEAC3
    ) {
        localizedCodec = AppStrings.str_playback_audio_codec_eac3;
    }
    return localizedCodec;
}

export function isValidAudioTrackName(audioTrackName: string): boolean {
    const audioTrackRegExp = /^(\w{3}-)?audio-\d+(-[a-zA-Z0-9]+)?-\w{3}$/gi; //eslint-disable-line
    const audioTrackRegExp1 = /^([aA]{1})udio-+([a-zA-Z0-9]+)-([a-zA-Z0-9\.-]+)-(\w{3})$/gi; //eslint-disable-line
    if (audioTrackName == null) {
        return false;
    }
    let normalizedAudioTrackName = normalizeAudioTrackName(audioTrackName);
    return (
        audioTrackRegExp.test(normalizedAudioTrackName) ||
        audioTrackRegExp1.test(normalizedAudioTrackName)
    );
}

export function normalizeAudioTrackName(audioTrackName: string): string {
    if (audioTrackName) {
        audioTrackName = audioTrackName.replace(/_/g, "-");
        let splittedAudioTrack = audioTrackName.split("-");
        // array index pointing to audio codec string
        const audioCodecIndex = 2;
        if (
            splittedAudioTrack[audioCodecIndex] === "ac" &&
            splittedAudioTrack[audioCodecIndex + 1] === "3"
        ) {
            audioTrackName = audioTrackName.replace("ac-3", "ac3");
        } else if (
            splittedAudioTrack[audioCodecIndex] === "ec" &&
            splittedAudioTrack[audioCodecIndex + 1] === "3"
        ) {
            audioTrackName = audioTrackName.replace("ec-3", "ec3");
        }
    }
    return audioTrackName;
}

export const getAudioDescriptionTrackLanguageCodes = () => {
    const audioLanguageCodes =
        config.playerConfig.audioDescriptionTrackLanguageCode;
    const audioLanguageCodesObject: { [key: string]: string } = {};
    for (let audioLanguageCode of audioLanguageCodes) {
        audioLanguageCodesObject[audioLanguageCode] = audioLanguageCode;
    }
    return audioLanguageCodesObject;
};

export function removeTrailingSlash(str: string) {
    return str?.replace(/\/$/, "");
}

export const isObject = (myVar: any) => myVar && typeof myVar === "object";

export const isValidPercentage = (progress: number) => {
    if (progress >= 0 && progress <= 1) {
        return true;
    }
    return false;
};


const filterStatusList = (statusList: any, ctaButtonList: any): any => {
    const hasRestartCtaButton =
        ctaButtonList?.length &&
        ctaButtonList.some(
            (cta: { buttonAction: string }) =>
                cta.buttonAction === AppStrings?.str_details_cta_restart
        );

    const isCatchupBlocked = statusList?.length
        ? statusList.includes(AppStrings.str_restrictions.catchup_blocked)
        : false;

    if (isCatchupBlocked && hasRestartCtaButton) {
        return statusList.filter(
            (status: string) =>
                status !== AppStrings.str_restrictions.catchup_blocked
        );
    }

    return statusList;
};


export const getNextEpisode = (currentEpisode: any, seriesPlayOptions: any) => {
    if (currentEpisode && seriesPlayOptions) {
        const currentEpisodeNumber = parseInt(
            currentEpisode?.EpisodeNumber ||
            currentEpisode?.CatalogInfo?.EpisodeNumber
        );
        const currentSeasonNumber = parseInt(
            currentEpisode?.SeasonNumber ||
            currentEpisode?.CatalogInfo?.SeasonNumber
        );
        const nextSeasonNumber = currentSeasonNumber + 1;
        const nextEpisodeNumber = currentEpisodeNumber + 1;

        //Returns present season next episode
        for (let season of seriesPlayOptions.Seasons) {
            if (season.SeasonNumber === currentSeasonNumber) {
                const episode: any =
                    season?.Episodes?.length &&
                    season?.Episodes?.find((episode: any) => {
                        if (
                            episode?.Vods[0]?.CatalogInfo?.EpisodeNumber &&
                            parseInt(
                                episode?.Vods[0]?.CatalogInfo?.EpisodeNumber
                            ) === nextEpisodeNumber
                        ) {
                            return episode;
                        }
                    });
                if (!episode) {
                    break;
                }
                episode["CatalogInfo"] = episode?.Vods[0]?.CatalogInfo || {};
                const nextEpisode = massageEpisodePlayOption(episode);
                if (nextEpisode.usablePlayActions) {
                    return nextEpisode;
                }
                return;
            }
        }

        //Returns next season First episode
        for (let season of seriesPlayOptions.Seasons) {
            if (season.SeasonNumber === nextSeasonNumber) {
                const episode = season.Episodes[0];
                episode["CatalogInfo"] = episode?.Vods[0].CatalogInfo;
                const nextEpisode = massageEpisodePlayOption(episode);
                if (nextEpisode.usablePlayActions) {
                    return nextEpisode;
                }
                return;
            }
        }
    } else {
        return;
    }
};

export const isScheduleInHomePlayable = (data: any) => {
    const {
        Entitlements = undefined,
        account = undefined,
        networkIHD = undefined,
    } = data;
    if (!Entitlements) {
        return true;
    }

    let ipStatus = account?.ClientIpStatus || {};
    if (!config.inhomeDetection.useSubscriberInHome) {
        // networkIHD data
        const inHomeValue =
            networkIHD?.status === "inHome" ||
            config.inhomeDetection.inHomeDefault;
        ipStatus["InHome"] = inHomeValue
            ? RestrictionValue.Yes
            : RestrictionValue.No;
    }

    const combinedEntitlements =
        (Entitlements &&
            removeEntitlementsAbbreviationsAndSort(Entitlements)) ||
        [];
    return isInHome(combinedEntitlements, ipStatus);
};

//@ts-ignore
export const getPivots = (params) => {
    //@ts-ignore
    const pivotsArray = [];
    if (!params) {
        //@ts-ignore
        return pivotsArray;
    }
    const paramsArray = params?.split("&") || [];
    for (const param of paramsArray) {
        const [pivotId, pivotName] = param?.split("=");

        if (pivotId === "$orderBy") {
            continue;
        }

        pivotsArray.push({ Id: pivotId, Name: pivotName });
    }

    return pivotsArray;
};

export const checkIfAdultContentMaskingRequired = (
    item: any,
    [currentStore]: any,
    isAdultMaskingEnabled: boolean
) => {
    if (
        !currentStore.IsAdult &&
        (item.isLive || item.IsLive) &&
        (item.IsAdult ||
            item?.CatalogInfo?.IsAdult ||
            item?.Schedule?.IsAdult) &&
        isAdultMaskingEnabled
    )
        return true;
    return false;
};

export const getDurationSeconds = (subscriptionItem: any): number => {
    // calculates actual runtime seconds for all recordings
    // based on actual start and actual end time
    // includes endLateSeconds setting
    return calculateActualRuntimeSeconds(
        getStartTimeIgnoreState(subscriptionItem),
        getEndTimeIgnoreState(subscriptionItem)
    );
};

export const calculateActualRuntimeSeconds = (
    actualStartUtc: Date,
    actualEndUtc: Date
): number => {
    const timeSpanSeconds =
        (actualEndUtc.getTime() - actualStartUtc.getTime()) / 1000;

    // If recording time is less than 1 min return 60 sec.
    return Math.max(timeSpanSeconds, 60);
};

export const getStartTimeIgnoreState = (subscriptionItem: any): Date => {
    // TV2 ActualAvailabilityStartUtc sometimes returns incorrect date for in-progress recordings.
    const {
        ActualAvailabilityStartUtc = undefined,
        ScheduledAvailabilityStartUtc = undefined,
    } = subscriptionItem || {};

    const useActualAvailabilityStartUtc =
        ActualAvailabilityStartUtc &&
        ActualAvailabilityStartUtc !== "0001-01-01T00:00:00Z";
    const actualStartTime: Date =
        ActualAvailabilityStartUtc && new Date(ActualAvailabilityStartUtc);
    const startTime: Date =
        useActualAvailabilityStartUtc &&
            actualStartTime &&
            !isNaN(actualStartTime.getFullYear())
            ? actualStartTime
            : new Date(ScheduledAvailabilityStartUtc);

    return startTime;
};

export const getEndTimeIgnoreState = (subscriptionItem: any): Date => {
    const { ItemState = "", ActualAvailabilityEndUtc = undefined } =
        subscriptionItem || {};
    const useActualAvailabilityEndUtc = !(
        subscriptionItem && ItemState !== DvrItemState.RECORDED
    );
    const actualEndTime: Date =
        ActualAvailabilityEndUtc && new Date(ActualAvailabilityEndUtc);
    const endTime: Date =
        useActualAvailabilityEndUtc &&
            actualEndTime &&
            !isNaN(actualEndTime.getFullYear())
            ? actualEndTime
            : getScheduledEndTime(subscriptionItem);

    return endTime;
};

function getScheduledEndTime(si: any): Date {
    return new Date(
        new Date(si?.ScheduledAvailabilityStartUtc).getTime() +
        si?.ScheduledRuntimeSeconds * 1000
    );
}


