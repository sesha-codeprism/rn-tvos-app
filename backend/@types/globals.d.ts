export interface MFEnvironmentGlobals {
  url: string;
  stsUrl: string;
}
export interface MFGlobals {
  environment: MFEnvironmentGlobals;
}

export interface MFRequest {
  url: string;
  params?: Object;
  headers?: Object;
}

export interface MFbootstrapLandingInfo {
  oauth?: string;
  tenantId?: string;
  version?: string;
  setTenant?: (string) => void;
  setOauth?: (string) => void;
  setVersion?: (string) => void;
  reviveLandingInfo?: (any) => MFbootstrapLandingInfo;
}

export interface MFDeviceInfo {
  deviceId?: string;
  deviceType?: string;
  tenantId?: string;
}

export interface MFRequestToken {
  registrationCode?: string;
  maxRetryTime?: number;
  nextCheckInterval?: number;
  registrationURL?: string;
  status?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpires?: string;
}
