import { each, map, filter, extend, includes, some } from "lodash";
import { ServiceMap } from "../../@types/BootStrapResponse";
import { isPlayable } from "../assetUtils";
import { Definition, DvrItemState, QualityLevelValue, RestrictionsType, SourceType } from "../common";
import { validCatchupStationIds } from "../restart/RestartUtils";
import { IChannel, ServiceCollection, IService, ChannelEquivalencesMap, ChannelMapInfo, IJsonObject, ChannelIndex, QualityRights, ServiceGroup, LiveChannelMapInfo, ChannelMapLiveRights, ServiceType, IChannelCache, ServiceCollectionsMap, ServiceItem, QualityLevels, IApplicationData, IAppService, NowNextScheduleMap, NowNextSchedule, LiveSchedule, ISearchFilters } from "./live";
import { LiveChannelLocaleMap } from "./LiveChannelLocalMap";
import { LiveChannelStore } from "./LiveChannelStore";
import * as strUtils from "../../utils/strUtils";
import DateUtils from "../dateUtils";
import { generateType } from "../Subscriber.utils";
import { DvrGroupState } from "../DVRUtils";


const ServiceCollectionIdPPVSuffix = "_ppv_";

let buildNowNextMap_lastNowNextScheduleMap: NowNextScheduleMap;
let buildNowNextMap_lastScheduleMap: any;
let buildNowNextMap_lastStationIds: string[];
let buildNowNextMap_lastDate: number;


const orderedQualityLevels: QualityLevelValue[] = [
    QualityLevels.UHD,
    QualityLevels.ReachUHD,
    QualityLevels.HD,
    QualityLevels.ReachHD,
    QualityLevels.SD,
    QualityLevels.ReachSD
];



export class LiveChannelMap {
    static readonly className = "live.LiveChannelMap";

    private Channels: IChannel[];
    private ServiceCollections: ServiceCollection[];
    private Services: IService[];
    private ChannelEquivalences?: ChannelEquivalencesMap;
    //@ts-ignore
    private ServiceMap: ServiceMap = {};
    private currentStoreID: string | undefined;
    private currentLocal: string | undefined;

    public constructor(
        channelMapInfo: ChannelMapInfo,
        options: any,
        id?: string,
        params?: IJsonObject,
        validStoreId: string = '',
        valueLocale: string = ''
    ) {
        this.Channels = <any>channelMapInfo.Channels;
        this.ServiceCollections = channelMapInfo.ServiceCollections;
        this.Services = channelMapInfo.Services;
        this.ChannelEquivalences = channelMapInfo.ChannelEquivalences;
        this.currentStoreID = validStoreId;
        this.currentLocal = valueLocale;
    }

    // public static newLiveChannelMap(): LiveChannelMap {
    //     return new LiveChannelMap(undefined, undefined);
    // }

    /**
     * The channel map model code expects a little more detail than just
     * a generic failure to load. keep that state here.
     */
    // public errorCode: liveTvGuide.FetcherError;

    // accessor cache
    private stationIds: string[] = [];
    // private stationIdsAsKeys: {[stationId: string]: number} = {};
    public channelNumbers: number[] = [];
    // more caching
    private _byNumber: { [channel: number]: ChannelIndex } = {};
    private _byStationId: { [stationId: string]: ChannelIndex } = {};

    private currentStoreChannels: {
        Id: string;
        locale: string;
        channels: IChannel[];
    } | null = null;

    // public deserialize(obj: any): boolean {
    //     if (!obj.attrs.ChannelMapId || (obj.attrs.ChannelMapId && obj.attrs.channelMapId !== env.channelMapId)) {
    //         // refuse deserialization if channel map id doesn't match.
    //         return false;
    //     }
    //     return super.deserialize(obj);
    // }

    // model accessor methods

    /**
     * some way to assess that the model is reasonably populated.
     */
    // public validate(attrs: ChannelMapInfo, options: any): string | undefined {
    //     const valid = attrs.Channels instanceof Array && attrs.ServiceMap;
    //     if (!valid) {
    //         return "Invalid channelMap";
    //     }
    //     return undefined;
    // }

    public get(attributeName: string): any {
        if (!attributeName) {
            return this;
        }

        if (attributeName === "Channels") {
            return this.getChannels();
        }

        const temp: { [index: string]: any } = this;

        return temp[attributeName];
    }

    public getCurrentLiveChannelStore(): LiveChannelStore {
        return (
            this.get("MultipleStoreChannelMap") &&
            this.get("MultipleStoreChannelMap")[this.currentStoreID || '']
        );
    }

    public getCurrentLiveChannelLocaleMap(): LiveChannelLocaleMap {
        const currentLocale = "en-us";
        const currentStore = this.getCurrentLiveChannelStore();
        return (
            currentStore && currentStore.getLiveChannelLocaleMap((this.currentLocal || currentLocale).toLowerCase())
        );
    }

    public getStationTypes(): string[] {
        const localeMap = this.getCurrentLiveChannelLocaleMap();
        return (localeMap && localeMap.getStationTypes()) || [];
    }

    public getGenres(): { [key: string]: Genre } {
        const localeMap = this.getCurrentLiveChannelLocaleMap();
        return (localeMap && localeMap.getGenres()) || {};
    }

    public getChannelEquivalences(channelNumber: number): number[] {
        if (channelNumber) {
            const channelEquivalences: ChannelEquivalencesMap = this.get(
                "ChannelEquivalences"
            );
            const equivalentChannels: number[] =
                channelEquivalences && channelEquivalences[channelNumber];
            if (equivalentChannels && equivalentChannels.length > 0) {
                return equivalentChannels;
            }
        }
        return [];
    }

