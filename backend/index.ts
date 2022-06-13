import { registerUdls, parseUdl, getList } from "./udl/provider";

export const initUdls = () => {
  registerUdls();
};

export const getDataFromUDL = async (udl: string) => {
  const udlParsed: any = parseUdl(udl);
  return getList(udlParsed.id, udlParsed.params);
};
