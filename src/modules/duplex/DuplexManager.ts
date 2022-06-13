import { bindAll } from "lodash";
import { DuplexConnection } from "./DuplexConnection";
import DuplexMessageParser from "./DuplexMessageParser";
import CanaryMessage from "./CanaryMessage";
import DuplexMessage from "./DuplexMessage";
import { StateReportingMessage, powerStates } from "./StateReportingMessage";
import { actionCreators } from "./reducers/actionCreators";
import { GLOBALS } from "../../utils/globals";
import NotificationType from "../../@types/NotificationType";
/**
 * Class used to interact with Duplex service.
 */
export class DuplexManager {
  private static _instance: DuplexManager;

  private continuationTokenFromClient: string = "";

  private connection: DuplexConnection;

  private outgoingQueue: string[] = [];

  private isFlushing: boolean = false;

  private canaryTimeoutID: number;
  private canaryTimeout: number = 30 * 1000;

  private static sentByDuplex: any = {};

  private static CANARY_REQUEST = NotificationType.CanaryRequest;
  private static CANARY_MESSAGE = NotificationType.CanaryMessage;

  private constructor() {
    bindAll(
      this,
      "onConnectionOpen",
      "onConnectionClose",
      "onConnectionMessage"
    );
    this.connection = new DuplexConnection(
      this.onConnectionOpen,
      this.onConnectionClose,
      this.onConnectionMessage
    );

    this.canaryTimeoutID = Number.NEGATIVE_INFINITY;
  }

  public dispose(): void {
    this.outgoingQueue = [];
  }

  public isDuplexConnect(): any {
    return this.connection.IsConnected();
  }

  /**
   * Return the single instance of the DuplexSocket object and creates it if it is not already created.
   */
  public static getInstance(): DuplexManager {
    console.log("************ getInstance ***************");
    if (!DuplexManager._instance) {
      try {
        DuplexManager._instance = new DuplexManager();
      } catch (e) {
        console.error(e);
      }
    }

    return DuplexManager._instance;
  }

  public setContinuationTokenFromClient(continuationTokenFromClient: string) {
    console.log(
      "**********\tcontinuationTokenFromClient:\n",
      continuationTokenFromClient
    );
    if (!continuationTokenFromClient) {
      this.continuationTokenFromClient = continuationTokenFromClient;
    }
  }

  public appSuspended(): void {
    let deviceId = GLOBALS.deviceInfo.deviceId;
    if (deviceId) {
      let stateMessage: StateReportingMessage = {
        powerState: powerStates.POWER_STATE_STANDBY,
      };
      this.sendOrEnqueueMessage(
        NotificationType.StateReportingMessage,
        stateMessage,
        deviceId
      );
    }
  }

  public appResumed(): void {
    this.connection.appResumed();
  }

  public networkOffline(): void {
    this.connection.networkOffline();
  }

  public networkOnline(): void {
    this.connection.networkOnline();
  }

  private onConnectionOpen(): void {
    if (this.connection.IsConnected()) {
      // app.dispatcher.trigger(app.Events.DUPLEX_CONNECTED);
      this.flushOutgoingQueue();
    }
  }

  private onConnectionClose(): void {
    // app.dispatcher.trigger(app.Events.DUPLEX_DISCONNECTED);
    console.log(
      `connection has closed ${this.outgoingQueue.length} messages still in the outgoing queue`
    );
  }

  private async onConnectionMessage(message: DuplexMessage): Promise<void> {
    switch (message.type) {
      case DuplexManager.CANARY_REQUEST:
        // Only send canary messages on reliable connections
        if (await this.connection.isReliable()) {
          let deviceId = GLOBALS.deviceInfo.deviceId;
          if (deviceId) {
            let canary: CanaryMessage = {
              sendTimestamp: new Date().getTime(),
            };
            this.sendOrEnqueueMessage(
              DuplexManager.CANARY_MESSAGE,
              canary,
              deviceId
            );

            this.canaryTimeoutID = setTimeout(
              this.onCanaryTimeout,
              this.canaryTimeout
            ) as any;
          } else {
            console.error("Got an empty device ID.");
          }
        }
        break;
      case DuplexManager.CANARY_MESSAGE:
        clearTimeout(this.canaryTimeoutID);

        let payload: CanaryMessage = message.payload;
        let sendTimestamp = payload.sendTimestamp;
        let receivedTimestamp = new Date().getTime();
        let latency = receivedTimestamp - sendTimestamp;

        // if (latency < this.canaryTimeout) {
        // TODO: analytics in pending implementation
        // app.dispatcher.trigger(
        //     analytics.Events.DUPLEX_CANARY_SUCCESS,
        //     <mstv.analytics.IDuplexCanaryEvent>{
        //         latencyMilliseconds: latency
        //     });
        // }
        break;
      default:
      // Trigger the event with true to not broadcast the event via duplex again.
      // if (mstv.ajax.serviceMock.getMockMode() === mstv.ajax.serviceMock.SERVICEMOCKMODE_RECORD) {
      //     mstv.ajax.serviceMock.recordDuplexMessage(message.type, message.payload);
      // }

      // app.dispatcher.trigger(message.type, message.payload, DuplexManager.sentByDuplex);
    }
  }

  private onCanaryTimeout(): void {
    // TODO: analytics in pending implementation
    // app.dispatcher.trigger(analytics.Events.DUPLEX_CANARY_FAILED);
  }

  public sendOrEnqueueMessage(
    messageType: NotificationType,
    payload = {},
    deviceId?: string
  ): void {
    const message = DuplexMessageParser.createMessage(
      messageType,
      payload,
      deviceId
    );

    if (this.connection.IsConnected()) {
      if (this.outgoingQueue.length === 0) {
        if (this.trySendMessage(message)) {
          return;
        }
      }
    }

    console.log(
      `queueing message to outgoing queue ${messageType} ${JSON.stringify(
        payload
      )}`
    );

    if (this.outgoingQueue.length > 0) {
      const lastMessage: string =
        this.outgoingQueue[this.outgoingQueue.length - 1];
      if (lastMessage === message) {
        console.log(
          `dropping message because it's already in the outgoing queue ${messageType} ${JSON.stringify(
            payload
          )}`
        );

        return;
      }
    }

    this.outgoingQueue.push(message);

    this.flushOutgoingQueue();
  }

  private trySendMessage(message: string): boolean {
    if (!this.connection.IsConnected()) {
      return false;
    }

    try {
      this.connection.sendMessage(message);
      console.warn("DuplexConnection: sending message: " + message);
      return true;
    } catch (error) {
      console.error(`failed to send message ${message} ${error} `);
      return false;
    }
  }

  /**
   * Connects to the Duplex service.
   */
  public connect(duplexUrl: string): void {
    this.connection.open(duplexUrl, this.continuationTokenFromClient);
  }

  private flushOutgoingQueue(): void {
    if (
      this.connection.IsConnected() &&
      this.outgoingQueue.length > 0 &&
      !this.isFlushing
    ) {
      this.isFlushing = true;

      while (this.connection.IsConnected() && this.outgoingQueue.length > 0) {
        let message = this.outgoingQueue.shift()!;

        if (!this.trySendMessage(message)) {
          this.outgoingQueue.unshift(message);
          break;
        }
      }

      this.isFlushing = false;
    }
  }
}