    public getChannels(): IChannel[] {
        const currentStoreId = this.currentStoreID;
        const currentLocale = this.currentLocal;

        // const tifChannels: CloudChannel[] = mstv.tif.tifEnabled && this.Channels ? this.Channels.filter((c) => !!c.IsTif) : [];

        if (
            !this.currentStoreChannels ||
            this.currentStoreChannels.Id !== currentStoreId ||
            this.currentStoreChannels.locale !== currentLocale
        ) {
            const localeMap = this.getCurrentLiveChannelLocaleMap();
            const channelIndexArray: number[] =
                (localeMap && localeMap.getLiveChannelIndexMap()) || [];
            const currentChannels: IChannel[] = [];
            each(channelIndexArray, (index: number) => {
                currentChannels.push(this.Channels[index]);
            });
            // currentChannels.push(...tifChannels);

            this.currentStoreChannels = {
                Id: currentStoreId || '',
                channels: currentChannels,
                locale: currentLocale || ''
            };
        }

        return this.currentStoreChannels.channels;
    }

    public resetCurrentStoreChannels(): void {
        this.currentStoreChannels = null;
    }

    public resetChannelMapCache(): void {
        this._byNumber = {};
        this._byStationId = {};
    }

    public findChannelByIndex(channelIndex: number): IChannel | undefined {
        const channels: IChannel[] = this.get("Channels");
        let channel: IChannel | undefined;
        if (
            channels &&
            channels.length > 0 &&
            channelIndex >= 0 &&
            channelIndex < channels.length
        ) {
            channel = channels[channelIndex];
        }
        return channel;
    }

    public findChannelByNumber(
        channelNumber: number,
        defaultIndex?: number,
        force = false
    ): ChannelIndex {
        const ci = this.findChannelByField(
            channelNumber,
            "Number",
            defaultIndex,
            this._byNumber,
            force
        );
        if (ci.channel) {
            this._byStationId[ci.channel.StationId] = ci; // manage other caches.
        }
        return ci;
    }

    /**
     * Return nearest channel, option to filter non playable channels.
     */
    public findNearestChannelByNumber(
        channelNumber: number,
        returnNonPlayable: boolean,
        defaultIndex?: number
    ): ChannelIndex {
        return this.findChannelByField(
            this.findClosestChannelNumber(channelNumber, returnNonPlayable),
            "Number",
            defaultIndex,
            this._byNumber
        );
    }

    public findChannelByStationId(
        stationId: string | number,
        defaultIndex?: number,
        force = false
    ): ChannelIndex {
        const ci = this.findChannelByField(
            stationId,
            "StationId",
            defaultIndex,
            this._byStationId,
            force
        );
        if (ci.channel) {
            this._byNumber[ci?.channel?.Number] = ci; // manage other caches.
        }
        return ci;
    }

    // NOTE: the number|string value typing is preventing Chrome's JIT from generating a stable compiled version of this method
    private findChannelByField(
        value: number | string,
        field: string,
        defaultIndex?: number,
        cache?:
            | { [index: string]: ChannelIndex }
            | { [index: number]: ChannelIndex },
        force = false
    ): ChannelIndex {
        const tempCache = <any>cache;
        if (!force && cache && tempCache[value]) {
            return tempCache[value];
        }
        const channels: IChannel[] = this.get("Channels");
        if (channels && channels.length > 0) {
            for (let i = 0, len = channels.length; i < len; i += 1) {
                const channel = <any>channels[i];
                if (channel[field] === value) {
                    const ret = {
                        channel,
                        channelIndex: i
                    };
                    if (cache) {
                        tempCache[value] = ret;
                    }
                    return ret;
                }
            }
            if (defaultIndex !== undefined) {
                return {
                    channel: channels[defaultIndex],
                    channelIndex: defaultIndex
                };
            }
        }
        return { channel: undefined, channelIndex: undefined };
    }

