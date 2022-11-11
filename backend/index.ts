import { registerUdls, parseUdl, getList } from "./udl/provider";

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
