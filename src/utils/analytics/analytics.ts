import { extend } from "lodash";
import { isAppleTv } from "./app";
import { navigationAction, routeHistory } from "./consts";
import DeviceInfo from 'react-native-device-info';
import { config } from "../../config/config";
import { Route } from "react-native";
import { getSizeInBytes } from "../dataUtils";
import { GLOBALS } from "../globals";
import { sendAnalyticsReport } from "../../../backend/analytics/analytics";

type EventObj =
    | IPlayoutMetricsEvent
    | IPlaybackMetricsEvent
    | IPlayEvent
    | IErrorsEvent
    | INavEvent
    | IAnalyticsPostHeader
    | IAnalyticsEvent;

/// List of all performance events being listened to.
export const Events = {
    PLAYBACK_STARTED: "playStarted", // when player really starts after buffering. Slightly different timing from app.Events.PLAYBACK_STARTED, which is when we enter the playback view, before buffering
    PLAYBACK_ENDED: "playStopped", // to indicate play stopped
    PLAYBACK_RESTARTED: "playRestarted", // to indicate user restarted playback
    PLAYBACK_STATE: "playbackState", // log analytics playback state change
    LIVE_BOUNDARY_CROSS: "programBoundaryCross",
    SHELL_EVENT: "analytics:shellEvent",
    SEARCH: "searchStarted",
    SEARCH_RESULT_SELECTED: "searchSelected",
    LIST_VIEW_UPDATED: "listViewUpdated", // list view (i.e. favorite or dvr page) updated
    DVR_EVENT: "analytics:DVREvent", // log a DVR event
    PURCHASE_EVENT: "analytics:purchaseActionHappened",
    RESTART_EVENT: "analytics:restartEvent",
    PPV_EVENT: "analytics:PPVActionHappened",
    SETTING_EVENT: "userModifiedSettingOptions",
    STREAM_MGMT_PREFLIGHT_TUNE: "analytics:StreamMgmtPreflightTune",
    STREAM_MGMT_CURRENT_USAGE_EVALUATED:
        "analytics:StreamMgmtCurrentUsageEvaluated",
    STREAM_MGMT_CURRENT_USAGE_CONTENTION:
        "analytics:StreamMgmtCurrentUsageContention",
    STREAM_MGMT_PROVISIONAL_TUNE: "analytics:StreamMgmtProvisionalTune",
    STREAM_MGMT_STOP_RECORDING: "analytics:StreamMgmtStopRecording",
    STREAM_MGMT_WANPROFILE_UPDATED: "analytics:StreamMgmtWanProfileUpdated",
    STREAM_MGMT_REBOOT: "analytics:StreamMgmtBoot",
    HUB_EVENT: "analytics:userClickedHubTab",
    FEED_EVENT: "analytics:userClickedFeedTab",
    EXTERNAL_REQUEST_EVENT: "analytics:externalRequest",
    LOCALDVR_RECORDER_INITIALIZED: "analytics:LocalDVRRecoderInitialized", // CONSIDER: spelling incorrect - is this the correct name?
    LOCALDVR_PAUSEBUFFER_TRUNCATED: "analytics:LocalDVRPauseBufferTruncated",
    LOCALDVR_SCHEDULEITEM_RECEIVED: "analytics:LocalDVRScheduleItemReceived",
    LOCALDVR_RECORDINGACTION_EXECUTED:
        "analytics:LocalDVRRecordingActionExecuted",
    LOCALDVR_DISKMONITOR_EVENT: "analytics:DVRDiskMonitorEvent",
    LOCALDVR_DISKMONITOR_RECORDINGABORTED:
        "analytics:DVRDiskMonitorRecordingAborted",
    LOCALDVR_DISKMONITOR_RECORDINGSTOPPED:
        "analytics:DVRDiskMonitorRecordingStoped", // CONSIDER: spelling incorrect - is this the correct name?
    LOCALDVR_RECORDER_RECONCILIATION: "analytics:RecorderReconciliationResult",
    DVR_SCHEDULER_PERFORMANCE: "analytics:DvrSchedulerPerformance",
    DVR_SCHEDULER_DATA_ERROR: "analytics:DvrSchedulerDataError",
    CURRENT_DIALOG_LOADED: "analytics:CurrentDialogLoaded",
    PAGE_DRAWN: "analytics:pagedrawn",
    FILTER_SET: "analytics:filterIsSet",
    CRASH_LOG: "analytics:CrashLog",
    PAGINATED_CONTENT: "analytics:PaginatedContent",
    PLAYON: "analytics:PlayOn",
    TIMESHIFT_FAILURE: "analytics:TimeShiftFailure",
    VOICE_EVENT: "analytics:Voice",
    INTENT_EVENT: "analytics:Intent",
    SEARCH_INTENT_EVENT: "analytics:SearchIntentEvent",
    DUPLEX_CANARY_SUCCESS: "analytics:duplex:canary:success",
    DUPLEX_CANARY_FAILED: "analytics:duplex:canary:failed",
    DUPLEX_CONNECTION_LOST: "analytics:duplex:connection:lost",
    DVR_USER_INTERACTION: "analytics:dvrUserInteraction",
    EAS_SUCCESS: "analytics:eas:success",
    EAS_FAILED: "analytics:eas:failed",
    DOWNLOAD_EVENTS_TRIGGERED: "analytics:download:triggered",
    DOWNLOAD_EVENTS_ON_ERROR: "analytics:download:error",
    CHROMECAST_EVENTS_TRIGGERED: "analytics:chromecast:triggered",
    CHROMECAST_EVENTS_ON_ERROR: "analytics:chromecast:error",
    CURRENT_GEOFENCE: "analytics:geofence:boundary",
    FAVCHANNEL_EVENTS_TRIGGERED: "analytics:favchannel:triggered",
    FAVCHANNEL_FEATURE_USED: "analytics:favChannelFeature:used",
    NETFLIX_IMPRESSION_TRIGGERED: "analytics:netflix:impression",
    LAUNCH_3PP_EVENTS_TRIGGERED: "analytics:thirdPartyAppLaunch:triggered",
    DEBUGGING_EVENT: "analytics:reachclient:debug",
};