    private findClosestChannelNumber(
        value: number,
        returnNonPlayable: boolean
    ): number {
        const channels: IChannel[] = this.get("Channels");
        if (!channels || channels.length < 1) {
            return 0;
        }
        let closestChannel: number = channels[0].Number;
        let diff = Math.abs(value - closestChannel);
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i];
            if (!returnNonPlayable && !isChannelPlayableOnDevice(channel)) {
                continue;
            }
            const newdiff = Math.abs(value - channel?.Number);
            if (newdiff < diff) {
                diff = newdiff;
                closestChannel = channel?.Number;
            } else if (newdiff > diff) {
                break;
            }
        }
        return closestChannel;
    }

    public static getQualityRights(
        rights: QualityRights<number>[],
        time: number
    ):
        | {
            start: number | undefined;
            end: number | undefined;
            quality: QualityLevelValue[];
            ppvQuality: (QualityLevelValue | false)[];
        }
        | undefined {
        // assert(!!time, "time required");
        const timeRights = rights.filter(
            r => r.s && r.e && r.q && r.s <= time && r.e > time
        );

        if (timeRights.length < 1) {
            return undefined;
        }

        const qualities = timeRights.map(t => t.q || "") || [""];
        const ppvQualities = timeRights.map(t => (t.isPPV && t.q) || "") || [
            ""
        ];

        const starts = timeRights.map(t => t.s);
        const ends = timeRights.map(t => t.e);

        const startCounts = starts.reduce(
            (a: number, c, i, s) =>
                i === 0 ? 1 : s[i] !== s[i - 1] ? a + 1 : a,
            1
        );
        const endCounts = ends.reduce(
            (a: number, c, i, s) =>
                i === 0 ? 1 : s[i] !== s[i - 1] ? a + 1 : a,
            1
        );

        if (
            timeRights.length !== starts.length ||
            timeRights.length !== ends.length ||
            startCounts !== 1 ||
            endCounts !== 1
        ) {
            // assert(false, "strange rights");
            return undefined;
        }
        return {
            start: starts[0],
            end: ends[0],
            quality: qualities,
            ppvQuality: ppvQualities
        };
    }

    public static isPPVRightInRange(
        right: QualityRights<number>,
        time: number
    ): { startsIn?: number; endsIn?: number } | null {
        if (right && right.isPPV && right.s && right.e) {
            const dNow = Date.now();
            if (dNow > right.e) {
                // this PPV offer is in the past
                return null;
            } else if (dNow < right.s) {
                // purchased PPV on this channel scheduled in the future
                // need to tune to the PPV stream at start time
                return { startsIn: right.s };
            } else if (dNow >= right.s && dNow < right.e) {
                // schedule to tune back to Preview stream
                return { endsIn: right.e };
            }
        }
        return null;
    }

    public getServiceGroup(channel: IChannel): ServiceGroup {
        return this.getServiceId(channel).indexOf(
            ServiceCollectionIdPPVSuffix
        ) >= 0
            ? ServiceGroup.PPV
            : ServiceGroup.Standard;
    }

    // don't cache this, it may depend on live rights which depend on current time
    // returns either a serviceCollectionId or serviceCollectionId with PPV suffix
    public getServiceId(channel: IChannel): string {
        const serviceId: string = channel.ServiceCollectionId;
        const lr = channel.LiveRights;
        if (channel.hasPPV && lr) {
            const ppvQualities = <QualityLevelValue[]>[];
            for (const r of lr) {
                const s = LiveChannelMap.isPPVRightInRange(r, Date.now());
                if (s && s.endsIn) {
                    ppvQualities.push(r.q || "");
                }
            }
            if (ppvQualities.length > 0) {
                const validIds = Object.keys(this.ServiceMap);
                // Commented for React
                // ppvQualities = sortQualityLevels(ppvQualities);
                for (const q of ppvQualities) {
                    const qid = serviceId + ServiceCollectionIdPPVSuffix + q;
                    if (validIds.indexOf(qid) >= 0) {
                        return qid;
                    }
                }
                console.error("ppv quality service not present");
            }
        }

        return serviceId;
    }

    // don't cache this, it may depend on live rights which depend on current time
    public getService(channel: IChannel): IService | null {
        const serviceMap: ServiceMap = this.get("ServiceMap");
        const service =
            //@ts-ignore
            channel && serviceMap && serviceMap[this.getServiceId(channel)];
        if (service && channel.ServiceCollectionId && service.DataSource) {
            service.DataSource.appToken = channel.ServiceCollectionId;
        }
        return service;
    }

    public getPipService(channel: IChannel): IService | null {
        const serviceMap: ServiceMap = this.get("PipServiceMap");
        const service =
            //@ts-ignore
            channel && serviceMap && serviceMap[this.getServiceId(channel)];
        if (service && channel.ServiceCollectionId && service.DataSource) {
            service.DataSource.appToken = channel.ServiceCollectionId;
        }
        return service;
    }

    // don't cache these lists unless they get deleted when Channels array changes (store switch)
    public getStationIds(): string[] {
        if (true) {
            this.stationIds = map(this.Channels, "StationId");
        }
        return this.stationIds || [];
    }

    public getValidCatchupStationIds(): string[] {
        return validCatchupStationIds(this.Channels);
    }

    public getChannelNumbers(): number[] {
        if (true) {
            this.channelNumbers = map(this.Channels, "Number");
        }
        return this.channelNumbers || [];
    }

    // Used in background playback
    public getFirstPlayableChannel(): IChannel | null {
        let index = 0;
        const channels = this.get("Channels"),
            len = channels.length;
        while (index < len) {
            const channel = channels[index];
            const service = this.getService(channel);
            const hasApplicationData = channel.ApplicationData;
            const isApplication = channel.IsApplication;
            const isGenericApplicationService =
                channel.IsGenericApplicationService;
            // Skip any app channels or audio channels because they don't play in background
            if (
                service &&
                !isApplication &&
                !hasApplicationData &&
                !isGenericApplicationService
            ) {
                return channel;
            }
            index += 1;
        }
        return null;
    }

    /**
     * Iterate over every channel and call an iterator with
     * an IChannelInfo for each one.
     * @param iterator
     */
    public eachChannelInfo(iterator: (info: any) => void) {
        let index = 0,
            channels = this.get("Channels"),
            len = channels.length;
        while (index < len) {
            const channel = channels[index];
            const service = this.getService(channel);
            iterator({ channel, service });
            index += 1;
        }
    }

    public filterChannels(
        iterator: (channel: IChannel) => boolean
    ): IChannel[] {
        return filter(this.get("Channels"), iterator);
    }
}

export function isChannelPlayableOnDevice(channel: IChannel): boolean {
    const hasApplicationData = channel && channel.ApplicationData;
    const isApplication = channel && channel.IsApplication;
    const isGenericApplicationService =
        channel && channel.IsGenericApplicationService;
    const isAudioChannel = isApplication && isGenericApplicationService;
    if (hasApplicationData || isAudioChannel) {
        return true;
    } else {
        return true;
    }
}


