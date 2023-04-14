import { GLOBALS, landingInfo } from "./globals";
import { logger, consoleTransport } from "react-native-logs";
import DeviceInfo from "react-native-device-info";
import { Alert, Settings } from "react-native";
import SHA256 from "crypto-js/sha256";
import { MFGlobalsConfig } from "../../backend/configs/globals";

export const Log =
  __DEV__ && global && global.console
    ? console.log.bind(global.console)
    : () => { };

export const updateStore = (MFStore: any) => {
  const sanitizedStore = {
    ...MFStore,
    landingInfo: { ...landingInfo },
    MFGlobalsConfig: { ...MFGlobalsConfig },
    playerSessionSettings: null //  player session  settings should not be persisted in localstorage
  };
  Settings.set({ store: JSON.stringify(sanitizedStore) });
  GLOBALS.store = getStore();
};

export let getStore = () => {
  let serializedStore = Settings.get("store");
  if (serializedStore) {
    serializedStore = JSON.parse(serializedStore);
    //@ts-ignore
    serializedStore.landingInfo = landingInfo?.reviveLandingInfo?.(
      serializedStore.landingInfo
    );
    if (
      serializedStore.MFGlobalsConfig &&
      serializedStore.MFGlobalsConfig.url
    ) {
      MFGlobalsConfig.stsUrl = serializedStore.MFGlobalsConfig.stsUrl;
      MFGlobalsConfig.url = serializedStore.MFGlobalsConfig.url;
    }
    serializedStore.MFGlobalsConfig = MFGlobalsConfig;
    return serializedStore;
  } else {
    return {
      MFGlobalsConfig: MFGlobalsConfig,
      landingInfo: {
        oauth: null,
        tenantId: null,
        version: null,
      },
      accessToken: null,
      refreshToken: null,
      userProfile: undefined,
      rightsGroupIds: null,
      accountID: "",
      settings: {
        parentalControll: {
          contentLock: {},
          adultLock: {},
          purchaseLock: {},
        },
        display: {
          subtitleConfig: {
            primary: "en",
            secondary: "fr",
            tracks: ["en", "fr", "es", "de", "sa", "hi", "kn", "pt"],
          },
          bitrates10ft: {},
          onScreenLanguage: {
            title: "",
            languageCode: "",
            enableRTL: false,
          },
          closedCaption: "",
        },
        audio: {
          audioLanguages: {
            primary: "en",
            secondary: "fr",
            tracks: ["en", "fr", "es", "de", "sa", "hi", "kn", "pt"],
          },
          descriptiveAudio: "",
        },
      },
    };
  }
};

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
  return (
    GLOBALS.bootstrapSelectors!.Features.filter((e) => e!.toLowerCase())
      .length > 0
  );
};

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

export const generateColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0');
  return `#${randomColor}`;
};

