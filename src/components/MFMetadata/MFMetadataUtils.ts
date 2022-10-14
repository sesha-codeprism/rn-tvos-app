import React from 'react';
import { View } from 'react-native';
import { SubscriberFeed } from '../../@types/SubscriberFeed';
import { appUIDefinition } from '../../config/constants';
import { getNetworkInfo } from '../../utils/assetUtils';
import { replacePlaceHoldersInTemplatedString } from '../../utils/strings';
import { chooseRating, metadataSeparator } from '../../utils/Subscriber.utils';

export enum MetadataType { "text", "image", "icon" }

export function getMetadataLine1(templateString: string, item: SubscriberFeed): { type: MetadataType | undefined, metadataLine1: string } {
    let metadataLine1: string = '';
    let metadataType: MetadataType | undefined = undefined;
    if (!templateString.toLowerCase().includes('image') && !templateString.toLowerCase().includes('icon')) {
        metadataType = MetadataType.text;
    } else if (templateString.toLowerCase().includes('image')) {
        metadataType = MetadataType.image
    } else {
        metadataType = MetadataType.icon
    }
    metadataLine1 = getResolvedMetadata(templateString, item)
    return { type: metadataType, metadataLine1: metadataLine1 };
}


export function getResolvedMetadata(templateString: string, item: any): string {
    if (!item) {
        return "";
    }
    let callLetter = undefined, channelNumber = undefined, image = undefined;
    const releaseYear = item.ReleaseYear || item.CatalogInfo?.ReleaseYear || "";
    const contentRatings = chooseRating(
        item.Ratings || item.CatalogInfo?.Ratings
    );

    if (item?.Schedule?.channel) {
        callLetter = `${item?.Schedule?.channel?.CallLetters}`
        channelNumber = `${item?.Schedule?.channel?.Number}`
    }
    if (item?.CatalogInfo && item.CatalogInfo.Network) {
        image = getNetworkInfo(item).tenFootLargeURL.uri;
    }
    const replacements = { ReleaseYear: releaseYear, Ratings: contentRatings, CallLetter: callLetter, ChannelNumber: channelNumber, Image: image, Name: item?.title }
    const replacedString = replacePlaceHoldersInTemplatedString(templateString, replacements);
    const filteredString = replacedString.split(" ").filter((e) => !e.includes('null'));
    if (templateString.trim().split(" ").length > 1) {
        return filteredString.join(metadataSeparator);
    } else {
        return filteredString.join(" ");

    }

}