export const analyticsLogEventTypes = {
    //New Event type
    HUB_EVENT: "Hub",
    PLAYBACK_EVENT: "Play",
    PLAYBACK_METRICs: "PlaybackMetrics",
    PLAYOUT_METRICs: "PlayoutMetrics",
    STB_PLAYBACK_METRICs: "StbPlaybackMetrics",
    APP_TIMINGS_EVENT: "AppTimings",
    APP_SESSION_START_EVENT: "SessionStart",
    APP_SESSION_END_EVENT: "SessionEnd",
    APP_SESSION_BACKGROUND_EVENT: "SessionBackground",
    APP_SESSION_RESUME_EVENT: "SessionResume",
    NAV_EVENT: "Navigation",
    DETAILS_EVENT: "Details",
    PPV_EVENT: "PayPerView",
    FILTER_EVENT: "Filter",
    ERROR_Event: "Error",
    WARNING_Event: "Warning",
    SEARCH_Event: "Search",
    FAVORITE_EVENT: "Favorite",
    DVR_EVENT: "Recording",
    LIVETV_EVENT: "LiveTvPage",
    SETTINGS_EVENT: "Settings",
    EXTERNAL_REQUEST_EVENT: "ExternalRequest",
    STREAM_MGMT_PREFLIGHT_TUNE_EVENT: "StreamMgmtPreflightTune",
    STREAM_MGMT_CURRENT_USAGE_EVALUATED_EVENT:
        "StreamMgmtCurrentUsageEvaluated",
    STREAM_MGMT_CURRENT_USAGE_CONTENTION_EVENT:
        "StreamMgmtCurrentUsageContention",
    STREAM_MGMT_PROVISIONAL_TUNE_EVENT: "StreamMgmtProvisionalTune",
    STREAM_MGMT_STOP_RECORDING_EVENT: "StreamMgmtStopRecording",
    STREAM_MGMT_WANPROFILE_UPDATED_EVENT: "StreamMgmtWanProfileUpdated",

    // these event strings must match the MR/Napa subscriber activity event names
    STREAM_MGMT_STREAM_REQUEST: "SM_STREAM_REQUEST",
    STREAM_MGMT_DETUNE: "SM_DETUNE",
    STREAM_MGMT_STREAM_CONTENTION: "SM_STREAM_CONTENTION",
    STREAM_MGMT_TVINTERRUPT: "SM_TV_INTERRUPT",
    STREAM_MGMT_REBOOT: "SM_REBOOT",

    LOCALDVR_LOADED: "LocalDVRLoaded",
    LOCALDVR_RECORDER_INITIALIZED: "LocalDVRRecoderInitialized", // CONSIDER: spelling incorrect - is this the correct name?
    LOCALDVR_PAUSEBUFFER_TRUNCATED: "LocalDVRPauseBufferTruncated",
    LOCALDVR_SCHEDULEITEM_RECEIVED: "LocalDVRScheduleItemReceived",
    LOCALDVR_RECORDINGACTION_EXECUTED: "LocalDVRRecordingActionExecuted",
    LOCALDVR_DISKMONITOR_EVENT: "LocalDVRDiskMonitorEvent",
    LOCALDVR_DISKMONITOR_RECORDINGABORTED:
        "LocalDVRDiskMonitorRecordingAborted",
    LOCALDVR_DISKMONITOR_RECORDINGSTOPPED:
        "analytics:DVRDiskMonitorRecordingStoped", // CONSIDER: spelling incorrect - is this the correct name?
    LOCALDVR_RECORDER_RECONCILIATION: "LocalDVRRecoderReconciliationResult",
    DVR_SCHEDULER_PERFORMANCE_EVENT: "DvrSchedulerPerformance",
    DVR_SCHEDULER_DATA_ERROR_EVENT: "DvrSchedulerDataError",
    CRASH_LOG: "analytics:CrashLog",
    PAGINATED_CONTENT: "PaginatedContent",
    PLAYON_EVENT: "PlayOn",
    TIMESHIFT_FAILURE_EVENT: "TimeShiftFailure",
    VOICE_EVENT: "Voice",
    INTENT_EVENT: "Intent",
    REMINDER: "Reminder",
    DUPLEX_CANARY_SUCCESS: "DuplexCanarySuccess",
    DUPLEX_CANARY_FAILED: "DuplexCanaryFailed",
    DUPLEX_CONNECTION_LOST: "DuplexConnectionLost",
    EAS_SUCCESS: "EasSuccess",
    EAS_FAILED: "EasFailed",
};