export function getChannelMap(
    catalogCache: ChannelMapInfo,
    channelMapRights: ChannelMapLiveRights,
    validStoreId: string,
    valueLocale: string
): LiveChannelMap {
    const item = new LiveChannelMap(catalogCache, {}, undefined, undefined, validStoreId, valueLocale);

    // we must have a valid channelMapId for any of this to make sense ("precondition")
    // if (!channelMapId) {
    //     item.errorCode = liveTvGuide.FetcherError.ERROR_PRECONDITION_NOT_MET;
    //     errorHandler(item)();
    //     return item;
    // }

    // item.setPersistMaxAge(cachedTTL);

    const channelMapInfo: LiveChannelMapInfo = processChannelMap(
        catalogCache,
        channelMapRights
    );
    // const tifChannels: any[]
    // if (mstv.tif.tifEnabled) {
    //     tifChannels = mstv.tif.getTifData(mstv.tif.TifFeeds.TVCHANNELS) || [];
    // }

    item.resetCurrentStoreChannels();

    // Has to be called here, beacuse of getChannels and channel stores...
    // const tifLiveChannels = mstv.tif.processTifChannels(tifChannels);
    // channelMapInfo.Channels.push(...tifLiveChannels);

    extend(item, channelMapInfo);

    //updated the channels based on the storeId
    item["Channels"] = item.getChannels();

    return item;
}

function processChannelMap(
    data: ChannelMapInfo,
    liveRightsChannel: ChannelMapLiveRights
): LiveChannelMapInfo {
    const inChannels: IChannelCache[] = data.Channels;
    const inServiceCollections: ServiceCollection[] = data.ServiceCollections;
    const inServices: IService[] = data.Services;

    const channels: IChannel[] = [];
    //@ts-ignore
    const servicesByServiceCollectionId: ServiceMap = {};
    //@ts-ignore
    const pipServicesByServiceCollectionId: ServiceMap = {};

    const serviceCollectionsMap: ServiceCollectionsMap = getServiceCollectionsMap(
        inServiceCollections
    );
    const inServicesMapById: ServiceMap = getServiceMap(inServices);
    const channelLength = inChannels.length;

    //  Cache the channel count per store
    //  key: store name.
    const multipleStoreChannelMap: {
        [key: string]: LiveChannelStore;
    } = {};
    let channelIndex = 0;

    for (let i = 0; i < channelLength; i++) {
        const inChannel: IChannelCache = inChannels[i];

        const hasApplicationData = inChannel.StationType === "Application";
        const isApplication = inChannel.IsApplication;
        const isGenericApplicationService =
            inChannel.IsGenericApplicationService;
        const isAudioChannel = isApplication && isGenericApplicationService;
        const isApp = hasApplicationData || isAudioChannel;
        const now = Date.now();
        const channelRights =
            liveRightsChannel.channels[inChannel.ChannelNumber];
        const hasLiveRights =
            channelRights &&
            some(
                channelRights,
                s => !!s.s && !!s.e && Date.parse(<string>s.e) > now
            );
        let processedChannelRights: QualityRights<number>[] = [];

        // if channelRights is empty array, channel is unsubscribed by available
        if (channelRights?.length) {
            // parse dates to number type once here for faster processing
            processedChannelRights = (channelRights || []).map(
                (lr: QualityRights<string>) => {
                    const plr = <QualityRights<number>>(<any>lr);
                    if (lr.s) {
                        plr.s = Date.parse(lr.s);
                    }
                    if (lr.e) {
                        plr.e = Date.parse(lr.e);
                    }
                    return plr;
                }
            );
        }

        const serviceCollectionId = inChannel.ServiceCollectionId;
        if (strUtils.isNullOrWhiteSpace(inChannel.ServiceCollectionId)) {
            console.error(
                "SDK live.getChannelMap: malformed channel found, null or empty ServiceCollectionId: " +
                JSON.stringify(inChannel)
            );
            continue;
        }

        const inServiceCollection: ServiceCollection =
            serviceCollectionsMap[serviceCollectionId];
        if (!inServiceCollection) {
            // No service collection for this channel.
            continue;
        }

        // for each service of a channel
        const serviceItems: ServiceItem[] = inServiceCollection.ServiceItems;
        if (!serviceItems || serviceItems.length < 1) {
            // No serviceItems in the service collection for this channel. Skip the channel.
            continue;
        }

        let hasPPV = false;
        const services: IService[] = [];
        const ppvServices: IService[] = [];
        const serviceItemsLength = serviceItems.length;
        for (let j = 0; j < serviceItemsLength; j++) {
            const serviceItem: ServiceItem = serviceItems[j];
            const serviceId: string = serviceItem.ServiceId;
            if (strUtils.isNullOrWhiteSpace(serviceId)) {
                console.error(
                    "SDK live.getChannelMap: malformed service item found, null or empty ServiceId: " +
                    JSON.stringify(serviceItem) +
                    " in service collection: " +
                    JSON.stringify(inServiceCollection)
                );
                continue;
            }
            //@ts-ignore
            const inService: IService | null = inServicesMapById[serviceId];
            if (!inService) {
                // No service found for this serviceId.
                continue;
            }
            if (
                !inChannel.IsApplication &&
                serviceItem.ServiceGrouping === ServiceGroup.PPV
            ) {
                if (hasLiveRights) {
                    hasPPV = true;
                    ppvServices.push(inService);
                }
            } else {
                services.push(inService);
            }
        }

        if (services.length < 1 && ppvServices.length < 1) {
            // There are no services associated with this channel/ servicecollection. Skip the channel.
            continue;
        }

        // Check for App services before we filter out the services and pass it into the channel datastructure
        const appServices: IService[] = filter(services, (s: IService) => {
            return s.Type === ServiceType.Application; // Application
        });

        const processedChannelInfo = processChannel(
            inChannel,
            processedChannelRights,
            appServices,
            hasPPV
        );

        // Check for Applications that will be a channel and save the service which has the url for the application to be launched
        if (isApp) {
            //@ts-ignore
            servicesByServiceCollectionId[serviceCollectionId] = appServices[0];
        } else {
            processServices(
                services,
                processedChannelInfo,
                servicesByServiceCollectionId,
                pipServicesByServiceCollectionId,
                serviceCollectionId,
                false
            );
            if (ppvServices.length) {
                processServices(
                    ppvServices,
                    processedChannelInfo,
                    servicesByServiceCollectionId,
                    pipServicesByServiceCollectionId,
                    serviceCollectionId,
                    true
                );
            }
        }

        createMultiStoreChannelMap(
            processedChannelInfo,
            channelIndex++,
            multipleStoreChannelMap
        );
        channels.push(processedChannelInfo);
    }

    return {
        Channels: channels,
        //@ts-ignore
        ServiceMap: servicesByServiceCollectionId,
        //@ts-ignore
        PipServiceMap: pipServicesByServiceCollectionId,
        ChannelMapId: liveRightsChannel.channelMapId,
        ChannelEquivalences: data.ChannelEquivalences,
        MultipleStoreChannelMap: multipleStoreChannelMap
    };
}

