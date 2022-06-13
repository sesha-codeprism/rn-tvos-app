export interface MFEnvironmentGlobals {
  url: string;
  stsUrl: string;
}
export interface MFGlobals {
  environment: MFEnvironmentGlobals;
  serviceURL: {
    discovery: string;
  };
}

export interface MFRequest {
  url: string;
  params?: Object;
  headers?: Object;
}

export interface MFbootstrapLandingInfo {
  oauth?: string;
  tenantId?: string;
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
