import { DeviceEventEmitter } from "react-native";
import { MFRequest } from "../../@types/globals";

export interface IUrlParams {
  pivots?: string[];
}

export interface IUrlParamValues {
  [index: string]: IUrlParamValue;
}

export interface IUrlParamValue {
  value: any;
  updateIfPresent?: boolean; // Default true
  allowBlankParam?: boolean; // Default false
  encodeValue?: boolean; // Default true
}

import axios, { AxiosHeaders } from "axios";

const showNotification = (error: any) => {
  DeviceEventEmitter.emit("createNotification", {
    id: new Date(),
    iconName: "dismiss",
    subtitle: error?.message,
  });
};

const handleError = (error: any) => {
  //console.log("Handling error", error);
  //TODO: Activate this
  // showNotification(error);
  // throw Error(error);
};

const GET = async ({ url, params = {}, headers = {} }: MFRequest) => {
  try {
    const axiosRequest = axios.get(url, {
      headers: {
        ...headers,
      } as AxiosHeaders,
      params: {
        ...params,
      },
    });
    axiosRequest.then((response: any) => {
      return response; // handle success
    });
    axiosRequest.catch(function (error: any) {
      handleError(error);
      return error;
      // return error; // handle error
    });
    return axiosRequest;
  } catch (err) {
    handleError(err);
  }
};

const POST = async ({ url, params = {}, headers = {} }: MFRequest) => {
  try {
    const axiosRequest = axios.post(
      url,
      {
        ...params,
      },
      {
        headers: {
          ...headers,
        } as AxiosHeaders,
      }
    );
    axiosRequest.then((response: any) => {
      return response; // handle success
    });
    axiosRequest.catch(function (error: any) {
      handleError(error);
      // return error; // handle error
    });
    return axiosRequest;
  } catch (err) {
    handleError(err);
  }
};
const PUT = async ({ url, params = {}, headers = {} }: MFRequest) => {
  try {
    const axiosRequest = axios.put(
      url,
      {
        ...params,
      },
      {
        headers: {
          ...headers,
        } as AxiosHeaders,
      }
    );
    axiosRequest.then((response: any) => {
      return response; // handle success
    });
    axiosRequest.catch(function (error: any) {
      handleError(error);
      // return error; // handle error
    });
    return axiosRequest;
  } catch (err) {
    handleError(err);
  }
};
const DELETE = async ({ url, headers = {} }: MFRequest) => {
  try {
    const axiosRequest = axios.delete(url, {
      headers: {
        ...headers,
      } as AxiosHeaders,
    });
    axiosRequest.then((response: any) => {
      return response; // handle success
    });
    axiosRequest.catch(function (error: any) {
      handleError(error);
      // return error; // handle error
    });
    return axiosRequest;
  } catch (err) {
    handleError(err);
  }
};

export { GET, POST, DELETE, PUT };