// global analytics service for event logging purpose.
export let service: Service | null = null;

export const initializeAnalyticsService = (): void => {
    if (!service) {
        if (!GLOBALS.deviceInfo.deviceId) {
            console.error("no device ID for analytics");
        }
        if (config.analytics.isEnabled && (isAppleTv)) {
            service = new Service(config.analytics.isEnabled, randomUnique());
        } else {
            console.warn(
                "analytics logs is Disabled or not supported this device"
            );
        }
    } else {
        console.warn("initializeAnalyticsService called more than once");
    }
};


export function newEvent(name: string): IAnalyticsEvent {
    return {
        programId: '',
        serialNo: 0, // tentative 0. Must be filled with sequence number starting from 1.
        eventName: name,
        startTimeUtc: Date.now(),
        transactionId: randomUnique(),
        pageUrl: "",
    };
}

export function newPerformanceResponseEvent(name: string): IAnalyticsEvent {
    return extend(newEvent(name), {
        tags: "performance:response",
    });
}

export function routeAndName(navhistory: any, routeInHistory: number) {
    const route = navhistory[navhistory?.length - routeInHistory]?.name;
    const name =
        navhistory[navhistory?.length - routeInHistory]?.params?.data?.title ||
        navhistory[navhistory?.length - routeInHistory]?.params?.title ||
        navhistory[navhistory?.length - routeInHistory]?.name ||
        "";
    const params = navhistory[navhistory?.length - routeInHistory]?.params;

    return {
        route,
        name,
        params,
    };
}

export class Service {
    public enable: boolean;
    public appSessionId?: string;
    public deviceType: string | undefined = GLOBALS.deviceInfo.deviceId;
    public tenantId: string = config.tenantId;
    // locale that is currently loaded
    public currentLocale?: string;

    public intervalMilliSec: number =
        config.analytics.intervalMilliSec || 120000; // 2 minutes
    public maxSize: number = config.analytics.maxSize || 800000; //800 KB, idea is to keep it less than 1 MB (kibana logsize limit)
    public warnSize: number = config.analytics.warnSize || 5000000; // 5 MB, if the size of analytics object grows more than this, then we need to issue a warning

    // -----------------
    // New analytics:
    // -----------------

    private events: IAnalyticsEvent[] = [];
    private currentSerialNo = 0;
    private userId?: string;
    private shellBuildVersion?: string;
    private wumcBuildNumber?: string;
    private connectionType?: string;
    private accountType?: string;
    private navPageOpenTime = 0;
    private record: EventObj[] = [];
    private remainingEvents: EventObj[] = [];

    //Timer
    private timer: any;

    // This method is to prevent burst of playback error events caused by issues in underlying code which
    // results in skewing of playback success rate in Kibana. The underlying issues will be fixed
    // as and when encountered. This dedpulication of playback errors is done keeping in mind that it should
    // still allow to identify cases of such playback error storms from Kibana logs but without such playback
    // errors being reported as distinct, unique error events. The deduplication is done over a period of each
    // analytics flushEvents cycle
    private deduplicatePlaybackErrorEvents = (
        analyticsEventsArray: IAnalyticsEvent[]
    ): IAnalyticsEvent[] => {
        let uniqueEventsArr: IAnalyticsEvent[] = [];
        let lastUniqueErrorEvent: IErrorsEvent | null = null;
        let duplicateErrorCount = 0;
        for (let i = 0; i < analyticsEventsArray?.length; i++) {
            // checking for duplicate playback errors
            if (
                analyticsEventsArray[i].eventName === "Error" &&
                (<IErrorsEvent>analyticsEventsArray[i]).errorType ===
                "playback-error"
            ) {
                let currErrorEvent: IErrorsEvent = <IErrorsEvent>(
                    analyticsEventsArray[i]
                );
                analyticsEventsArray[
                    i
                ].duplicateErrorCount = duplicateErrorCount;
                // check if the error event is a duplicate
                if (lastUniqueErrorEvent !== null) {
                    if (
                        lastUniqueErrorEvent.programId !==
                        currErrorEvent.programId
                    ) {
                        for (let i = 0; i < analyticsEventsArray.length; i++) {
                            if (
                                analyticsEventsArray[i].eventName == "Error" &&
                                analyticsEventsArray[i].programId ===
                                lastUniqueErrorEvent.programId
                            )
                                analyticsEventsArray[
                                    i
                                ].duplicateErrorCount = duplicateErrorCount;
                        }

                        duplicateErrorCount = 0;
                    }
                    if (
                        lastUniqueErrorEvent.errorCode ===
                        currErrorEvent.errorCode
                    ) {
                        // checking if asset is same depending on playback type
                        // for LiveTV : match <ChannelNumber> and <ProgramId>,
                        // for VOD/Catchup/DVR : match <PlaybackId> and <ProgramId>
                        // programId check is added to prevent deduplication of playback errors on same channel after program change
                        let isAssetSame = false;
                        if (
                            lastUniqueErrorEvent.playbackType ===
                            currErrorEvent.playbackType
                        ) {
                            if (
                                currErrorEvent.playbackType?.toLowerCase() ===
                                "livetv"
                            ) {
                                if (
                                    lastUniqueErrorEvent.channelNumber ===
                                    currErrorEvent.channelNumber &&
                                    lastUniqueErrorEvent.programId ===
                                    currErrorEvent.programId
                                ) {
                                    isAssetSame = true;
                                }
                            } else if (
                                lastUniqueErrorEvent.playbackId ===
                                currErrorEvent.playbackId &&
                                lastUniqueErrorEvent.programId ===
                                currErrorEvent.programId
                            ) {
                                isAssetSame = true;
                            }
                        }
                        // treat duplicate as errorCode is same && (either playbackSessionId or transactionId is same) && asset is same
                        // do not push to unique_events array, update the duplicate error count
                        if (isAssetSame === true) {
                            console.log(
                                "analytics/deduplicatePlaybackErrorEvents: Ignoring duplicate playback error event :" +
                                JSON.stringify(currErrorEvent)
                            );
                            duplicateErrorCount++;
                            continue;
                        }
                    }
                }
                // current error event is not a duplicate, update the last unique error event
                lastUniqueErrorEvent = currErrorEvent;
            }

            // add the analytics event to unique events array
            console.log(
                "analytics/deduplicatePlaybackErrorEvents: Adding event :" +
                JSON.stringify(analyticsEventsArray[i])
            );
            uniqueEventsArr.push(analyticsEventsArray[i]);
        }
        if (duplicateErrorCount) {
            for (let i = 0; i < analyticsEventsArray.length; i++) {
                if (
                    analyticsEventsArray[i].eventName == "Error" &&
                    analyticsEventsArray[i].programId ===
                    lastUniqueErrorEvent?.programId
                ) {
                    analyticsEventsArray[
                        i
                    ].duplicateErrorCount = duplicateErrorCount;
                }
            }
        }

        return uniqueEventsArr;
    };

