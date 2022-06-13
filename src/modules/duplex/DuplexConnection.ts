import DuplexMessage from "./DuplexMessage";
import DuplexMessageParser from "./DuplexMessageParser";
import { generateGUID } from "../../utils/guid";
import { GLOBALS } from "../../utils/globals";
import { appUIDefinition } from "../../config/constants";

export enum WebsocketCloseCodes {
  CLOSE_NORMAL = 1000,
  CLOSE_GOING_AWAY = 1001,
  CLOSE_PROTOCOL_ERROR = 1002,
  CLOSE_UNSUPPORTED = 1003,
  CLOSE_NO_STATUS = 1005,
  CLOSE_ABNORMAL = 1006,
  UNSUPPORTED_DATA = 1007,
  POLICY_VIOLATION = 1008,
  CLOSE_TOO_LARGE = 1009,
  MISSING_EXTENSION = 1010,
  INTERNAL_ERROR = 1011,
  SERVICE_RESTART = 1012,
  TRY_AGAIN_LATER = 1013,
  TLS_HANDSHAKE = 1015,
}

export class DuplexConnection {
  private static RETRY_BACKOFF_FACTOR = 1000; // ms
  private static RETRY_JITTER = 25; // percentage
  private static MAX_ALLOWED_ATTEMPTS: number = 5;
  private _duplexEndpoint: string;

