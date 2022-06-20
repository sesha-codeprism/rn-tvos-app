import {
  MFbootstrapLandingInfo,
  MFDeviceInfo,
} from "../../backend/@types/globals";
import { BootStrapResponse } from "../@types/BootStrapResponse";
import { UserProfile } from "../@types/UserProfile";

export const landingInfo: MFbootstrapLandingInfo = {
  oauth: "liveid",
  tenantId: "default",
};
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
  /** Async store data */
  store: {
    accessToken: string | null;
    refreshToken: string | null;
    title: string | null;
    userProfile?: UserProfile
    rightsGroupIds: string | null;
  };
  [key: string]: any;
}
/** GLOBAL config where all runtime constants are stored */
export const GLOBALS: GLOBALSType = {
  trans: "en",
  deviceInfo: {
    deviceId: "c-a34d8e5a-a0558797-22855546b4",
    deviceType: "AppleTV",
    tenantId: landingInfo.tenantId,
  },
  createUserProfile: { image: "", name: "", optOutPersonalDataUse: false },
  editUserProfile: {
    Name: "",
    Id: "",
    Image: "",
    AdditionalFields: { optOutPersonalDataUse: 'false' },
    UserCreated: true,
  },
  bootstrapSelectors: null,
  continuationToken: "",
  store: {
    accessToken: null,
    refreshToken: null,
    title: null,
    userProfile: undefined,
    rightsGroupIds: null,
  },
  storeID: undefined
};

export const resetGlobalStore = () => {
  GLOBALS.store = {
    accessToken: null,
    refreshToken: null,
    title: null,
    rightsGroupIds: null,
    userProfile: undefined
  };
};