    private makePostHeader(timeUtc: number): IAnalyticsPostHeader {
        return {
            postTimeUtc: timeUtc,
            connectionType: this.connectionType || "N/A",
            appSessionId: this.appSessionId || "",
            deviceId: GLOBALS.deviceInfo.deviceId,
            userId: this.userId || "",
            userAgent: `${isAppleTv
                ? "tvos " + DeviceInfo.getSystemVersion() + "-RetailClient"
                : ""
                }`,
            profileIds:
                GLOBALS.bootstrapSelectors?.ProfileIds[0] || "N/A",
            clientBuildVersion: config.buildVersion || "N/A",
            shellBuildVersion: this.shellBuildVersion || "N/A",
            wumcBuildNumber: this.wumcBuildNumber || "N/A",
            accountType: this.accountType || "",
            deviceType: isAppleTv ? "AppleTV" : "",
        };
    }

    constructor(enabled: boolean, sessionId?: string) {
        this.enable = enabled;
        // Check where analytics service needs to be turned on or off (based on environment configuration )
        if (!this.enable) {
            return;
        }
        console.log(`analytics.init( ${this.enable}  )`);
        this.events = [];
        this.appSessionId = sessionId;
        this.wumcBuildNumber = "N/A";
        //@ts-ignore
        this.timer = setInterval(this.flushEvents, this.intervalMilliSec);
    }

    // when app goes from background to foreground, restart sending analytics to kiban.
    restartAnalytics() {
        //@ts-ignore
        this.timer = setInterval(this.flushEvents, this.intervalMilliSec);
    }

    setUserId = (userId: string) => {
        this.userId = userId;
    };

    setTenantId = (tenant: string) => {
        this.tenantId = tenant;
    };

    setConnectionType = (connectionType: string) => {
        this.connectionType = connectionType;
    };

    setShellBuildVersion = (shellBuildVersion?: string) => {
        this.shellBuildVersion = shellBuildVersion || "N/A";
    };

    setWumcBuildNumber = (wumcBuildNumber?: string) => {
        this.wumcBuildNumber = wumcBuildNumber || "N/A";
    };

    setAccountType = (accountType?: string) => {
        this.accountType = accountType || "";
    };

    setDeviceType = (deviceType: string) => {
        this.deviceType = deviceType;
    };

    setNavPageOpenTime(navPageOpenTime: number) {
        this.navPageOpenTime = navPageOpenTime;
    }

