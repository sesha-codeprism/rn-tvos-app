import { MFGlobalsConfig } from "../configs/globals";
import { MFGlobals, MFDeviceInfo } from "../@types/globals";
import { GET, POST } from "../utils/common/cloud";
import { addAuthToken } from "../utils/auth/authUtil";
import { parseUri } from "../utils/url/urlUtil";
import { GLOBALS } from "../../src/utils/globals"
import { Routes } from "../../src/config/navigation/RouterOutlet";

// export const getShortCodeAuthenticate = async (deviceInfo: MFDeviceInfo) => {
//   const globalConfig: MFGlobals = MFGlobalsConfig;
//   const url: string =
//     parseUri(globalConfig.environment.stsUrl) + "/request-token";
//   const response = await POST({
//     url: url,
//     params: deviceInfo,
//   });
//   return response;
// };

export const getShortCodeAuthenticate = async ({ queryKey } : any) => {
  const [, landingResponse, deviceInfo] = queryKey;
  
  if(landingResponse && landingResponse?.data && landingResponse.data?.data?.sts && deviceInfo){
    const url: string = parseUri(landingResponse.data?.data?.sts ) + "/request-token";
    const response = await POST({
      url: url,
      params: deviceInfo,
    });
    return response?.data;
  }else {
    return null;
  }
};


export const getLanding = async ({ queryKey } : { queryKey : string[] } ) => {
  const [_, url] = queryKey;
  const envUrl: string = parseUri(url) + "/landing.json";
  const response = await GET({
    url: envUrl
  });
  return response;
}

export const getBootStrap = async ({ queryKey } : any) => {
  const [, bootstrapUrl, token] = queryKey;
  if(bootstrapUrl && token){
    const response = await GET({
      url: bootstrapUrl,
      headers: addAuthToken(token)
    });
    return response;
  }else {
    return null;
  }
};

export const processBootStrap = async (data: any, deviceType: string) => {
  let serviceMap = data?.ServiceMap;
  let servicePrefix = serviceMap?.Prefixes;
  let services = serviceMap?.Services;
  let currentPrefix = servicePrefix?.[deviceType];
  //TODO: Parse All URL and put in globalConfig  //let parsed = new URL(services.defaultAccHostName)
  // parsed.host = currentPrefix + parsed.host;
  // let defaultAccHostName = parseUri(parsed.href);
  return;
};
