import _ from "lodash";
import { GLOBALS } from "./globals";

export enum DvrItemState {
    INVALID = "Invalid",
    PENDING_ADD = "PendingAdd",
    PENDING_UPDATE = "PendingUpdate",
    PENDING_DELETE = "PendingDelete",
    SCHEDULED = "Scheduled",
    CONFLICTS = "Conflicts",
    CANCELED = "Canceled",
    RECORDING = "Recording",
    RECORDED = "Recorded",
    UNAVAILABLE = "Unavailable",
    DELETED = "Deleted",
    EXPIRING = "Expiring",
}

export const Definition = {
    SINGLE_TIME : "SingleTime",
    SINGLE_PROGRAM : "SingleProgram",
    SERIES : "Series",
    GENERIC_PROGRAM : "GenericProgram",
}

export function recurringSubscriptionIsInConflict(subscriptionGroup: any) {
    // Group is in conflict if any item is in conflict
    for (let subscriptionItem of subscriptionGroup.SubscriptionItems) {
        if (isItemInConflictedState(subscriptionItem)) {
            return true;
        }
    }
    return false;
}

export function isItemInConflictedState(subscriptionItem: any) {
    return subscriptionItem.ItemState === DvrItemState.CONFLICTS;
}

export function getSeriesOrProgramId(subscriptionGroup: any) {
    return (
        subscriptionGroup &&
        ((subscriptionGroup).SeriesId ||
            (subscriptionGroup?.SubscriptionItems &&
                subscriptionGroup?.SubscriptionItems[0] &&
                subscriptionGroup?.SubscriptionItems[0].ProgramId))
    );
}

function getOnlyProgramId(
    subscriptionGroup: any,
    seriesOrProgramId: any
) {
    return (
        subscriptionGroup &&
        subscriptionGroup?.SubscriptionItems &&
        subscriptionGroup.SubscriptionItems.find(
            (item:  any) =>
                item?.ProgramId === seriesOrProgramId
        )?.ProgramId
    );
}

export function isValidSubscriptionGroup(subscriptionGroup: any){
    return (
        subscriptionGroup?.SubscriptionItems &&
        subscriptionGroup?.SubscriptionItems.length > 0 &&
        [
            Definition.SINGLE_PROGRAM,
            Definition.SERIES,
            Definition.GENERIC_PROGRAM,
        ].includes(subscriptionGroup.Definition)
    );
}

export function findConflictedGroupBySeriesOrProgramId(
    seriesOrProgramId: any,
    subscriptionGroups: any
) {
    return subscriptionGroups && subscriptionGroups.length
        ? subscriptionGroups
              .filter((subscriptionGroup : any) =>
                  isValidSubscriptionGroup(subscriptionGroup)
              )
              .filter(
                  (subscriptionGroup: any) =>
                      getOnlyProgramId(subscriptionGroup, seriesOrProgramId) ===
                          seriesOrProgramId ||
                      getSeriesOrProgramId(subscriptionGroup) ===
                          seriesOrProgramId
              )
              .filter(recurringSubscriptionIsInConflict)
        : [];
}


export function getMetaDataOfItem(
    scheduledItem: any
) {
    const channels = GLOBALS.channelMap
    const scheduledItemChannel = channels?.findChannelByNumber(
        scheduledItem.ChannelNumber
    );
    const scheduledItemChannelName = scheduledItemChannel?.channel
        ? scheduledItemChannel?.channel.Name
        : "";

    let {
        SeasonNumber = undefined,
        EpisodeNumber = undefined,
        EpisodeTitle = undefined,
        Title = undefined,
    } = scheduledItem.ProgramDetails || {};

    const itemInfo =
        SeasonNumber && EpisodeNumber && EpisodeTitle
            ? `S${SeasonNumber} E${EpisodeNumber} ${EpisodeTitle}`
            : `${scheduledItem.ChannelNumber} ${scheduledItemChannelName}`;

    const airTime = new Date(scheduledItem.StartTime);
    const day = airTime.toLocaleDateString("en-GB", { day: "2-digit" });
    const month = airTime.toLocaleString("default", { month: "short" });
    const dayOfWeek = airTime.toLocaleDateString("en-GB", {
        weekday: "long",
    });
    const twelveHourTime = airTime.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    let metaData: any = {
        meta1: _.truncate(Title, {
            length: 25,
            separator: " ",
        })
    };

    metaData.meta2 = `${itemInfo} . ${day} ${month}, ${dayOfWeek}  ·  ${twelveHourTime}`;
    metaData.meta2 = _.truncate(metaData.meta2, {
        length: 40,
        separator: " ",
    });

    return metaData;
};