    remainingEventsToRecord(remainingEvents: EventObj[]) {
        // moving event objects from remainingEvents to record.
        for (let i = 0; i < remainingEvents.length; i++) {
            if (getSizeInBytes(this.record) < this.maxSize) {
                this.record.push(remainingEvents[i]);
                this.remainingEvents.splice(i, 1);
                i--;
            }
        }
    }
    // Send all events all to the server, and flush the event queue.
    private flushEvents = (next: () => void | undefined): void => {
        if (!this.events && !this.record) {
            console.log("analytics/flushEvents: there is no events");
            return;
        }
        if (this.events.length === 0 && this.record.length === 0) {
            console.log("analytics/flushEvents: there is no events");
            return;
        }
        // Underlying layers may generate burst of playback errors(due to existing bugs) for same transactionId.
        // De-duplicating such playback errors to prevent skewing of playback success rate in the kibana logs.
        // Only unique playback errors per transactionId will be sent to monitoring service. This deduplication
        // happens over one flushEvents cycle.
        let unique_events: IAnalyticsEvent[] = this.deduplicatePlaybackErrorEvents(
            this.events
        );

        // Assigning consecutive numbers to serialNo. Events arrive here with serialNo being 0 and they are assigned
        // consecutive number starting from 1 before being sent to the server.
        // Adding objects to record array ensuring the size of record doesn't grow beyond the size limit, when record grow beyond the size limit storing the remaing event objects to remainingEvents array.
        for (let e of unique_events) {
            e.serialNo = ++this.currentSerialNo;
            if (getSizeInBytes(this.record) < this.maxSize) {
                this.record.push(e);
            } else if (getSizeInBytes(this.record) >= this.maxSize) {
                this.remainingEvents.push(e);
            }
        }

        // If the size of events object is continuously growing, logging a warning here
        if (getSizeInBytes(this.events) > this.warnSize) {
            console.warn(
                " Analytics Object Size has grown beyond " +
                this.warnSize / 1000000 +
                " MB!! "
            );
        }

        // emptying events array, will be filled with new events in next interval.
        this.events.splice(0, this.events.length);

        this.record.unshift(this.makePostHeader(Date.now()));

        // Send the record
        // return actionCreators.analytics.analytics.send(data);
        try {
            sendAnalyticsReport(this.record)
                .then((res: any) => {
                    if (res?.status >= 200 && res?.status <= 299) {
                        console.log(
                            "Analytics success to send the record to the cloud; status code: " +
                            res?.status
                        );
                        // emptying record array only when it is successfully posted.
                        // when failed to post, data in record remains and will be posted in next flushEvents call, including new data.
                        this.record.splice(0, this.record.length);

                        // if remainingEvents has data, moving it to record array.
                        if (
                            this.remainingEvents &&
                            this.remainingEvents.length
                        ) {
                            this.remainingEventsToRecord(this.remainingEvents);
                        }
                    } else {
                        this.record.splice(0, 1); // removing makePostHeader from record, will be added in next flushEvents call
                        console.log(
                            "Analytics failed to send the record to the cloud; save it to local storage: " +
                            JSON.stringify(this.record)
                        );
                    }
                })
                .catch((err: any) => {
                    this.record.splice(0, 1); // removing makePostHeader from record, will be added in next flushEvents call
                    console.log(
                        "analytics/flushEvents: error after calling actionCreators.analytics.analytics.send; ",
                        err
                    );
                    console.log(
                        "Analytics failed to send the record to the cloud; save it to local storage: " +
                        JSON.stringify(this.record)
                    );
                });
        } catch (err) {
            console.error(
                "analytics/flushEvents: exception when calling actionCreators.analytics.analytics.send, " +
                err!.toString()
            );
        }
    };

    private queueEvent<T extends IAnalyticsEvent = IAnalyticsEvent>(
        event: T
    ): void {
        if (event.responseTime) {
            event.totalResponseTime = event.responseTime;
            //@ts-ignore
        } else if (event["LoadTimeMilliseconds"]) {
            //@ts-ignore
            event.totalResponseTime = event["LoadTimeMilliseconds"];
        }
        this.events.push(event);
    }

    //Event

    //PlayoutMetrics event
    addPlayoutMetrics = (payload: IPlayoutMetricsEvent) => {
        let playoutMetrics = <IPlayoutMetricsEvent>(
            extend(
                newPerformanceResponseEvent(
                    analyticsLogEventTypes.PLAYOUT_METRICs
                ),
                payload
            )
        );
        this.queueEvent(playoutMetrics);
    };

    //PlayBackMetrics event
    addPlaybackMetrics = (payload: IPlaybackMetricsEvent) => {
        let playbackMetrics = <IPlaybackMetricsEvent>(
            extend(
                newPerformanceResponseEvent(
                    analyticsLogEventTypes.PLAYBACK_METRICs
                ),
                payload
            )
        );
        this.queueEvent(playbackMetrics);
    };

    //Play event
    addPlayEvent = (payload: IPlayEvent) => {
        let playbackMetrics = <IPlayEvent>(
            extend(
                newPerformanceResponseEvent(
                    analyticsLogEventTypes.PLAYBACK_EVENT
                ),
                payload
            )
        );
        this.queueEvent(playbackMetrics);
    };

    //PlayBackError event
    addPlaybackError = (payload: IErrorsEvent) => {
        let playbackMetrics = <IErrorsEvent>(
            extend(
                newPerformanceResponseEvent(analyticsLogEventTypes.ERROR_Event),
                payload
            )
        );
        this.queueEvent(playbackMetrics);
    };

