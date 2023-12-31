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
}

export interface MFDeviceInfo {
  deviceId?: string;
  deviceType?: string;
  tenantId?: string;
  regCode?: string| null;
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
