import {
  massageDiscoveryFeed,
  massageDVRFeed,
  massageSubscriberFeed,
} from "../src/utils/assetUtils";
import { SourceType } from "../src/utils/common";
import { GLOBALS } from "../src/utils/globals";
import { registerUdls, parseUdl, getList, UdlProviders } from "./udl/provider";

export const enum UDLType {
  /** Key for all subscriber UDLS */
  Subscriber = "subscriber",
  /** Key for all discovery UDLS */
  Discovery = "discovery",
  /** Key for all dvrproxy UDLS */
  DVRProxy = "dvrproxy",
  /** Key for all live UDLS */
  Live = "live",
}

/**
 * Function to register all UDLS and hash into UdlProvider
 */
export const initUdls = () => {
  registerUdls();
};

/**
 * Function to parse given UDL string and fetch data from backend
 * @param {udl} udl - Required UDL string. 
 * @param {shouldSendParams} shouldSendParams - Used to specify if params obj should be sent to backend  Defaults to true 
 */
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

/**
 * Function to parse and massage backend data based on udl type
 * @param {uri} uri - Request uri  Used to decide on massage logic
 * @param {data} data - Backend response
 */
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