    //Navigation event
    addNavEventOnPrevPageClose(props: any) {
        if (props.navigation.currentRoute === "Favorites") {
            this.addNavEvent(
                navigationAction.pageClose,
                "Yourstuff",
                "Yourstuff",
                "page"
            );
            return;
        }

        let navUrl = "";
        const route =
            routeAndName(props?.history, routeHistory.previousRoute).route ||
            "";
        let name = "";

        if (
            routeAndName(props?.history, routeHistory.previousRoute)?.params
                ?.feed?.ContextualNavigationTargetUri === "restartTvGallery"
        ) {
            name = `${routeAndName(props?.history, routeHistory.previousRoute)?.params
                ?.feed?.NavigationTargetText
                } | ${routeAndName(props?.history, routeHistory.previousRoute)?.params
                    ?.feed?.Name
                }`;
        } else if (
            routeAndName(props?.history, routeHistory.previousRoute).name ===
            "Live"
        ) {
            name =
                routeAndName(props?.history, routeHistory.previousRoute).params
                    .data?.Name || "Guide";
        } else {
            name =
                routeAndName(props?.history, routeHistory.previousRoute)?.params
                    ?.feed?.NavigationTargetText ||
                routeAndName(props?.history, routeHistory.previousRoute)?.params
                    ?.data?.Schedule?.title ||
                routeAndName(props?.history, routeHistory.previousRoute).name ||
                "";
        }

        if (
            (routeAndName(props?.history, routeHistory.previousRoute)?.route !==
                "Live" &&
                routeAndName(props?.history, routeHistory.previousRoute)
                    ?.route !== "PersonDetails" &&
                routeAndName(props?.history, routeHistory.previousRoute)?.params
                    ?.data) ||
            routeAndName(props?.history, routeHistory.previousRoute)?.params
                ?.feed
        ) {
            navUrl =
                routeAndName(props?.history, routeHistory.previousRoute)?.params
                    ?.feed?.NavigationTargetUri ||
                `${route}/${routeAndName(props?.history, routeHistory.previousRoute)
                    ?.params?.data?.assetType?.contentType
                }` ||
                "";
        } else {
            navUrl = route;
        }

        this.addNavEvent(navigationAction.pageClose, navUrl, name, "page");
    }

    addNavEventOnPrevPageOpen(props: any) {
        let navUrl = "";
        let route = "";
        let name = "";

        route =
            routeAndName(props?.history, routeHistory.currentRoute).route || "";

        if (
            routeAndName(props?.history, routeHistory.currentRoute)?.params
                ?.feed?.ContextualNavigationTargetUri === "restartTvGallery"
        ) {
            name = `${routeAndName(props?.history, routeHistory.currentRoute)?.params
                ?.feed?.NavigationTargetText
                } | ${routeAndName(props?.history, routeHistory.currentRoute)?.params
                    ?.feed?.Name
                }`;
        } else {
            name =
                routeAndName(props?.history, routeHistory.currentRoute)?.params
                    ?.feed?.NavigationTargetText ||
                routeAndName(props?.history, routeHistory.currentRoute).params
                    ?.data?.Name ||
                routeAndName(props?.history, routeHistory.currentRoute)?.params
                    ?.data?.Schedule?.title ||
                routeAndName(props?.history, routeHistory.currentRoute).name ||
                "";
        }

        if (
            (routeAndName(props?.history, routeHistory.currentRoute)?.route !==
                "PersonDetails" &&
                props.navigation.currentRoute !== "Live" &&
                routeAndName(props?.history, routeHistory.currentRoute)?.params
                    ?.data) ||
            routeAndName(props?.history, routeHistory.currentRoute)?.params
                ?.feed
        ) {
            navUrl =
                routeAndName(props?.history, routeHistory.currentRoute)?.params
                    ?.feed?.NavigationTargetUri ||
                `${route}/${routeAndName(props?.history, routeHistory.currentRoute)
                    ?.params?.data?.assetType?.contentType
                }` ||
                "";
        } else if (
            routeAndName(props?.history, routeHistory.currentRoute)?.name ===
            "Details"
        ) {
            navUrl = `${route}/${routeAndName(props?.history, routeHistory.currentRoute)?.params
                ?.data?.assetType?.contentType
                }`;
        } else {
            navUrl = route;
        }

        this.addNavEvent(navigationAction.pageOpen, navUrl, name, "page");
    }

    addNavEventOnCurPageOpenOrClose(props: any, route: string, state: string) {
        let navUrl = "";
        let name = "";
        if (
            props.navigation?.params?.feed?.ContextualNavigationTargetUri ===
            "restartTvGallery"
        ) {
            name = `${props.navigation?.params?.feed?.NavigationTargetText} | ${props.navigation?.params?.feed?.Name}`;
        } else if (
            props.navigation?.currentRoute === "Live" &&
            route !== "Details"
        ) {
            name =
                props.navigation?.params?.data?.Name ||
                props.navigation?.params?.feed?.Name ||
                "Guide";
        } else {
            name =
                props.navigation?.params?.feed?.NavigationTargetText ||
                props.navigation?.params?.data?.title ||
                props.navigation?.params?.data?.Schedule?.title ||
                props.navigation?.params?.title ||
                props.navigation?.params?.data?.Name ||
                props.navigation?.currentRoute ||
                "";
        }
        if (
            Object.keys(props.navigation?.params)?.length &&
            props.navigation?.params?.data &&
            props.navigation?.currentRoute !== "PersonDetails" &&
            route !== "Live"
        ) {
            navUrl = `${route}/${props.navigation?.params?.data?.assetType?.contentType}`;
        } else if (
            props.navigation?.currentRoute === "Live" &&
            props.navigation?.params?.feed
        ) {
            navUrl = props.navigation?.params?.feed?.NavigationTargetText || "";
        } else {
            navUrl =
                props.navigation?.params?.feed?.NavigationTargetUri || route;
        }

        this.addNavEvent(state, navUrl, name, "page");
    }