function getServiceCollectionsMap(
    inServiceCollections: ServiceCollection[]
): ServiceCollectionsMap {
    const serviceCollectionsMap: ServiceCollectionsMap = {};
    const serviceCollectionLength = inServiceCollections.length;
    for (let i = 0; i < serviceCollectionLength; i++) {
        const inServiceCollection = inServiceCollections[i];

        if (strUtils.isNullOrWhiteSpace(inServiceCollection.Id)) {
            // console.error(
            //     "udl.live.getChannelMap: malformed service collection found, null or empty Id: " +
            //         JSON.stringify(inServiceCollection)
            // );
            continue;
        }

        serviceCollectionsMap[inServiceCollection.Id] = inServiceCollection;
    }

    return serviceCollectionsMap;
}

function getServiceMap(inServices: IService[]): ServiceMap {
    //@ts-ignore
    const serviceMap: ServiceMap = {};
    for (let i = 0; i < inServices.length; i++) {
        const inService = inServices[i];

        if (strUtils.isNullOrWhiteSpace(inService.Id)) {
            // console.error(
            //     "udl.live.getChannelMap: malformed service found, null or empty Id: " + JSON.stringify(inService)
            // );

            continue;
        }

        if (
            inService.Type === ServiceType.LIVESMOOTHSTREAMING ||
            inService.Type === ServiceType.HLSPLAYBACK ||
            inService.Type === ServiceType.MULTICAST_RTP
        ) {
            // setting the Service Uri

            // Commented for React
            // if (
            //     inService.Type === ServiceType.LIVESMOOTHSTREAMING ||
            //     ((userAgent.isLivePlaybackRTPOnly || (<any>window).Platform.supportsCapability(Capability.RTP_Live)) &&
            //         inService.Type === ServiceType.MULTICAST_RTP)
            // ) {
            //     inService.ServiceUri = inService.ServiceUrl;
            // } else

            if (inService.Type === ServiceType.HLSPLAYBACK) {
                let hostName: string;
                hostName = inService.HostName;

                // Commented for React
                // if (strUtils.isNullOrWhiteSpace(inService.HostName)) {
                //     hostName = env.defaultAccHostName;
                // } else {
                //     hostName = inService.HostName;
                // }

                inService.DataSource = {
                    mediaId: inService.MediaId,
                    hostName,
                    ownerId: inService.OwnerId,
                    cdnURL: "",
                    isLive: true
                };
            } else {
                inService.ServiceUri = inService.ServiceUrl;
            }
        }
        //@ts-ignore
        serviceMap[inService.Id] = inService;
    }

    return serviceMap;
}

// updates processedChannelInfo and servicesByServiceCollectionId with processed service info


