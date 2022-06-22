import { MFGlobalsConfig } from "../configs/globals";
import { MFGlobals, MFDeviceInfo } from "../@types/globals";
import { GET, POST } from "../utils/common/cloud";
import { addAuthToken } from "../utils/auth/authUtil";
import { parseUri } from "../utils/url/urlUtil";

export const getShortCodeAuthenticate = async (deviceInfo: MFDeviceInfo) => {
  const globalConfig: MFGlobals = MFGlobalsConfig;
  const url: string =
    parseUri(globalConfig.environment.stsUrl) + "/request-token";
  const response = await POST({
    url: url,
    params: deviceInfo,
  });
  return response;
};

export const getBootStrap = async (token: string | null) => {
  const globalConfig: MFGlobals = MFGlobalsConfig;
  const url: string = parseUri(globalConfig.environment.stsUrl) + "/bootstrap";
  const response = await GET({
    url: url,
    headers: addAuthToken(token),
  });
  return response;
};

export const processBootStrap = async (data: any, deviceType: string) => {
  let serviceMap = data.ServiceMap;
  let servicePrefix = serviceMap.Prefixes;
  let services = serviceMap.Services;
  let currentPrefix = servicePrefix[deviceType];
  //TODO: Parse All URL and put in globalConfig  //let parsed = new URL(services.defaultAccHostName)
  // parsed.host = currentPrefix + parsed.host;
  // let defaultAccHostName = parseUri(parsed.href);
  return;
};
