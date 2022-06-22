import { GLOBALS } from "./globals";
import { logger, consoleTransport } from "react-native-logs";
import DeviceInfo from "react-native-device-info";
import { Settings } from "react-native";


export const Log =
  __DEV__ && global && global.console
    ? console.log.bind(global.console)
    : () => { };

export const updateStore = (MFStore: string) =>
  /** Removing Async Store code. Switching to React Native default Settings API */
  // AsyncStorage.setItem("MFStore", MFStore).then(() => {
  //   Log("Update Store: ", GLOBALS.store);
  // }
  Settings.set({ store: MFStore });

export const getStore = () => Settings.get("store");
// AsyncStorage.getItem("MFStore");


export const getGloablStore = () => GLOBALS.store;

export const Logger = logger.createLogger({
  severity: "debug",
  async: true,
  dateFormat: "time",
  printLevel: true,
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: consoleTransport,
  transportOptions: {
    color: "ansi", // custom option that color consoleTransport logs
  },
});

export const infoLog = (message: any, level: number = 1) => {
  if (__DEV__) {
    switch (level) {
      case 0:
        Logger.debug(message);
        break;
      case 1:
        Logger.info(message);
        break;
      case 2:
        Logger.warn(message);
        break;
      case 3:
        Logger.error(message);
        break;
    }
  }
};

export const isSimulator = () => {
  return DeviceInfo.isEmulator();
};


export const getIdFromURI = (uri: string): string => {
  return uri?.replace(/\/$/, "").split("/").pop() || "";
};

export const isFeatureAssigned = (feature: string) => {
  return GLOBALS.bootstrapSelectors!.Features.filter((e) => e!.toLowerCase()).length > 0;
}