export function getMetaDataOfSubscriptionItem(
    scheduledItem: any,
    willDiscard: boolean
){
    const channels = GLOBALS.channelMap;
    let scheduledItemChannel = channels?.findChannelByNumber(
        scheduledItem.ChannelNumber
    );

    let {
        SeasonNumber = undefined,
        EpisodeNumber = undefined,
        EpisodeTitle = undefined,
        Title = undefined,
    } = scheduledItem?.ProgramDetails || {};

    let shortDescription = "";
    let longDescription = scheduledItemChannel
        ? `${scheduledItemChannel.Number} ${scheduledItemChannel.CallLetters}`
        : "";

    if (scheduledItem.Definition === Definition.SERIES) {
        shortDescription = `${Definition.SERIES}: ${Title || ""}`;
    } else if (scheduledItem?.Definition === Definition.SINGLE_PROGRAM) {
        shortDescription =
            EpisodeTitle || (SeasonNumber && EpisodeNumber)
                ? `S${SeasonNumber} E${EpisodeNumber}`
                : Title || "";
        longDescription += " . ";

        const airTime = new Date(scheduledItem.StartTime);
        const day = airTime?.toLocaleDateString("en-GB", {
            day: "2-digit",
        });
        const month = airTime?.toLocaleString("default", {
            month: "short",
        });
        const dayOfWeek = airTime?.toLocaleDateString("en-GB", {
            weekday: "long",
        });

        longDescription += `${day} ${month}, ${dayOfWeek}  ·  ${airTime.toLocaleString(
            "en-US",
            { hour: "numeric", minute: "numeric", hour12: true }
        )}`;
    } else if (scheduledItem?.Definition === Definition.GENERIC_PROGRAM) {
        shortDescription = Title || "";
    }

    return {
        meta1: shortDescription,
        meta2: _.truncate(longDescription, {
            length: 34,
            separator: " ",
        })
    };
};


export function getScheduledItems(scheduledSubGrps: any): any[] {
    if (scheduledSubGrps && scheduledSubGrps.length > 0) {
        let dvrScheduledItems: any[] = [];
        scheduledSubGrps.forEach((subscriptionGroup: any): void => {
            subscriptionGroup.SubscriptionItems.forEach(
                (subscriptionItem: any) => {
                    if(subscriptionItem?.ItemState === DvrItemState.SCHEDULED || subscriptionItem?.ItemState === DvrItemState.CONFLICTS || subscriptionItem?.ItemState === DvrItemState.RECORDING || subscriptionItem?.ItemState === DvrItemState.RECORDED  ){
                        let item: any = {};
                        item.Id = subscriptionItem.Id;
                        item.SubscriptionId = subscriptionGroup.Id;
                        item.ProgramId = subscriptionItem.ProgramId;
                        item.SeriesId = subscriptionGroup.SeriesDetails
                            ? subscriptionGroup.SeriesDetails.SeriesId
                            : "";
                        item.StartTime =
                            subscriptionItem.ScheduledAvailabilityStartUtc;
                        item.StationId = subscriptionItem.StationId;
                        item.ProgramDetails = subscriptionItem.ProgramDetails;
                        item.State = subscriptionItem.ItemState;
                        item.Conflict = subscriptionItem.Conflict;
                        item.ChannelNumber = subscriptionGroup.Settings
                            ? subscriptionGroup.Settings.ChannelNumber ||
                              (subscriptionItem.Settings
                                  ? subscriptionItem.Settings.ChannelNumber
                                  : 0)
                            : 0;
                        item.Definition = subscriptionGroup.Definition;
                        if (subscriptionGroup.ExternalId) {
                            item.SubscriptionExternalId =
                                subscriptionGroup.ExternalId;
                        }
                        dvrScheduledItems.push(item);
                    }
                }
            );
        });
        return dvrScheduledItems;
    }
    return [];
}