function getHighestQualityService(services: IService[]): IService | null {
    const orderedQualityLevelsWithInvalid: string[] = <string[]>(
        orderedQualityLevels.slice(0)
    );
    orderedQualityLevelsWithInvalid.push("Invalid"); // FUTURE: Remove this when data fix is applied to server. Add the QualityLevel 'Invalid' at the end, if all others fail
    for (const qualityLevel of orderedQualityLevelsWithInvalid) {
        for (const service of services) {
            if (service.QualityLevel === qualityLevel) {
                return service;
            }
        }
    }

    return null;
}
export function processServices(
    services: IService[],
    processedChannelInfo: IChannel,
    servicesByServiceCollectionId: ServiceMap,
    pipServicesByServiceCollectionId: ServiceMap,
    serviceCollectionId: string,
    isForPPV: boolean
): void {
    let sameTypeServices: IService[] = [];

    each(services, (s: IService) => {
        if (s.Type === ServiceType.MULTICAST_RTP) {
            processedChannelInfo.hasMulticastRTPServiceType = true;
        } else if (s.Type === ServiceType.HLSPLAYBACK) {
            processedChannelInfo.hasHLSServiceType = true;
        }
    });

    // Check for RTP service being playable and recordable
    sameTypeServices = filter(services, (s: IService) => {
        return (
            s.Type === ServiceType.MULTICAST_RTP &&
            s.ServiceIntent === "FullScreen"
        ); // RTP and ServiceIntent is Fullscreen
    });

    sameTypeServices = filterLiveRestrictions(
        sameTypeServices,
        processedChannelInfo
    );

    if (sameTypeServices.length > 0) {
        processedChannelInfo.playOnSTB = true;
    }

    sameTypeServices.length = 0;
    // TODO: Check this
    // if (
    //     userAgent.isLivePlaybackRTPOnly ||
    //     (<any>window).Platform.supportsCapability(Capability.RTP_Live)
    // ) {
    //     // take the highest quality
    // } else {
    //     // emptying out the array as we cant use RTP services
    //     sameTypeServices.length = 0;
    // }

    if (sameTypeServices.length === 0) {
        // not UCSTB or, is UCSTB but no service found yet
        sameTypeServices = filter(services, (s: IService) => {
            return (
                s.Type === ServiceType.HLSPLAYBACK &&
                s.ServiceIntent === "FullScreen"
            ); // HLS and ServiceIntent is Fullscreen
        });

        sameTypeServices = filterLiveRestrictions(
            sameTypeServices,
            processedChannelInfo
        );

        if (sameTypeServices.length > 0) {
            // take the highest quality
            processedChannelInfo.playOnSTB = true; // STB's are assumed to play HLS too.
        } else {
            sameTypeServices = services.filter((s: IService) => {
                return s.Type === ServiceType.LIVESMOOTHSTREAMING; // SMOOTH STREAMING
            });

            sameTypeServices = filterLiveRestrictions(
                sameTypeServices,
                processedChannelInfo
            );
        }
    }

    if (sameTypeServices.length > 0) {
        let listsameTypeServices = sameTypeServices.filter(service => {
            return service;
            // Todo: CHeck this
            // if (!isDPSecurityEnabled(service)) {
            //     return service;
            // }
            // return null;
        });
        sameTypeServices =
            listsameTypeServices.length > 0 ? listsameTypeServices : [];
    }
    if (sameTypeServices.length > 0) {
        if (isForPPV) {
            const id = serviceCollectionId + ServiceCollectionIdPPVSuffix;
            sameTypeServices.forEach(s => {
                //@ts-ignore
                servicesByServiceCollectionId[id + s.QualityLevel] = s;
            });
        } else {
            //@ts-ignore
            servicesByServiceCollectionId[
                serviceCollectionId
            ] = getHighestQualityService(sameTypeServices);
        }
    }
}

export function filterLiveRestrictions(
    sameTypeServices: IService[],
    channel: IChannel
): IService[] {
    let overallPermitted: number = 0;
    let allowedServices: IService[] = [];
    if (sameTypeServices.length > 0) {
        allowedServices = sameTypeServices.filter((s: IService) => {
            for (let right of channel.LiveRights) {
                if (right.q === s.QualityLevel) {
                    if (!right.r) {
                        // there are no restrictions and we have a subscription
                        // no restrictions and we have a STB subscription, by default recording should be enabled.
                        if (s.Type === ServiceType.MULTICAST_RTP) {
                            channel.recordOnSTB = true;
                        }

                        channel.isSubscribed = true;
                        channel.isPermitted = true;
                        overallPermitted++;
                        return true;
                    }

                    let restrictions: string[] = right.r.split(","); // check restrictions
                    //Check for DVR restrictions for RTP services
                    if (s.Type === ServiceType.MULTICAST_RTP) {
                        channel.recordOnSTB = !(
                            includes(restrictions, RestrictionsType.LB) &&
                            includes(restrictions, RestrictionsType.NB)
                        );
                    }

                    channel.isSubscribed = true;
                    //@ts-ignore
                    channel.isPermitted = isPlayable(restrictions);
                    if (channel.isPermitted) {
                        overallPermitted++;
                    }
                    return channel.isPermitted;
                }
            }

            return false;
        });
    }
    channel.isPermitted = overallPermitted ? true : false;
    return allowedServices;
}
function processChannel(
    inChannel: IChannelCache,
    liveRights: QualityRights<number>[],
    appServices: IService[],
    hasPPV: boolean
): IChannel {
    // Empty variable means that there is no proper image for channel's logo.
    let channelLogoImageUri = "";
    const dict: IAppService[] = [];
    let applicationData: IApplicationData | undefined;

    // If there are any images associated with the channel.
    if (inChannel.Images && inChannel.Images.length > 0) {
        // We need to find the index of an image that will be used as a channel's logo.
        for (let j = 0; j < inChannel.Images.length; j++) {
            const image = inChannel.Images[j];

            if (
                image.ImageType &&
                (<string>image.ImageType).toLowerCase() === "icon" &&
                image.Size &&
                image.Size.toLowerCase() === "small" &&
                image.Uri &&
                !strUtils.isEmpty(image.Uri)
            ) {
                channelLogoImageUri = image.Uri;
                break;
            }
        }
    }

    if (inChannel.StationType === "Application" && inChannel.ApplicationId) {
        applicationData = {
            ApplicationId: inChannel.ApplicationId,
            Description: inChannel.Description,
            Images: inChannel.Images,
            Name: inChannel.Name,
            Ratings: inChannel.Ratings,
            StationType: inChannel.StationType
        };

        // Temp commented for React
        // if (zones.getCurrentStoreId() !== "HubsAndFeeds-Adult" || inChannel.IsAdult) {
        //     const appData = udl.typed.discovery.getApplicationDataById(inChannel.ApplicationId);
        //     udl.waitFor(appData).done(() => {
        //         $.extend(applicationData, appData.attributes);
        //     });
        // }
    } else {
        // store the service usage and service URL to launch the subscription app
        if (appServices.length > 0) {
            for (let k = 0; k < appServices.length; k++) {
                dict.push({
                    Usage: appServices[k].Usage,
                    ServiceUrl: appServices[k].ServiceUrl
                });
            }
        }
    }

    // We create optimised channel object.
    return {
        ApplicationData: applicationData,
        Number: inChannel.ChannelNumber ? inChannel.ChannelNumber : 0,
        CallLetters: inChannel.CallLetters ? inChannel.CallLetters : "",
        LastCatchupEndUtc: inChannel.LastCatchupEndUtc,
        FirstCatchupStartUtc: inChannel.FirstCatchupStartUtc,
        Name: inChannel.Name ? inChannel.Name : "",
        StationId: inChannel.StationId ? inChannel.StationId : "",
        // Temp commented for React
        // LogoUri: channelLogoImageUri ? images.checkImageUrl(channelLogoImageUri) : channelLogoImageUri,
        LogoUri: channelLogoImageUri,
        LiveRights: liveRights || [],
        AppService: dict || null,
        ServiceCollectionId: inChannel.ServiceCollectionId
            ? inChannel.ServiceCollectionId
            : "",
        ProviderId: inChannel.ProviderId,
        isSubscribed: false,
        isPermitted: false,
        isAdult: inChannel.IsAdult,
        hasPPV, // will be set later
        recordOnSTB: false,
        playOnSTB: false,
        hasMulticastRTPServiceType: false,
        hasHLSServiceType: false,
        Genres: inChannel.Genres || [],
        StationType: inChannel.StationType,
        LocalizedStoresIds: inChannel.LocalizedStoresIds,
        ConcurrentViewerDisabled: inChannel.ConcurrentViewerDisabled,
        IsApplication: inChannel.IsApplication || false,
        IsGenericApplicationService:
            inChannel.IsGenericApplicationService || false
    };
}
const splitSupportStore = (
    SupportedStore: string
): [boolean, string, string] => {
    //  filter out PF stores.
    if (!strUtils.startsWith(SupportedStore, "HubsAndFeeds")) {
        return [false, "", ""];
    }

    const parts = SupportedStore.split("-"); //  validate the store

    if (parts.length !== 4) {
        return [false, "", ""];
    }

    return [
        true,
        [parts[0], parts[1]].join("-"),
        [parts[2], parts[3]].join("-")
    ];
};

