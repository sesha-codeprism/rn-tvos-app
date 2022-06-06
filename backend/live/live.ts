import { GLOBALS } from "../../src/utils/globals";
import { parseUri } from "../utils/url/urlUtil";
const getChannelMap = async (id: string, params: Object) => {
  const res = {
    name: "live/channelMap",
    count: 20,
    response: [1, 2, 3],
  };
  return res;
};

const getCatchUp = async (id: string, params: Object) => {
  const res = {
    name: "live/getCatchUp",
    count: 20,
    response: [1, 2, 3],
  };
  return res;
};

const getFavoriteChannels = async (params?: any) => {
  const uri: string = parseUri(
    GLOBALS.bootstrapSelectors?.ServiceMap.Services.dvr || ""
  );
};

export const registerLiveUdls = () => {
  const BASE = "live";

  const subscriberUdls = [
    { prefix: BASE + "/channelMap/", getter: getChannelMap },
    { prefix: BASE + "/catchup/", getter: getCatchUp },
  ];
  return subscriberUdls;
};
