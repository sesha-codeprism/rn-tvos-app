import { ImageSourcePropType } from "react-native";
import { appUIDefinition } from "../config/constants";
import {
  ContentType,
  Definition,
  encodings,
  feedType,
  imageMappingObject,
  IPlayAction,
  ItemShowType,
  ItemType,
  orderedQualityLevels,
  padLeft,
  ShowType,
  SourceType,
} from "./common";
import { GLOBALS } from "./globals";
import { getNetworkImageUri } from "./images";



export const metadataSeparator = "  ·  ";

export enum BookmarkType {
  VOD,
  CATCHUP,
  RECORDING
}

export interface IBookmark {
  SeriesId: string | null | undefined;
  RecordingId: string | null | undefined;
  OriginalProgramId: string | null | undefined;
  TimeSeconds: number | null | undefined;
  ProgramId: string | null | undefined;
  RuntimeSeconds: number | null | undefined;
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


export function durationInDaysHoursMinutes(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const mins = Math.floor((((seconds % (24 * 3600)) / 3600) % 1) * 60);

  return `${days ? days + "d " : ""}${hours ? hours + "h " : ""}${mins ? mins + "m" : seconds ? seconds + "s " : ""
    }`;
}

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

function makeTypeString(
  contentType: ContentType | null,
  sourceType: SourceType | null
): string | null {
  if (!contentType || !sourceType) {
    return null;
  }
  const ct = ContentType[contentType];
  const st = SourceType[sourceType];

  if (!ct || !st) {
    return null;
  }
  return ct + "-" + st;
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
      ? startTime - (rangeStartTime ? rangeStartTime.getTime() : Date.now())
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

interface AssetSourceAndContentType {
  itemType: string | null;
  contentType: string | null;
  sourceType: string | null;
}

export function generateType(
  item: { [index: string]: any },
  sourceType?: SourceType | null
): AssetSourceAndContentType {
  if (!item || typeof item !== "object") {
    return {
      itemType: null,
      contentType: null,
      sourceType: null,
    };
  }

  const _isEpisode = (): boolean => {
    const catalogInfo = item.CatalogInfo;
    const schedule = item.schedule;
    const episodeNumber =
      item.EpisodeNumber ||
      (item.CatalogInfo && item.CatalogInfo.EpisodeNumber) ||
      (item.Schedule && item.Schedule.EpisodeNumber) ||
      (item.ProgramDetails && item.ProgramDetails.EpisodeNumber) ||
      (item.Schedule && item.Schedule.SeriesId) ||
      item.SeriesId ||
      (item?.SeriesDetails && item?.Definition === Definition.SERIES);

    if (episodeNumber && episodeNumber !== "") {
      return true;
    }

    const episodeName =
      item.EpisodeName ||
      (catalogInfo && catalogInfo.EpisodeName) ||
      (schedule && item.Schedule.EpisodeName);
    if (episodeName && episodeName !== "") {
      return true;
    }

    return false;
  };

  const _isProgram = (): boolean => {
    return (
      !!(
        item.ProgramId ||
        (item.CatalogInfo && item.CatalogInfo.UniversalProgramId) ||
        item.UniversalProgramId ||
        (item.Schedule && item.Schedule.ProgramId)
      ) ||
      (item.CatalogInfo && item.CatalogInfo.UniversalProgramId)
    );
  };

  const _isPPV = (): boolean => {
    return !!item.isPPV;
  };

  const _isProfile = (): boolean => {
    return (
      item.hasOwnProperty("UserCreated") ||
      item.hasOwnProperty("AdditionalFields")
    );
  };

  if (!sourceType) {
    sourceType = null;
    if (item && item.RecordingId) {
      sourceType = SourceType.DVR;
    }
  }


  const _isSingleTime = (): boolean => {
    return item.Definition === Definition.SINGLE_TIME;
  };

  let contentType: ContentType | null = null;
  const itemType = <string>item.ItemType;
  if (_isSingleTime()) {
    contentType = ContentType.SINGLETIME;
  } else if (itemType === ItemType.PACKAGE) {
    // package
    contentType = ContentType.PACKAGE;
  } else if (itemType === ItemType.PERSON) {
    // person
    contentType = ContentType.PERSON;
  } else if (
    itemType === ItemType.STORE ||
    (itemType === ItemType.APPLICATION && item.Usage === "Store")
  ) {
    // store
    contentType = ContentType.STORE;
  } else if (itemType === ItemType.APPLICATION) {
    // app
    contentType = ContentType.APP;
  } else if (item.StationType === "Application") {
    // live app channel
    contentType = ContentType.APP;
    if (sourceType !== SourceType.NETFLIX) {
      // for Netflix App, we need to define sourceType
      sourceType = null;
    }
  } else if (itemType === ItemType.DEVICEAPP) {
    contentType = ContentType.DEVICEAPP;
  } else if (itemType === ItemType.RECOMM) {
    // Recommendations
    contentType = ContentType.RECOMM;
  } else if (itemType === ItemType.SVODPACKAGE) {
    // SvodPackage
    contentType = ContentType.SVODPACKAGE;
  } else if (itemType === ItemType.SETTINGS) {
    // For Settings launched as FilmStrip
    contentType = ContentType.SETTINGS;
  } else if (itemType === ItemType.CATCHUP) {
    if (_isEpisode()) {
      contentType = ContentType.EPISODE;
      sourceType = SourceType.CATCHUP;
    } else if (_isProgram() || item.ShowType === ShowType.MOVIE) {
      // some catchup movie doesn't have programId
      contentType = ContentType.PROGRAM;
      sourceType = SourceType.CATCHUP;
    } else if (item.IsGeneric) {
      // In case user searches a Generic Series, a Series call is made to discovery
      if (item.EntityType === ItemShowType.Series) {
        contentType = ContentType.SERIES;
        sourceType = null;
      } else {
        contentType = ContentType.GENERIC;
      }
    } else if (item.EntityType === ItemShowType.Program) {
      contentType = ContentType.PROGRAM;
    } else {
      contentType = ContentType.SERIES;
    }
  } else if (itemType === ItemType.LIVESERIES) {
    // LIVE SERIES
    contentType = ContentType.SERIES;
    sourceType = SourceType.LIVE;
  } else if (_isEpisode()) {
    // episode
    contentType = ContentType.EPISODE;
  } else if (_isProgram()) {
    // program
    if (item.IsGeneric || item?.Schedule?.IsGeneric) {
      contentType = ContentType.GENERIC; // generic show
    } else if (item.OfferId && item.ResourceType === "ServiceCollection") {
      // ppv offer
      contentType = ContentType.OFFER;
    } else if (_isPPV()) {
      contentType = ContentType.PPVEVENT;
    } else {
      contentType = ContentType.PROGRAM;
    }
  } else if (itemType === ItemType.SERIES || item.SeriesId || item.Seasons) {
    // series
    contentType = ContentType.SERIES;
    if (sourceType === SourceType.PERSON) {
      sourceType = SourceType.VOD;
    }
  } else if (itemType === ItemType.CHANNEL || item?.ChannelInfo) {
    // channel
    contentType = ContentType.CHANNEL;
  } else if (item.OfferId) {
    contentType = ContentType.OFFER;
  } else if (_isProfile()) {
    contentType = ContentType.PROFILES;
  } else if (_isPPV()) {
    contentType = ContentType.PPVEVENT;
  } else if (itemType === ItemType.LIVEPROGRAM) {
    contentType = ContentType.PROGRAM;
    sourceType = SourceType.LIVE;
  } else if (item.AdditionalFields) {
    contentType = ContentType.PROFILE;
  } else if ("PasscodeType" in item) {
    contentType = ContentType.PASSCODE;
  } else if (sourceType === SourceType.LIVE && !contentType) {
    contentType = ContentType.GENERIC;
  } else {
    contentType = ContentType.PROGRAM;
    if (!sourceType) {
      sourceType = SourceType.VOD;
    } else if (
      itemType === ItemType.PROGRAM &&
      sourceType === SourceType.PERSON
    ) {
      sourceType = SourceType.VOD;
    }
  }

  if (sourceType === null && contentType) {
    return {
      itemType: null,
      contentType: ContentType[contentType],
      sourceType: null,
    };
  }

  return {
    itemType: makeTypeString(contentType, sourceType),
    contentType: ContentType[contentType],
    sourceType: sourceType && SourceType[sourceType],
  };
}

export const filterUsablePlayActions = (action: any): boolean => {
  return (
    action.VideoProfile &&
    action.VideoProfile.Encoding in encodings &&
    action.VideoProfile.QualityLevel in orderedQualityLevels
  );
};

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

export function chooseRating(ratings: any): string {
  if (!ratings || !Array.isArray(ratings)) {
    return "";
  }

  let value = "";

  // const ratingProvidersObject = global.lStrings?.str_rating_providers || {};

  // Get the first rating whose System is valid.
  ratings.some((rating: any): boolean => {
    //TODO: Complete setup for Locales and language selection;
    value = rating.Value;
    return true;

  });

  // Otherwise pick the first. There's generally only one anyway.
  if (!value && ratings?.length) {
    value = ratings[0].Value;
  }

  return value || "";
}

export function fromSecondsToHHMMSS(value: string | number) {
  let sec = typeof value === "string" ? parseInt(value, 10) : value;
  sec = Math.round(sec);
  const hours = Math.floor(sec / 3600); // get hours
  const minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  const seconds = sec - hours * 3600 - minutes * 60; //  get seconds
  return `${padLeft(hours)}:${padLeft(minutes)}:${padLeft(seconds)}`;
}


type aspectRatio = keyof typeof imageMappingObject;

export const findImage = (
  images: { Size: string; Uri: string }[],
  size: string
) => {
  return images.find((img) => {
    return img.Size === size;
  });
};

const getConstructedImageUri = (item: feedType, aspectRatio: aspectRatio) => {
  const serviceMap = GLOBALS.bootstrapSelectors?.ServiceMap.Services!;
  const imgBase = serviceMap.image;
  const imgType = item.ItemType ? item.ItemType : "person";

  return (
    imgBase +
    "/" +
    item.ImageBucketId +
    "/" +
    imgType +
    "/" +
    item.Id +
    "/" +
    imageMappingObject[aspectRatio]
  ).toLowerCase();
};

export const placeholder = (data: any) => {
  if (data?.ItemType === ItemShowType.App)
    return { uri: `res://drawable/default/PlaceHolder_${data?.Name}.png` };
};

export const getImageUri = (
  item: feedType,
  aspectRatio: aspectRatio
): ImageSourcePropType | string | undefined => {
  const images =
    item?.Images ||
    item?.CatalogInfo?.Images ||
    item?.SeriesDetails?.Images ||
    (item?.SubscriptionItems?.length &&
      item?.SubscriptionItems[0].ProgramDetails.Images);
  const supportedImages =
    item?.SupportedImages ||
    item?.CatalogInfo?.SupportedImages ||
    item?.SeriesDetails?.SupportedImages ||
    (item?.SubscriptionItems?.length &&
      item?.SubscriptionItems[0].ProgramDetails.SupportedImages);

  if (images?.length && supportedImages?.length) {
    const image = findImage(images, "Medium") || findImage(images, "Small");
    if (image?.Uri) {
      let uri = image.Uri;
      const last = uri.substring(uri.lastIndexOf("/") + 1, uri.length);
      let updatedUri;

      if (
        supportedImages?.length &&
        supportedImages[0] === "3x4/KeyArt"
      ) {
        updatedUri = uri.replace(
          last,
          imageMappingObject[supportedImages[0]]
        );
        return updatedUri ? { uri: updatedUri } : undefined;
      }
      if (supportedImages.indexOf(aspectRatio) !== -1) {
        updatedUri = uri.replace(last, imageMappingObject[aspectRatio]);
      }
      return updatedUri ? { uri: updatedUri } : undefined;
    }
  }

  if (
    !images &&
    (item?.ItemType == "Person" || item?.hasOwnProperty("PersonId")) &&
    item?.SupportedImages?.indexOf(aspectRatio) !== -1 &&
    item?.ImageBucketId
  ) {
    let constructedImageUri = getConstructedImageUri(item, aspectRatio);
    return { uri: constructedImageUri };
  }

  return undefined;
};