const createMultiStoreChannelMap = (
    channel: IChannel,
    channelIndex: number,
    multipleStoreChannelMap: { [key: string]: LiveChannelStore }
) => {
    //   multiple store.  for s74 and later.
    //   per design on server side, a channel will always have LocalizedStoresIds field for s74 or later.  Otherwise, file a bug for UC Live team :)
    each(channel.LocalizedStoresIds, (supportedStore: string) => {
        const [valid, storeId, locale] = splitSupportStore(supportedStore);

        if (valid) {
            if (!multipleStoreChannelMap[storeId]) {
                multipleStoreChannelMap[storeId] = new LiveChannelStore(
                    storeId,
                    channel.isAdult
                );
            }
            const store: LiveChannelStore = multipleStoreChannelMap[storeId];
            const localeMap: LiveChannelLocaleMap = store.addLiveChannelLocaleMap(
                locale
            );
            localeMap.addChannel(channelIndex);
            localeMap.addStationType(channel.StationType);
            localeMap.addGenres(channel.Genres);
        }
    });
};

export function makeSlabUrl(
    endPoint: string,
    channelMapId: number,
    dateStr: string,
    slot: number
): string {
    console.info("makeSlabUrl", dateStr, JSON.stringify(dateStr));
    const folderName = ["schedules-data", dateStr].join("-");
    const slabFileName =
        channelMapId + "_" + DateUtils.padLeftWithZero(slot) + ".gz";

    return endPoint + folderName + "/" + slabFileName;
}

export function buildNowNextMap(
    scheduleMap: any,
    channelMap: LiveChannelMap,
    date?: Date
): NowNextScheduleMap {
    if (!date) {
        date = DateUtils.getNewDate();
    }
    const dateTime = date.getTime();

    const stationIds: string[] = channelMap.getStationIds();

    if (buildNowNextMapArgsEqual(scheduleMap, stationIds, date)) {
        return buildNowNextMap_lastNowNextScheduleMap;
    }

    const nowNextMap: NowNextScheduleMap = {};

    for (let s = 0; s < stationIds.length; s++) {
        const stationId = stationIds[s];

        if (nowNextMap[stationId] == null) {
            nowNextMap[stationId] = <NowNextSchedule>{};
        }

        const stationSchedules: LiveSchedule[] = getStationSchedules(
            scheduleMap,
            stationId
        );

        if (!stationSchedules) {
            continue;
        }

        const nowNextEntry = nowNextMap[stationId];

        for (let i = 0; i < stationSchedules.length; i++) {
            const schedule = stationSchedules[i];

            schedule.channel = channelMap
                .getChannels()
                .find(channel => channel.StationId == stationId);

            const start = new Date(schedule.StartUtc);
            const end = new Date(schedule.EndUtc);
            if (start.getTime() > dateTime) {
                nowNextEntry.next = schedule;
                break;
            }

            if (start.getTime() <= dateTime && end.getTime() > dateTime) {
                nowNextEntry.now = schedule;

                const nextSchedule = stationSchedules[i + 1];

                if (nextSchedule && nextSchedule.start === schedule.end) {
                    nowNextEntry.next = nextSchedule;
                }

                break;
            }
        }
    }

    buildNowNextMap_lastScheduleMap = scheduleMap;
    buildNowNextMap_lastStationIds = stationIds;
    buildNowNextMap_lastDate = date.getTime();
    buildNowNextMap_lastNowNextScheduleMap = nowNextMap;
    return nowNextMap;
}

