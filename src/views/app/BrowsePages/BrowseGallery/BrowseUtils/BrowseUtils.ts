import { browseType, feedBaseURI, galleryFilter, ItemShowType } from "../../../../../utils/analytics/consts";
import { getBrowseFeedObject } from "../../../../../utils/assetUtils";
import { ConfigData } from "../BrowseFilters";

const { SORTBY_KEY, SHOWTYPE_KEY } = galleryFilter;

export type DefaultValuesType = {
    orderBy: string;
    pivots: string;
};

export const createInitialFilterState = (
    config: ConfigData[],
    defaultValues: DefaultValuesType
) => {
    console.log('config', config, "defaultValues", defaultValues)
    const defaultPivots = defaultValues.pivots;
    // Pivots are contained in single string e.globals. "showType|Movie,genre|Action" separate each pivot into an array element.
    const tokenizedPivots = defaultPivots?.split(",");
    // Convert the previously tokenized value into a state-compatible object. ["showType|Movie"] -> { showType: selectedIds: ["showType|Movie"] }
    return config.reduce((prev, curr) => {
        const id = curr.Id;
        const selectedIds = [];
        // OrderBy element is provided separately in default values.
        if (id === SORTBY_KEY && defaultValues.orderBy) {
            selectedIds.push(`orderBy|${defaultValues.orderBy}`);
        }
        // Create each element of object using split pivots.
        if (tokenizedPivots) {
            for (const pivot of tokenizedPivots) {
                const splitPivot = pivot?.split("|");
                if (splitPivot[0] === id) {
                    selectedIds.push(pivot);
                }
            }
        }
        return {
            ...prev,
            [id]: { selectedIds },
        };
    }, {});
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
        const libraryId = feed.Uri?.split("/").pop();
        browseFeed["Uri"] = `${browseFeedObject.uri}/${libraryId}`;
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
        browseFeedObject.params.types && browseFeedObject.params.types?.split("|");
    browseFeed["$skip"] = browseFeedObject.params.$top * page;
    browseFeed["ShowType"] =
        parsedState.showType || browseFeedObject.params.showType;
    return browseFeed;
};

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
        orderBy =
            feed.NavigationTargetUri?.split("&")[1]?.split("=")[1] ||
            browseFeedObject?.params?.$orderBy;
    }
    return {
        orderBy,
        pivots,
    };
};
