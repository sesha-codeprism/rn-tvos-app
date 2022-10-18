import * as _ from "lodash";
import { ImageSourcePropType } from "react-native";
import { FeedItem } from "../@types/HubsResponse";
import { networkImageType } from "./analytics/consts";
import { ContentType } from "./common";

export type feedType = FeedItem | any;

type networkImageType = keyof typeof networkImageType;

export const getNetworkImageUri = (
    item: any,
    imageType: networkImageType
): ImageSourcePropType | string | undefined => {
    const updatedUri = item[imageType]?.Uri;

    return updatedUri ? { uri: updatedUri } : undefined;
};

// This block is used to specify how genres, title searchs/tring and show type
// match to showcard fallback images. This allows us to fill in the gaps in
// the guide for those schedules that have not been matched to universal data.

interface IGenreImage {
    path: string;
    size: any;
}

interface IGenreItem {
    genres: string[];
    images: IGenreImage[];
}

interface IGenreSearchStringItem {
    searchStrings: string[];
    images: IGenreImage[];
}

interface IGenreShowTypeItem {
    showTypes: ContentType[];
    images: IGenreImage[];
}

interface IGenreMapping {
    genreMap: IGenreItem[];
    searchStringMap?: IGenreSearchStringItem[];
    showTypeMap: IGenreShowTypeItem[];
}


function pickBestMatch(matches: any): string {
    let minErrorObj = null;
    if (matches.length) {
        minErrorObj = matches[0];
        for (let i = 1; i < matches.length; i++) {
            minErrorObj =
                matches[i].error < minErrorObj.error ? matches[i] : minErrorObj;
        }
        return minErrorObj.uri;
    }
    return "";
}

function filterAspectRatio(requiredSize: any) {
    const requiredRatio = requiredSize.width / requiredSize.height;
    return (image: IGenreImage): boolean =>
        Math.round((image.size.width / image.size.height) * 10) ===
        Math.round(requiredRatio * 10);
}

// CONSIDER passing in a key to get `images`, then memoize this function.
export function getGenreImagePath(
    images: IGenreImage[],
    requiredSize: any
): string {
    const matches: { error: number; uri: string }[] = []; // assets that have the required image type and a size equal to or greater than desired
    const mismatches: { error: number; uri: string }[] = []; // assets that do not fulfill these criteria

    // Only get the images that are similar to the required image which is achieved by comparing the aspect ratios
    const matchingImages = _.filter(images, filterAspectRatio(requiredSize));

    const requiredArea = requiredSize.width * requiredSize.height;
    _.each(matchingImages || images, (obj) => {
        const dw = obj.size.width - requiredSize.width;
        const dh = obj.size.height - requiredSize.height;
        const error = Math.abs(requiredArea - obj.size.width * obj.size.height);
        const match = { error, uri: obj.path };
        if (dw >= 0 && dh >= 0) {
            matches.push(match);
        } else {
            mismatches.push(match);
        }
    });

    return pickBestMatch(matches) || pickBestMatch(mismatches) || "";
}




function findShowcardForSearchString(
    title: string,
    genreSearchStringMap: IGenreSearchStringItem[],
    size: any
): string {
    let showcard = "";

    if (genreSearchStringMap) {
        for (const searchStringItem of genreSearchStringMap) {
            if (searchStringItem.searchStrings) {
                for (const searchString of searchStringItem.searchStrings) {
                    if (
                        searchStringItem &&
                        title.indexOf(searchString) !== -1
                    ) {
                        showcard = getGenreImagePath(
                            searchStringItem.images,
                            size
                        );
                    }
                }
            }
        }
    }

    return showcard;
}

function findShowcardForShowType(
    showType: ContentType,
    genreShowTypeMap: IGenreShowTypeItem[],
    size: any
): string {
    let showcard = "";

    if (genreShowTypeMap) {
        for (const showTypeItem of genreShowTypeMap) {
            if (showTypeItem && showTypeItem.showTypes.indexOf(showType) > -1) {
                showcard = getGenreImagePath(showTypeItem.images, size);
            }
        }
    }

    return showcard;
}

