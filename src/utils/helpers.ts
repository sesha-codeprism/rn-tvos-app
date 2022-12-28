import { GLOBALS } from "./globals";
import { logger, consoleTransport } from "react-native-logs";
import DeviceInfo from "react-native-device-info";
import { Alert, Settings } from "react-native";
import SHA256 from "crypto-js/sha256";


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

export function convertStringToHashKey(str: string): string {
  let secretKey: string = SHA256(str).toString();
  return secretKey;
}

export function getPasscodeHash(passcode: string, accountId: string): string {
  if (!isHash(passcode)) {
    let encryptedPasscode: string = convertStringToHashKey(
      passcode + accountId
    );
    return encryptedPasscode;
  } else {
    return passcode;
  }
}

// validate string is a sha256 hash
export function isHash(str: string) {
  let sha256Regex = new RegExp(/^([a-f0-9]{64})$/);
  return sha256Regex.test(str);
}

