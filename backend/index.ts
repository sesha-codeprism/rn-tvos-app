import { SourceType } from "../src/utils/common";
import { massageDiscoveryFeed } from "../src/utils/DiscoveryUtils";
import { massageSubscriberFeed } from "../src/utils/Subscriber.utils";
import { registerUdls, parseUdl, getList, UdlProviders } from "./udl/provider";

export const initUdls = () => {
  registerUdls();
};

export const getDataFromUDL = async (udl: string, shouldSendParams: boolean = true) => {
  const udlParsed: any = parseUdl(udl);
  if (shouldSendParams) {
    return getList(udlParsed.id, udlParsed.params);
  } else {
    return getList(udlParsed.id);

  }
};

export const getMassagedData = (uri: string, data: any) => {
  const udlID = parseUdl(uri);
  if (udlID!.id in UdlProviders) {
    if (udlID!.id.split("/")[0] === 'discovery') {
      const hasDataItems = data.data.Items;
      if (!hasDataItems) {
        const dataSource = { Items: data.data }
        const massagedData = massageDiscoveryFeed(dataSource, SourceType.VOD);
        return massagedData;
      } else {
        const massagedData = massageDiscoveryFeed(data.data, SourceType.VOD);
        return massagedData;
      }
    } else if (udlID!.id.split("/")[0] === 'subscriber') {
      const massagedData = massageSubscriberFeed(data.data, "", SourceType.VOD);
      return massagedData;
    }
  } else {
    return undefined;
  }
}