  public IsConnected(): boolean {
    if (this._isConnected) {
      if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
        console.log(
          "invalid isConnected state, readyState = " +
          (this.webSocket && this.webSocket.readyState)
        );
        this._isConnected = false;
      }
    } else if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
      console.log(
        "invalid isConnected false state, readyState = " +
        this.webSocket.readyState
      );
      this._isConnected = true;
    }

    return this._isConnected;
  }

  private numberOfAttempts: number = 0;

  private webSocket: WebSocket | null;
  private _onOpenCallback: () => void;
  private _onCloseCallback: () => void;
  private _onMessageCallback: (message: DuplexMessage) => void;

  private isConnecting: boolean;
  private _isConnected: boolean;

  /**
   * A flag to track if the application has network connectivity right now.
   */
  private isOnline: boolean;

  private isSuspended: boolean;

  private loadTimer: number | undefined = undefined;

  private sessionId: string;

  private heartbeatInterval: number;
  private heartbeatTimer: number;
  private heartbeatCheckTimer: number = -1;
  public static HEARTBEAT: string = "HB";
  private static HEARTBEAT_DEFAULT_INTERVAL_MILLISECONDS: number = 120 * 1000;
  private static CONTINUATION_TOKEN_STORAGE_KEY: string =
    "duplex_continuationToken";
  private static HEARTBEAT_MAX_SERVER_RESPONSE_TIME: number = 5 * 1000;

  constructor(
    onOpenCallback: () => void,
    onCloseCallback: () => void,
    onMessageCallback: (message: DuplexMessage) => void
  ) {
    this.sessionId = generateGUID();

    this._onOpenCallback = onOpenCallback;
    this._onCloseCallback = onCloseCallback;
    this._onMessageCallback = onMessageCallback;

    this.heartbeatInterval = this.getHeartbeatInterval();

    // listen for lifecycle events
    this.isSuspended = false;
    this.webSocket = null;
    this._duplexEndpoint = "";
    this.isConnecting = false;
    this._isConnected = false;
    this.isOnline = false;
    this.heartbeatTimer = Number.MIN_SAFE_INTEGER;
  }

  public dispose(): void {
    if (this.webSocket) {
      this.webSocket.close(1000, "disposed");
    }
  }

  public async isReliable(): Promise<boolean> {
    //! Only STBs are considered to have a reliable connections,
    //! so only use their stats for telemetry purposes.
    //! Currently app is developed for Apple TV exclusively, so returning true directly.
    //! Change the code incase above is not true;
    // const formFactor = await udlSelector.config.deviceType(this.storeInstance!.getState());
    // return formFactor === DeviceType.TV.toString();

    return true;
  }

  public sendMessage(message: string): void {
    this.webSocket!.send(message);

    console.log(`sent message ${message} to webSocket`);
  }

  private getHeartbeatInterval(): number {
    return DuplexConnection.HEARTBEAT_DEFAULT_INTERVAL_MILLISECONDS;
  }

  private onWebSocketOpen(): void {
    console.log("onOpenDuplexSocket() " + this.webSocket!.readyState);

    this._isConnected = this.webSocket!.readyState === WebSocket.OPEN;
    this.isConnecting = false;
    if (this.IsConnected()) {
      this._onOpenCallback();
    }

    this.heartbeatTimer = setInterval(
      () => this.sendHeartbeat(),
      this.heartbeatInterval
    ) as any;
  }

  private onWebSocketClose(ev: WebSocketCloseEvent): void {
    console.log("onErrorDuplexSocket() an error occured." + JSON.stringify(ev));
    if (ev.code !== WebsocketCloseCodes.CLOSE_NORMAL) {
      let code: string = !!ev.code
        ? WebsocketCloseCodes[ev.code] || ev.code.toString()
        : "event code not specified";

      console.log(
        "socket closed " +
        ev.reason +
        ": " +
        code +
        " connecting: " +
        this.isConnecting +
        " connected: " +
        this._isConnected
      );

      // Unfortunately CLOSE_GOING_AWAY is overloaded and could be caused by navigation events, so filter it out for now.
      // TODO: dependency on analytics(pending implementation)
      // if (this.isReliable && ev.code !== WebsocketCloseCodes.CLOSE_GOING_AWAY) {
      //     app.dispatcher.trigger(
      //         analytics.Events.DUPLEX_CONNECTION_LOST,
      //         <analytics.IDuplexConnectionLostEvent>{
      //             closeCode: ev.code,
      //             closeReason: ev.reason
      //         });
      // }
    }

    this.isConnecting = false;
    this._isConnected = false;
    this._onCloseCallback();

    this.stopHeartbeats();

    this.reconnectWithBackOff();
  }

  private onWebSocketError(ev: WebSocketErrorEvent): void {
    // not terribly useful, as onclose will always be called.
    console.log("onErrorDuplexSocket() an error occured." + JSON.stringify(ev)); // ev.message is undefined.
  }

  private onWebSocketMessage(ev: WebSocketMessageEvent): void {
    console.log(`received message - ${ev.data}`);

    this.restartHeartbeat();

    if (!ev) {
      console.warn("onWebSocketMessage() ignoring null event");
      return;
    }

    if (ev.data === DuplexConnection.HEARTBEAT) {
      this.onHeartBeat();
      return;
    }
    const parsedMessage = DuplexMessageParser.parse(ev.data);
    let message: DuplexMessage;
    if (parsedMessage) {
      message = parsedMessage;
      this._onMessageCallback(message);
    } else {
      console.warn(`onWebSocketMessage() invalid message received ${ev.data}`);
      return;
    }
  }

  private reconnectWithBackOff(): void {
    console.log("reconnectWithBackOff()");
    if (!this.isOnline) {
      console.log(
        `reconnectWithBackOff(): isOnline = ${this.isOnline} returning`
      );
      return;
    }
    if (this.isSuspended) {
      console.log(
        `reconnectWithBackOff(): isSuspended = ${this.isSuspended} returning`
      );
      return;
    }
    if (this.isConnecting) {
      console.log(
        `reconnectWithBackOff(): isConnecting = ${this.isConnecting} returning`
      );
      return;
    }
    if (this._isConnected) {
      console.log(
        `reconnectWithBackOff(): isConnected = ${this._isConnected} returning`
      );
      return;
    }
    if (this.loadTimer) {
      console.log("reconnectWithBackOff(): loadTimer is valid returning");
      return;
    }

    this.numberOfAttempts++;

    if (this.numberOfAttempts <= DuplexConnection.MAX_ALLOWED_ATTEMPTS) {
      let jitter =
        (Math.random() * DuplexConnection.RETRY_JITTER * 2 -
          DuplexConnection.RETRY_JITTER) /
        100; // +/- RETRY_JITTER %
      let delay =
        Math.pow(2, this.numberOfAttempts) *
        (DuplexConnection.RETRY_BACKOFF_FACTOR * (1 + jitter));

      console.warn(
        `reconnect scheduled in ${delay} ms numberOfAttempts = ${this.numberOfAttempts}`
      );
      this.loadTimer = setTimeout(
        () => this.open(this._duplexEndpoint, ""),
        delay
      ) as any;
    } else {
      console.log(
        `reconnectWithBackOff(): numberOfAttempts = ${this.numberOfAttempts} exceeded MAX_ALLOWED_ATTEMPTS = ${DuplexConnection.MAX_ALLOWED_ATTEMPTS}`
      );
      this.reconnect();
    }
  }

  private reconnect(): void {
    console.log("reconnect()");

    // reset attempt counts. a client losing network access is not a server issue.
    this.numberOfAttempts = 0;

    // force a reconnect, to avoid lingering not-really-connected states.
    this.reconnectWithBackOff();
  }

  private closeWebSocket(msg: string): void {
    console.log("closeWebSocket");
    clearTimeout(this.loadTimer);
    this.loadTimer = undefined;

    this.isConnecting = false;
    if (this.IsConnected() && this.webSocket) {
      this.webSocket.close(1000, msg);
      this._isConnected = false;
      this.stopHeartbeats();
    }
  }

  public networkOffline(): void {
    console.log("network went offline");

    this.isOnline = false;
    this.closeWebSocket("network offline");
  }

  public networkOnline(): void {
    console.log("network went online");

    this.isOnline = true;
    this.reconnect();
  }

  public appSuspended(): void {
    console.log("application suspended");

    this.isSuspended = true;

    this.closeWebSocket("application suspended");
  }

  public appResumed(): void {
    console.log("application resumed");

    this.isSuspended = false;

    this.reconnect();
  }

  /**
   * Opens a WebSockets connection to the Duplex service.
   */
  public async open(
    duplexEndpoint: string,
    continuationTokenFromClient: string
  ) {
    console.log(`open(): isConnected =  ${this.IsConnected()}`);

    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = undefined;
    }

    if (!duplexEndpoint) {
      return;
    } else {
      this._duplexEndpoint = duplexEndpoint;
    }
    let continuationToken: string | undefined = "";
    if (continuationTokenFromClient) {
      continuationToken = continuationTokenFromClient;
    } else {
      continuationToken = GLOBALS.continuationToken;
    }

    const continuationTokenParamString = continuationToken
      ? `&continuationToken=${continuationToken}`
      : "";
    duplexEndpoint += `?sessionId=${this.sessionId}${continuationTokenParamString}`;

    if (this.webSocket) {
      if (
        this.webSocket.readyState === WebSocket.OPEN ||
        this.webSocket.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      // attempt last-ditch cleanup.
      try {
        this.webSocket.close(1000, "cleanup");
      } catch (e) { }

      this.webSocket = null;
    }

    this.isConnecting = true;

    try {
      const headers = {
        Cookie: `access-token=${GLOBALS.store.accessToken}`,
        Origin: `${appUIDefinition.config.protocol}://${appUIDefinition.config.hostname}`,
      };
      console.log("Sending headers", headers);

      this.webSocket = new WebSocket(encodeURI(duplexEndpoint), null, { headers });

      this.webSocket.onopen = () => this.onWebSocketOpen();
      this.webSocket.onclose = (ev: WebSocketCloseEvent) =>
        this.onWebSocketClose(ev);
      this.webSocket.onerror = (ev: WebSocketErrorEvent) =>
        this.onWebSocketError(ev);
      this.webSocket.onmessage = (ev: WebSocketMessageEvent) =>
        this.onWebSocketMessage(ev);
    } catch (e: any) {
      console.log(
        "failed to create the webSocket: " + e.name + ": " + e.message
      );
      this.webSocket = null;
      this.isConnecting = false;
      this.reconnectWithBackOff();
    }
  }

  private onHeartBeat(): void {
    clearTimeout(this.heartbeatCheckTimer);
  }

  private sendHeartbeat(): void {
    console.log("sending heartbeat");
    this.sendMessage(DuplexConnection.HEARTBEAT);
    this.heartbeatCheckTimer = setTimeout(() => {
      console.log(
        "no heartbeat response during " +
        DuplexConnection.HEARTBEAT_MAX_SERVER_RESPONSE_TIME +
        "ms"
      );

      this.closeWebSocket("No heartbeat response detected");
      this.reconnectWithBackOff();
    }, DuplexConnection.HEARTBEAT_MAX_SERVER_RESPONSE_TIME) as unknown as any;
  }

  private restartHeartbeat(): void {
    clearInterval(this.heartbeatTimer);
    clearTimeout(this.heartbeatCheckTimer);
    this.heartbeatTimer = setInterval(
      () => this.sendHeartbeat(),
      this.heartbeatInterval
    ) as any;
  }

  private stopHeartbeats(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      clearTimeout(this.heartbeatCheckTimer);
      console.log("heartbeats stopped");
    }
  }
}