    addNavEvent(
        state: string,
        route: Route["name"],
        name: string,
        navType: string
    ): void {
        let duration = 0;

        let navEvent = <INavEvent>(
            extend(
                newPerformanceResponseEvent(analyticsLogEventTypes.NAV_EVENT),
                {
                    navUrl: route,
                    navigationState: state,
                    navigationType: navType,
                    tags: "performance",
                    name: name,
                    pageUrl: route,
                }
            )
        );

        duration = Math.max(navEvent.startTimeUtc - this.navPageOpenTime, 0);

        if (navType === "page") {
            if (state === navigationAction.pageOpen) {
                navEvent.LoadTimeMilliseconds = duration;
            } else {
                navEvent.ViewTimeMilliseconds = duration;
            }
        }

        this.queueEvent(navEvent);
    }

    //EAS succes event
    addEASSuccessEvent = (payload: IEasEvent) => {
        let easEvent = <IEasEvent>(
            extend(
                newPerformanceResponseEvent(analyticsLogEventTypes.EAS_SUCCESS),
                payload
            )
        );
        this.queueEvent(easEvent);
    };

    //EAS Failed event
    addEASFailedEvent = (payload: IEasInvalidPayloadEvent) => {
        let easEvent = <IEasInvalidPayloadEvent>(
            extend(
                newPerformanceResponseEvent(analyticsLogEventTypes.EAS_FAILED),
                payload
            )
        );
        this.queueEvent(easEvent);
    };

    //Destory Timer
    destroy = () => {
        this.flushEvents.bind(this);
        clearInterval(this.timer);
    };
} // class Service

// Each post to the collection server consists of an array of JavaScript objects.
// Of them the first object must be conform to this interface. The rest are IAnalyticsEvent's.
// That is, every post must have at least two objects in the array, the IAnalyticsPostHeader
// plus at least one IAnalyticsEvent.

interface IAnalyticsPostHeader {
    postTimeUtc: number;
    connectionType: string; // Ethernet, wifi vs cellular
    appSessionId: string; // generated from the client when app is launched or refreshed
    deviceId: string | undefined; // it is a unique id stored in local storage.A new installation of the app or clean browser storage could change it.
    userAgent: string;
    userId: string;
    profileIds: string; //Default will be defaultUserId. Otherwise it will be checkedIn Profile Ids separated by ","
    clientBuildVersion: string;
    shellBuildVersion: string;
    wumcBuildNumber: string;
    accountType: string;
    deviceType: string;
}

export interface IAnalyticsEvent {
    serialNo: number;
    eventName: string;
    startTimeUtc: number;
    transactionId: string;
    pageUrl: string;
    tags?: string; //any tags the event can have. such as Performance
    responseTime?: number; //response Time from last tap
    totalResponseTime?: number;
    duplicateErrorCount?: number;
    programId?: string;
}

export interface IAnalyticsObjectInfo {
    // Anything that can be represented by id and name
    id: string; // id of an asset, or a person, or a details page , if applicable
    name: string; // name of an asset or a person or a details page,  if applicable
    objType?: "PERSON" | "PROGRAM"; // type of an asset or a person or a details page, if applicable
}

export interface IAnalyticsSelectedInfo {
    // Anything that can be represented by id and name
    id: string; // id of an asset, or a person, or a details page
    name: string; // name of an asset or a person or a details page
    category: string; // category of an asset or a person or a details page
}

interface INavEvent extends IAnalyticsEvent {
    navUrl: string; // page or dialog URL
    navigationState: string; // open or close
    navigationType: string; // page or dialog
    name?: string; // the page/dialog name that is opened/closed, it is the localized string
    LoadTimeMilliseconds?: number; // for page/dialog open, how long to load the page
    ViewTimeMilliseconds?: number; // for page close ONLY, how long the page was viewed

    lastTapUiElement?: string; // UIelement of last tap that triggers the navigation
    originId?: string; // asset or person Id for details page and purchase
    originType?: string; // asset or person type for the details page
    similarItemIds?: string[]; // more like this
}

// Error Event
export interface IErrorsEvent extends IAnalyticsEvent {
    errorCode: string; //error code. Should be unique and comprehensive for all errors
    errorMessage: string; //error message
    errorType: string; //one of errors.ErrorTypes
    isRecoverable?: boolean; // whether it is transient error (recoverable)
    errorTitle?: string;

    //context
    lastTapUiElement?: string; //context of the error. the UIelement of last tap
    originType?: string; // context of the error. if this error happens on a details page, provide details type
    originId?: string; // context of the error. if this error happens on a details page, provide asset Id if necessary
    originName?: string; // context of the error. if this error happens on a details page, provide asset or person name if necessary

    //service error
    errorUrl?: string; // error URL for service errors
    errorVerb?: string; // error Verb for service errors: Post/ Get

