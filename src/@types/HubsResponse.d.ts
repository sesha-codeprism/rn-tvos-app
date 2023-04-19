export interface HubsResponse {
  data: FeedItem[];
  status: number;
  headers: Headers;
  config: Config;
  request: Request;
}

interface Request {
  UNSENT: number;
  OPENED: number;
  HEADERS_RECEIVED: number;
  LOADING: number;
  DONE: number;
  readyState: number;
  status: number;
  timeout: number;
  withCredentials: boolean;
  upload: Upload;
  _aborted: boolean;
  _hasError: boolean;
  _method: string;
  _perfKey: string;
  _response: string;
  _url: string;
  _timedOut: boolean;
  _trackingName: number;
  _incrementalEvents: boolean;
  _performanceLogger: PerformanceLogger;
  responseHeaders: ResponseHeaders;
  _requestId?: any;
  _headers: Headers3;
  _responseType: string;
  _sent: boolean;
  _lowerCaseResponseHeaders: Headers;
  _subscriptions: any[];
  responseURL: string;
}

interface Headers3 {
  accept: string;
}

interface ResponseHeaders {
  "x-icid": string;
  Server: string;
  "x-origin": string;
  "Content-Type": string;
  Date: string;
  "Cache-Control": string;
  "x-frame-options": string;
  "Content-Encoding": string;
  Vary: string;
  "x-result-more": string;
}

interface PerformanceLogger {
  _timespans: Timespans;
  _extras: Upload;
  _points: Points;
  _pointExtras: Upload;
  _closed: boolean;
}

interface Points {
  initializeCore_start: number;
  initializeCore_end: number;
}

interface Timespans {
  network_XMLHttpRequest_1001: NetworkXMLHttpRequest1001;
  network_XMLHttpRequest_1002: NetworkXMLHttpRequest1001;
  network_XMLHttpRequest_1003: NetworkXMLHttpRequest1001;
}

interface NetworkXMLHttpRequest1001 {
  startTime: number;
  endTime: number;
  totalTime: number;
}

interface Upload {}

interface Config {
  url: string;
  method: string;
  headers: Headers2;
  params: Params;
  transformRequest: null[];
  transformResponse: null[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  transitional: Transitional;
}

interface Transitional {
  silentJSONParsing: boolean;
  forcedJSONParsing: boolean;
  clarifyTimeoutError: boolean;
}

interface Params {
  $groups: string;
  storeId: string;
  lang: string;
  pivots: string;
}

interface Headers2 {
  Accept: string;
}

interface Headers {
  "x-icid": string;
  server: string;
  "x-origin": string;
  "content-type": string;
  date: string;
  "cache-control": string;
  "x-frame-options": string;
  "content-encoding": string;
  vary: string;
  "x-result-more": string;
}

export interface FeedItem {
  Id: string;
  Name: string;
  Feeds: Feed[];
  IsOnDemand?: boolean;
  IsApplicationHub?: boolean;
  IsProfileHub?: boolean;
}

export interface Feed {
  Id: string;
  Name: string;
  FeedType: string;
  Uri: string;
  ShowcardAspectRatio: string;
  NavigationTargetUri?: string;
  NavigationTargetText?: string;
  NavigationTargetVisibility?: string;
  Layout?: string;
  IsStacked?: boolean;
  DefaultSortType?: string;
  ShowDescription?: string;
  ShowTitle?: string;
  SearchString?: string;
}
