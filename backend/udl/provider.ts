import { registerDiscoveryUdls } from "../discovery/discovery";
import { registerSubscriberUdls } from "../subscriber/subscriber";
import { getUrlParts, getQueryParams, parseUri } from "../utils/url/urlUtil";
import { registerLiveUdls } from "../live/live";
import { registerDVRProxyUdls } from "../dvrproxy/dvrproxy";

export const UdlProviders: any = {};
export const udlList: any = {}

const accumulateUdls = (...listProviders: any) => {
  for (let i = 0; i < listProviders.length; i++) {
    let udl = listProviders[i];
    let prefix = parseUri(udl.prefix.toString());
    UdlProviders[prefix] = { getter: udl.getter };
    udlList[prefix] = { prefix: prefix, getter: udl.getter }
  }
  console.log(UdlProviders, "udlList", udlList);
};

export const registerUdls = () => {
  accumulateUdls(
    ...registerDiscoveryUdls(),
    ...registerSubscriberUdls(),
    ...registerLiveUdls(),
    ...registerDVRProxyUdls(),
  );
};

export const parseUdl = (uri: string) => {
  if (!uri || typeof uri !== "string") {
    return;
  }
  let parts = getUrlParts(uri);
  if (!parts) {
    return;
  }

  let params = parts.query.substring(1) || "{}";
  let parsedParams: any;
  try {
    parsedParams = JSON.parse(params);
  } catch (e) { }

  if (!parsedParams) {
    parsedParams = getQueryParams(params);
    // ensure "false" isn't used because a boolean check of val if val is "false" will be true
    // since we don't know which params are booleans and which are strings, leave "true" as a strings since it is truthy.
    // Any params which are expected to be strings with the value "false" will no longer return  that value
    Object.keys(parsedParams).forEach((key: string) => {
      if (parsedParams[key].toLowerCase() === "false") {
        parsedParams[key] = false;
      } else if (parsedParams[key].toLowerCase() === "true") {
        parsedParams[key] = true;
      }
    });
  }

  return {
    id: parseUri(parts.host + parts.path),
    params: parsedParams,
  };
};

export const splitId = (
  itemId: string
): {
  prefix: string;
  id: string;
  params?: { [index: string]: any };
  mergeList?: { [index: string]: any };
} => {
  let i = itemId.indexOf("/["); // look for merged items' mergeList array.
  let mergeList = null;
  let params = null;
  if (i > -1) {
    try {
      mergeList = JSON.parse(itemId.substring(i + 1));
    } catch (error) { }

    itemId = itemId.substring(0, i);
  }
  i = itemId.indexOf("/{"); // look for list params
  if (i > -1) {
    try {
      params = JSON.parse(itemId.substring(i + 1));
    } catch (error) { }
    itemId = itemId.substring(0, i);
  }
  i = itemId.lastIndexOf("/");
  const prefix = itemId.substring(0, i);
  const id = itemId.substring(i + 1);
  return { prefix: prefix, id: id, params: params, mergeList: mergeList };
};

export const getList = (listId: string, params?: any) => {
  let obj: { prefix: string; id: string; mergeList?: any; params?: any };
  if (listId in UdlProviders) {
    obj = { prefix: listId, id: "" };
  } else {
    obj = splitId(listId);
  }
  let currentProvider = UdlProviders[obj.prefix];
  if (currentProvider) {
    if (currentProvider.getter) {
      return currentProvider.getter(obj.id, params || obj.params || {});
    } else {
      throw new Error("No getter set for the current provider");
    }
  } else {
    throw new Error("No current Provider.");
  }
};