    //playback error
    playbackId?: string;
    programId?: string;
    isLiveTv: boolean;
    channelNumber?: number;
    mediaId?: string;
    assetId?: string;
    playbackPosition?: number;
    playbackType?: string;
    recordingId?: string;
    playbackSessionId: string; // playback sessionId for the playback error
    duplicateErrorCount?: number; // count of de-duplicated playback errors
    masterManifestURL?: string;
    vsppSessionID?: string;
    audioVariantManifestURL?: string;
    videoVariantManifestURL?: string;
    subtitleVariantManifestURL?: string;
    iframeVariantManifestURL?: string;
    audioSegmentURL?: string;
    videoSegmentURL?: string;
    subtitleSegmentURL?: string;
    iframeSegmentURL?: string;
}

export const epochStart = new Date(2021, 9, 24).getTime();
export const clientStart = (new Date().getTime() - epochStart).toString(16);

const zeroPadded = (n: number, base: number, places: number): string => {
    let zs = n.toString(base);
    while (zs.length < places) {
        zs = "0" + zs;
    }
    return zs;
};

const RandomHex4_soft = (): string => {
    return zeroPadded(
        Math.floor((1 + Math.random()) * 0x10000),
        16,
        5
    ).substring(1);
};

const randomUnique = (): string => {
    const extra = clientStart.substring(clientStart.length - 8);
    return RandomHex4_soft() + RandomHex4_soft() + "-" + extra;
};

export interface IDuplexCanaryEvent extends IAnalyticsEvent {
    latencyMilliseconds: number;
}

export interface IDuplexConnectionLostEvent extends IAnalyticsEvent {
    closeCode: number;
    closeReason: string;
}

export interface IEasEvent extends IAnalyticsEvent {
    tid: string;
    alertType: string;
    startTimeUtcStr: string;
    endTimeUtcStr: string;
    clientCurrentTimeUtcStr: string;
    clientGeoCode: string;
    isGeoCodeMatched: boolean;
}

export interface IEasInvalidPayloadEvent extends IAnalyticsEvent {
    EasMessage: string;
    clientCurrentTimeUtcStr: string;
    clientGeoCode: string;
    payloadSize: number;
}

export interface IPlayoutMetricsEvent extends IAnalyticsEvent {
    playbackType: string;
    assetTitle: string;
    callLetter?: string;
    catchupKey?: string;
    channelNumber?: string;
    isAdult?: boolean;
    os: string;
    programId: string;
    showType?: string;
    playbackTransition: any;
    playbackSessionId: string;
    playoutMetrics: PlayOutMetrics;
    bitrateVideoProfiles: any;
    playbackEndTimeUtc: any;
    qualityLevel: any;
    playbackStartTimeUtc: any;
}

export type PlayOutMetrics = {
    termination: string;
    durationWatched?: number;
    playbackStalls?: number;
    bitrateProfiles?: number[];
    stopPlayPosition?: null;
    startPlayPosition?: null;
    bytesTransferred?: null;
    transferDuration?: null;
    droppedVideoFrames?: null;
    callLetter?: string;
    channelNumber?: number;
    mediaId: string;
    tracks?: any;
    DRMRequestDuration?: any;
    blankScreenDuration?: any;
    finalBeaconDuration?: any;
    initPlayerDuration?: any;
    masterManifestRequestDurati?: any;
    programQueryDuration?: any;
    registerDeviceDuration?: any;
    rollRequestDuration?: any;
    startPlaybackDuration?: any;
    stopPlaybackDuration?: any;
    VSPPSessionId?: any;
    programId?: string;
    manifestRetryCountConfigure?: any;
    manifestRetryCountActualVal?: any;
    manifestRetryReason?: any;
    manifestRetryUrl?: any;
    tuneDuration?: any;
};

export interface IPlaybackMetricsEvent extends IAnalyticsEvent {
    playbackSessionId: string;
    playbackMetrics: PlaybackMetrics;
    assetTitle: any;
}

export type PlaybackMetrics = {
    callLetter?: string;
    channelNumber?: number;
    mediaId?: string;
    bitrateVideoTimestamps?: any;
    transferDuration?: any;
    bitrateAudioTimestamps?: any;
    bitrateVideoProfiles?: any;
    droppedVideoFrames?: any;
    durationsWatched?: any;
    bitrateAudioProfiles?: any;
    throughputTimestamps?: any;
    bufferFillTimes?: any;
    playbackStartOffsets?: any;
    bytesTransferred?: any;
    playbackStallsTimestamps?: any;
    throughputValues?: any;
    averageBitrate?: any;
    playbackStalls?: any;
    bufferUnderruns?: any;
    assetTitle?: any;
};

export interface IPlayEvent extends IAnalyticsEvent {
    playbackSessionId: string;
    playMode?: string;
    playbackType?: string;
    assetTitle?: string;
    positionSeconds?: number;
    runtimeSeconds?: string;
    userScheduleItemId?: null;
    callLetter?: string;
    channelNumber?: number;
    catchupKey?: string;
    mediaId?: string;
    programId?: string;
    glfProgramId?: string;
    scheduleItemId?: null;
    serviceCollectionId?: string;
    serviceGrouping?: string;
    serviceId?: string;
    stationId?: string;
    providerId?: string;
    titleId?: string;
    assetId?: string;
    assetType?: string;
    language?: any;
    episodeName?: string;
    episodeNumber?: string;
    seriesName?: string;
    rating?: any;
    playbackStartTimeUtc?: any;
    playbackEndTimeUtc?: any;
}
// Generated by https://quicktype.io