export function buildNowNextMapArgsEqual(
    scheduleMap: any,
    stationIds: string[],
    date: Date
): boolean {
    if (!buildNowNextMap_lastNowNextScheduleMap) {
        return false;
    }

    const scheduleMapParamsKeys: string[] = scheduleMap.params
        ? Object.keys(scheduleMap.params)
        : [];
    const lastParamsKeys: string[] = buildNowNextMap_lastScheduleMap.params
        ? Object.keys(buildNowNextMap_lastScheduleMap.params)
        : [];

    if (
        stationIds.length === buildNowNextMap_lastStationIds.length && // store change
        scheduleMap.length === buildNowNextMap_lastScheduleMap.length &&
        scheduleMapParamsKeys.length === lastParamsKeys.length &&
        scheduleMap.expires === buildNowNextMap_lastScheduleMap.expires &&
        scheduleMap.persistExpires ===
        buildNowNextMap_lastScheduleMap.persistExpires &&
        scheduleMap.id === buildNowNextMap_lastScheduleMap.id &&
        // compare stationIds, assuming stationIds are in the same order
        stationIds.every(function (cv, i) {
            return buildNowNextMap_lastStationIds[i] === cv;
        }) &&
        // compare params
        scheduleMapParamsKeys.every(function (cv) {
            return (
                buildNowNextMap_lastScheduleMap.params[cv] ===
                scheduleMap.params[cv]
            );
        }) &&
        date.getTime() <= buildNowNextMap_lastDate + 3000
    ) {
        return true;
    }
    return false;
}
export function getStationSchedules(
    scheduleMap: any,
    stationId: string
): LiveSchedule[] {
    // resolve station index.
    const models = scheduleMap.filter(
        (item: any) => item.StationId === stationId
    );
    if (models.length) {
        return models;
    }
    return [];
}

export function makeId(...args: any[]): string {
    // no "/" allowed in ids, since it conflicts with prefixes.
    return args.join(" ").replace(/[/\[\]]/g, "|");
}

export function createLiveShowcardModel(channel: IChannel, channelMap: LiveChannelMap, nowNextScheduleMap: NowNextScheduleMap, listId: string, listParams: any): any {
    if (!channel) {
        return undefined;
    }
    let schedule = nowNextScheduleMap[channel.StationId]?.now || null;
    let id;
    let service = channelMap.getService(channel);
    let pipService = channelMap.getPipService(channel);
    if (schedule) {
        id = makeId(channel?.Number, schedule.Name, schedule.StationId, schedule.EndUtc);
    } else {
        id = makeId(channel?.Number, channel.Name, channel.StationId, channel.ServiceCollectionId, (service && service.Id));
    }

    let liveShowcardModel = {
        id: listId,
        params: listParams,
        ChannelInfo: {
            channel: channel,
            service: service,
            pipService: pipService
        },
        Schedule: schedule,
        type: SourceType.LIVE,
    };

    (liveShowcardModel as any)["$type"] = generateType(liveShowcardModel, SourceType.LIVE)

    return liveShowcardModel;
}

export const updateVariant = (channelMap: LiveChannelMap, nowNextScheduleMap: NowNextScheduleMap, filterSearchItems: ISearchFilters, idx: number = 0, lastIndex: number = 0, genre: string) => {
    const genrePivot = filterSearchItems?.Genres || [];

    var playableChannels: IChannel[] = channelMap.filterChannels(
        (channel) => !!channel.IsTif || (channel.isSubscribed && channel.isPermitted && channelMap.getService(channel) != null)
    );

    //Genre based content
    let genrePlayableChannelsMap: IChannel[] = []
    const keys = Object.keys(nowNextScheduleMap);
    if (genre) {
        playableChannels.map((channel) => {
            if (keys.includes(channel.StationId)) {
                genrePlayableChannelsMap?.push(channel);
            }
        })
    } else {
        genrePlayableChannelsMap = playableChannels
    }

    const qualityFilter: string = "";
    let idxmax: number = 16 + idx; // batch
    let list = [];
    if (genrePlayableChannelsMap?.length) {
        for (; idx < Math.min(genrePlayableChannelsMap?.length, idxmax); idx++) {
            let ch = genrePlayableChannelsMap[idx];

            let newChannelModel = createLiveShowcardModel(ch, channelMap, nowNextScheduleMap, "live/feeds/playableChannels/", { $top: 16 });

            if (!newChannelModel) {
                continue;
            }

            let uniqueId;
            if (newChannelModel.$type === "EPISODE-LIVE") {
                uniqueId = "series-" + newChannelModel.Schedule.SeriesId;
            } else if (!!ch.IsTif) {
                uniqueId = "channel-" + newChannelModel.ChannelInfo?.channel?.Number.toString();
            } else {
                uniqueId = "station-" + ch.StationId;
            }
            newChannelModel["DynamicId"] = uniqueId;
            var entitlements = newChannelModel['Entitlements'] || [];
            var entitlementsOk: boolean =
                (false || isPlayable(entitlements));
            var isAgeLocked: boolean = false;

            list.push(newChannelModel);
        }
    }
    return list;
};