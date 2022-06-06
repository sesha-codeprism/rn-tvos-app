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

import axios from "axios";

const GET = async ({ url, params = {}, headers = {} }: MFRequest) => {
  const axiosRequest = axios.get(url, {
    headers: {
      ...headers,
    },
    params: {
      ...params,
    },
  });
  axiosRequest.then((response: any) => {
    return response; // handle success
  });
  axiosRequest.catch(function (error: any) {
    return error; // handle error
  });
  return axiosRequest;
};

const POST = async ({ url, params = {}, headers = {} }: MFRequest) => {
  const axiosRequest = axios.post(
    url,
    {
      ...params,
    },
    {
      headers: {
        ...headers,
      },
    }
  );
  axiosRequest.then((response: any) => {
    return response; // handle success
  });
  axiosRequest.catch(function (error: any) {
    return error; // handle error
  });
  return axiosRequest;
};
const PUT = async ({ url, params = {}, headers = {} }: MFRequest) => {
  const axiosRequest = axios.put(
    url,
    {
      ...params,
    },
    {
      headers: {
        ...headers,
      },
    }
  );
  axiosRequest.then((response: any) => {
    return response; // handle success
  });
  axiosRequest.catch(function (error: any) {
    return error; // handle error
  });
  return axiosRequest;
};
const DELETE = async ({ url, headers = {} }: MFRequest) => {
  const axiosRequest = axios.delete(
    url,
    {
      headers: {
        ...headers,
      },
    }
  );
  axiosRequest.then((response: any) => {
    return response; // handle success
  });
  axiosRequest.catch(function (error: any) {
    return error; // handle error
  });
  return axiosRequest;
};

export { GET, POST, DELETE, PUT };
