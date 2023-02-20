//@ts-nocheck
import {
  MFbootstrapLandingInfo,
  MFDeviceInfo,
} from "../../backend/@types/globals";
import { UserAccountInfo } from "../@types/Account";
import { BootStrapResponse } from "../@types/BootStrapResponse";
import { UserProfile } from "../@types/UserProfile";
import { BrowseGallery } from "./common";

export const landingInfo = (function (): MFbootstrapLandingInfo {
  this.oauth = "liveid";
  this.tenantId = "default";
  this.version = "";

  const setOauth = (auth: string) => {
    this.oauth = auth;
    return this;
  }

  const setTenant = (tenant: string) => {
    this.tenantId = tenant;
    return this;
  }

  const setVersion = (v: string) => {
    this.version = v;
    return this;
  }

  const reviveLandingInfo = (serializedInstance: any) => {
    if (serializedInstance) {
      this.oauth = serializedInstance?.oauth;
      this.tenantId = serializedInstance?.tenantId;
      this.version = serializedInstance?.setVersion;
    }
    return this;
  }
  return {
    reviveLandingInfo,
    setOauth,
    setTenant,
    setVersion,
    oauth: this.oauth,
    tenantId: this.tenantId,
    version: this.version
  }
})();
export interface CreateUserProfileObject {
  name: string;
  image: string;
  optOutPersonalDataUse: boolean;
}
export interface EditUserProfileObject {
  Id: string;
  Name: string;
  Image: string;
  AdditionalFields: { optOutPersonalDataUse: boolean };
  UserCreated: boolean;
  // optOutPersonalDataUse: boolean;
}
interface ParentalControll {
  contentLock: { [key: string]: any };
  adultLock: { [key: string]: any };
  purchaseLock: any;
}
interface Ratings {
  action: string;
  age: number;
  subTitle: string;
  title: string;
}

export interface TrendingItems {
  Name: string,
  Elements: string
}

interface OnScreenLanguage {
  title: string;
  languageCode: string;
  enableRTL: boolean;
}
interface GLOBALSType {
  /** Information about the device running the app */
  deviceInfo: MFDeviceInfo;
  /** Bootstrap response coming from backend */
  bootstrapSelectors: BootStrapResponse | null;
  /** Structure being used to create user profile */
  createUserProfile: CreateUserProfileObject;
  /** Structure being used to update user profile */
  editUserProfile: UserProfile;
  /** Structure being used to store user profile for Global use */
  userProfile?: UserProfile;
  /** Token for Duplex connectivity */
  continuationToken: string;
  /** Root navigation */
  rootNavigation: any;
  /** Should the UI be RTL */
  enableRTL: boolean;
  /** ChannelRights Info */
  channelRights: any;
  /** User account info  */
  userAccountInfo: UserAccountInfo;
  allSubscriptionGroups: any;
  viewableSubscriptions: any;
  scheduledSubscriptions: any
  browseGalleryData?: BrowseGallery;
  currentSlots: any
  channelMap: any
  recorders: any
  /** Current Now-Next Map updated every three hours time */
  nowNextMap: any;
  moviesAndTvShows?: TrendingItems[];
  /** Async store data */
  store: {
    accessToken: string | null;
    refreshToken: string | null;
    userProfile?: UserProfile;
    rightsGroupIds: string | null;
    accountID: string;
    settings: {
      parentalControll: ParentalControll;
      display: {
        subtitleConfig: {
          primary: string;
          secondary: string;
          tracks: string[];
        };
        bitrates10ft: any;
        onScreenLanguage: OnScreenLanguage;
        closedCaption: any;
      };
      audio: {
        audioLanguages: {
          primary: string;
          secondary: string;
          tracks: string[];
        };
        descriptiveAudio: string;
      };
    };
  } | null;
  [key: string]: any;
}
/** GLOBAL config where all runtime constants are stored */
export const GLOBALS: GLOBALSType = {
  trans: "en",
  deviceInfo: {
    deviceId: "c-a34d8e5a-a0558797-22855546b4",
    deviceType: "AppleTV",
    tenantId: landingInfo.tenantId,
    regCode: null
  },
  currentSlots: undefined,
  channelMap: undefined,
  createUserProfile: { image: "", name: "", optOutPersonalDataUse: false },
  editUserProfile: {
    Name: "",
    Id: "",
    Image: "",
    AdditionalFields: { optOutPersonalDataUse: "false" },
    UserCreated: true,
  },
  enableRTL: false,
  rootNavigation: null,
  bootstrapSelectors: null,
  continuationToken: "",
  browseGalleryData: {
    page: 0,
    lastPageReached: false,
    itemFeed: [],
    filterData: {},
  },
  moviesAndTvShows: [],
  store: null,
  storeID: undefined,
};

export const resetAuthData = () => {
  return {
    ...GLOBALS.store,
    accessToken: null,
    refreshToken: null,
    userProfile: undefined

  }
};

export const deleteUserSettings = () => {
  return {
    ...GLOBALS.store,
    userProfile: undefined,
    rightsGroupIds: null,
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
          title: "English (US)",
          languageCode: "en-US",
          enableRTL: false
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

  }
}
