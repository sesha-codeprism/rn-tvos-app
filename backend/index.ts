import {
  massageDiscoveryFeed,
  massageDVRFeed,
  massageSubscriberFeed,
} from "../src/utils/assetUtils";
import { SourceType } from "../src/utils/common";
import { GLOBALS } from "../src/utils/globals";
import { registerUdls, parseUdl, getList, UdlProviders } from "./udl/provider";

export const enum UDLType {
  Subscriber = "subscriber",
  Discovery = "discovery",
  DVRProxy = "dvrproxy",
  Live = "live",
}

export const initUdls = () => {
  registerUdls();
};

export const getDataFromUDL = async (
  udl: string,
  shouldSendParams: boolean = true
) => {
  const udlParsed: any = parseUdl(udl);
  if (shouldSendParams) {
    console.log("shouldSendParams", udlParsed);
    return getList(udlParsed.id, udlParsed.params);
  } else {
    return getList(udlParsed.id);
  }
};

export const getMassagedData = (uri: string, data: any) => {
  const udlID = parseUdl(uri);
  if (udlID!.id.split("/")[0] === "discovery") {
    const hasDataItems = data.data.Items;
    if (!hasDataItems) {
      const dataSource = { Items: data.data };
      const massagedData = massageDiscoveryFeed(dataSource, SourceType.VOD);
      return massagedData;
    } else {
      const massagedData = massageDiscoveryFeed(
        data.data,
        SourceType.VOD,
        GLOBALS.nowNextMap
      );
      return massagedData;
    }
  } else if (udlID!.id.split("/")[0] === "subscriber") {
    const hasDataItems = data.data.LibraryItems;
    if (!hasDataItems) {
      const dataSource = { LibraryItems: data.data };
      const massagedData = massageSubscriberFeed(
        dataSource,
        "",
        SourceType.VOD
      );
      return massagedData;
    } else {
      const massagedData = massageSubscriberFeed(data.data, "", SourceType.VOD);
      return massagedData;
    }
  } else if (udlID!.id.split("/")[0] === "search") {
    const hasDataItems = data.data.Items;
    if (!hasDataItems) {
      const dataSource = { Items: data.data };
      const massagedData = massageDiscoveryFeed(dataSource, SourceType.VOD);
      return massagedData;
    } else {
      const massagedData = massageDiscoveryFeed(
        data.data,
        SourceType.VOD,
        GLOBALS.nowNextMap
      );
      return massagedData;
    }
  }
  // else if (udlID!.id.split("/")[0] === 'dvrproxy') {
  //   const massagedData = massageDVRFeed(data.data, SourceType.DVR, "", undefined, false);
  //   return massagedData;
  // }
  else {
    return data;
  }
};
