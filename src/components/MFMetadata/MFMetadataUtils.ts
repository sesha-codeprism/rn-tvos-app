import React from 'react';
import { View } from 'react-native';
import { SubscriberFeed } from '../../@types/SubscriberFeed';
import { appUIDefinition } from '../../config/constants';
import { getNetworkInfo } from '../../utils/assetUtils';
import { replacePlaceHoldersInTemplatedString } from '../../utils/strings';
import { chooseRating, metadataSeparator } from '../../utils/Subscriber.utils';

/** Enum to specify the type of metadata element */
export enum MetadataType { "text", "image", "icon" }


/**
 * Function to retrieve the metadata information from the template string based on the provided subscriberFeed information
 * @param {string} templateString - The template string that specifies what metadata is to be rendered.
 * @param {SubscriberFeed} item - Subsciber feed information.
 * @returns {Object} Returns an Object with metadata type and resolved metadata to be rendered
 */
export function getMetadataInfo(templateString: string, item: SubscriberFeed): { type: MetadataType | undefined, metadataInfo: string } {
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
    return { type: metadataType, metadataInfo: metadataLine1 };
}


/**
 * Function to resolve metadata based on template string and Subscriber feed information
 * @param {string} templateString - The template string that specifies what metadata is to be rendered.
 * @param {SubscriberFeed} item - Subsciber feed information.
 * @returns {string} Returns the metadata string with template string replaced by supplied information.
 */
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
        image = getNetworkInfo(item)?.tenFootLargeURL?.uri;
    }
    const replacements = { ReleaseYear: releaseYear, Ratings: contentRatings, CallLetter: callLetter, ChannelNumber: channelNumber, Image: image, Name: item?.title || item?.Name || item?.CatalogInfo?.Name || item?.EpisodeName }
    const replacedString = replacePlaceHoldersInTemplatedString(templateString, replacements);
    const filteredString = replacedString.split(" ").filter((e) => !e.includes('null'));
    if (templateString.trim().split(" ").length > 1) {
        return filteredString.join(metadataSeparator);
    } else {
        return filteredString.join(" ");

    }

}