export enum Protocol {
    http = "http",
    https = "https"
}

export interface NameValueString {
    name: string;
    value: string;
}

export interface Config {
    authenticationType: "web" | "native" | undefined;
    checkedInProfileId: string | undefined,
    csrfToken: string | undefined;
    authToken: string | undefined;
    refreshToken: string | undefined;
    oauth: string | undefined;
    tenant: string | undefined;
    deviceId: string | undefined;
    deviceType: string | undefined;
    netInfo: any | undefined;
    protocol: Protocol | undefined;
    hostname: string | undefined;
    supportedLocales: NameValueString[] | undefined;
    currentLocale: {
        full: string;
        short: string;
        isRTL: boolean;
    } | undefined;
    deviceInfo: DeviceInfo | undefined;
    needAuthentication: boolean;
    adultToken: undefined
}

export interface DeviceInfo {
    deviceType: DeviceType;
    os: OS;
    connectionInfo?: string;
    netInfo: any;
}

export enum DeviceType {
    Mobile = "Mobile",
    Tablet = "Tablet",
    TV = "TV",
    Unknown = "Unknown",
}

export enum OS {
    android = "android",
    ios = "ios",
    web = "web",
    macos = "macos",
    windows = "windows",
}

export interface UserAgent {
    is1ft: boolean;
    is2ft: boolean;
    is10ft: boolean;
    isAndroid: boolean;
    isIOS: boolean;
    isWeb: boolean;
}

export const config = {
    skin: "mr.default.pprod",
    id: "applicationConfig",
    name: "Application Configuration",
    whyDidYouRun: false, // developer config, to be turned on for perf log generation, default value 'false'.
    protocol: "https" as Protocol,
    hostname: "reachclient.pprod.mr.tv3cloud.com",
    buildVersion: "1.8(11)",
    deviceId: (global as any).deviceId,
    deviceType: "AppleTV",
    prefixType: "10ft",
    oauth: "LIVEID",
    tenantId: "default",
    authenticationType: "native",
    allowPinReset: true,
    allowAdultLocks: true,
    adultContentMasking: true,
    allowPurchase: false,
    parentalControlsMultipPin: false,
    defaultFeedItemsCount: 16,
    defaultSkip: 0,
    defaultOrderBy: "Popularity",
    longPressThreshold: 500,
    inhomeDetection: {
        inHomeDefault: false,
        connectionUrl: "mkinhome.azurewebsites.net",
        inHomeApiEndpoint: "/v1/ihd/users/userAccount/{accountId}/isInHome",
        useSubscriberInHome: false,
    },
    excludeStores: {
        disableZones: true,
    },
    audioLanguages: {
        primary: "en",
        secondary: "fr",
        tracks: ["en", "fr", "es", "de", "sa", "hi", "kn", "pt"],
    },
    onScreenLanguage: {
        primary: "en-US",
        tracks: ["en-US", "fr-CA", "en-CA", "es-CL", "hu-HU"],
    },
    subtitleLanguages: {
        primary: "en",
        secondary: "fr",
        tracks: ["en", "fr", "es", "de", "sa", "hi", "kn", "pt"],
    },
    bitrates10ft: [
        {
            localizedText: "str_bitrate_option_0",
            id: "51200",
            icon: "quality_best",
            default: true,
        },
        {
            localizedText: "str_bitrate_option_1",
            id: "2884",
            icon: "quality_better",
        },
        {
            localizedText: "str_bitrate_option_2",
            id: "1500",
            icon: "quality_good",
        },
    ],
    settings: {
        developerEnabled: false,
        subtitleEnabled: true,
        audioLanguageEnabled: true,
    },
    profileNameMaxLength: 20,
    numberOfProfiles: 8,
    playerConfig: {
        owner_uid: "azuki",
        sourceType: "DASH",
        HidePlayerControlsTimerInSec: 5,
        HideFeedbackControlsTimerInSec: 2,
        ForceHideFeedbackControlsTimerInSec: 5,
        areYouStillWatchingTimerInMin: 240,
        supportedEncodings: {
            Jitp: 1,
        },
        audioDescriptionTrackLanguageCode: ["est", "afr", "enm", "frm"],
        skipBackSeconds: 7,
        skipForwardSeconds: 30,
        bookmarkCreditThresholdSeconds: 0,
        playerKey: "91178fce-cecc-43a2-b10a-9739a2e943bd",
        analyticsKey: "aa90e028-1ae1-4503-a1ee-043fc7c29d2b",
    },
    search: {
        trending: {
            pivot: {
                Id: "LicenseWindow",
                Name: "New",
                feedMovies: "movies",
                feedTvShows: "tvshows",
            },
        },
    },
    guide: {
        guideFilteredFeed: {
            isEnabled: true,
            hubName: "Live TV",
            feedUri: {
                Id: "GuideFilterFeed",
                Layout: "Category",
                Name: "",
                NavigationTargetUri: "liveTvGuide",
                NavigationTargetVisibility: "ClientDefined",
                ShowcardAspectRatio: "Mixed",
                Uri: "uidef://GuideFilterFeed/",
                FeedType: "Dynamic",
            },
            ["uidef://GuideFilterFeed/"]: [
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allChannels/",
                    image16x9KeyArtURL: {
                        uri: "res://drawable/default/AllChannels.png",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_channels",
                    title: "All Channels",
                    Name: "All Channels",
                    ItemType: "liveTvGuide",
                    filterId: undefined,
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allNews/",
                    image16x9KeyArtURL: {
                        uri: "res://drawable/default/News.png",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_news",
                    title: "News",
                    ItemType: "liveTvGuide",
                    filterId: "News",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allSports/",
                    image16x9KeyArtURL: {
                        uri: "res://drawable/default/Sports.png",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_sports",
                    title: "Sports",
                    ItemType: "liveTvGuide",
                    filterId: "Sports",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allMusic/",
                    image16x9KeyArtURL: {
                        uri: "res://drawable/default/Music.png",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_music",
                    title: "Music",
                    ItemType: "liveTvGuide",
                    filterId: "Music",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allChildren/",
                    image16x9KeyArtURL: {
                        uri: "res://drawable/default/Children.png",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_children",
                    title: "Children",
                    ItemType: "liveTvGuide",
                    filterId: "Children",
                },
            ],
        },
        epgConfig: {
            font: {
                H1: {
                    file: "Inter-Bold.ttf",
                    size: "58",
                    color: "#F1F1F1FF",
                },
                H2: {
                    file: "Inter-Bold.ttf",
                    size: "24",
                    color: "#F1F1F1FF",
                },
                H3: {
                    file: "Inter-SemiBold.ttf",
                    size: "22",
                    color: "#F1F1F1FF",
                },
                H4: {
                    file: "Inter-SemiBold.ttf",
                    size: "20",
                    color: "#F1F1F1FF",
                },
                tag: {
                    file: "Inter-Regular.ttf",
                    size: "20",
                    color: "#F1F1F180",
                },
                body: {
                    file: "Inter-SemiBold.ttf",
                    size: "16",
                    color: "#F1F1F180",
                },
            },
            view: {
                backgroundColor: "#00000000",
                focusColor: "#053C69",
            },
            filterButton: {
                backgroundColor: "#424242FF",
                backgroundFocusColor: "#082A4A",
            },
            filterToggleButton: {
                backgroundFocusColor: "#082A4A",
            },
            list: {
                verticalStreamingRange: 2.0,
                horizontalStreamingRange: 1.4,
            },
            button: {
                backgroundColor: "#424242FF",
                backgroundfocusColor: "#082A4A",
                jumpToDate: {
                    enabled: true,
                },
                filter: {
                    enabled: true,
                },
                favorites: {
                    enabled: false,
                },
                clearFilters: {
                    enabled: false,
                },
            },
            cell: {
                backgroundColor: "#20212499",
                live: {
                    backgroundColor: "#202124",
                },
                layoutThreshold: {
                    medium: 0.5,
                    small: 0.33334,
                    xsmall: 0.1,
                },
            },
            time: {
                scaleMinutes: 30,
                marker: {
                    backgroundColor: "#E7A22F",
                    format: "%I:%M",
                    text: {
                        color: "#1F1F1FFF",
                    },
                },
                list: {
                    format: "%I:%M %p",
                },
                days: {
                    forward: 7,
                    backward: 1,
                },
            },
            icon: {
                favorite: {
                    active: {
                        uri: "Heart.png",
                    },
                    inactive: {
                        uri: "Heart-empty.png",
                    },
                },
            },
            overlay: {
                filters: {
                    enabled: true,
                    fullScreen: true,
                },
                programDetails: {
                    enabled: false,
                    fullScreen: false,
                },
            },
            filterLocalData: {
                enabled: false,
            },
            // @TODO Get filters from Redux Reducer
            filters: [
                {
                    title: "Filter By",
                    entries: [
                        {
                            title: "Favorite Channels",
                            tag: "Favorites",
                        },
                    ],
                },
                {
                    title: "Category",
                    entries: [
                        {
                            title: "Children",
                            tag: "Children",
                            stringId: "all_children",
                        },
                        {
                            title: "Music",
                            tag: "Music",
                            stringId: "all_music",
                        },
                        {
                            title: "Sports",
                            tag: "Sports",
                            stringId: "all_sports",
                        },
                        {
                            title: "News",
                            tag: "News",
                            stringId: "all_news",
                        },
                    ],
                },
                {
                    title: "Quality",
                    entries: [
                        {
                            title: "SD",
                            tag: "SD",
                        },
                        {
                            title: "HD",
                            tag: "HD",
                        },
                        {
                            title: "4K",
                            tag: "UHD",
                        },
                    ],
                },
            ],
            strings: {
                cancel: "cancel",
                clear: "clear",
                confirm: "confirm",
                date: "date",
                emptyChannels: "empty_channels",
                emptyFavoriteChannels: "empty_favorite_Channels",
                emptyResults: "empty_results",
                favoriteChannels: "favorite_channels",
                filters: "filters",
                jumpToLive: "jump_to_live",
                multiple: "multiple",
                selectDate: "select_date",
                selectedFilter: "selected_filter",
                selectFilters: "select_filters",
                today: "today",
                tomorrow: "tomorrow",
                viewAll: "view_all",
                yesterday: "yesterday",
            },
            scrollLimited: {
                enabled: true,
            },
        },
        defaultNetworkLogo:
            "htmlapp/${customized_Build_Id}/images/Genre/channel_logo_placeholder_72x54.png",
    },
    hubs: {
        feeds: {
            Continue: {
                itemTypes: "Title,Catchup,Recording",
            },
            default: "Title",
        },
    },
    notificationsConfig: {
        duration: 5000,
        tick: 100,
    },
    dvr: {
        enableAllChannels: true,
        inProgressMinBufferMsec: 60000,
        inProgressPlaybackDisabled: false,
        restrictedRecording: true,
    },
    appInsights: {
        InstrumentationKey: "f857600d-1346-44e2-bb59-8c5e96430833",
    },
    analytics: {
        isEnabled: true,
        intervalMilliSec: 300000,
        maxSize: 800000,
        warnSize: 5000000,
    },
    easConfig: {
        epochMillisecondsDiff: 2208988800000,
        EAS_TITLE_MAX_LENGTH: 30,
        geoCodeLength: 7,
        validGeoCodeRegex: /^\d{7}$/,
        part2Length: 2,
        part3Length: 3,
        globalGeoCode: "0000000",
        template:
            "[!fips:{0}],[[[EXP:{1}],[MAX:1],[SHARE:EXP;BEG],[BEG:{2}],[WHEN:00:00:00],[EVENT:page:eas2.xml?__MPFLayer=eas2&tid={23}]],[[MAX:1],[WHEN:{6}],[EVENT:#urn:microsoft:mediaroom:action:eas:audio2end]],[[ID:{23}],[#title:{7}],[#body:{9}],[#title({11}):{10}],[#body({11}):{12}],[#title({14}):{13}],[#body({14}):{15}],[#title({17}):{16}],[#body({17}):{18}],[#title({20}):{19}],[#body({20}):{21}],[#easaudio:eas://{4}:{5}],[#priority:{3}],[#extdata0:{22}],[#alerttype:{24}],[#alertShortCode:{25}]]]",
        audioRefreshIntervalSeconds: 86400,
        customMessageRegex: "",
        customTitleRegex: "",
    },
    pconConfig: {
        ratingProvider: {
            default: ["MPAA", "USTV", "EIRIN"],
        },
        logUnknownRatingSystems: false,
    },
    favoriteConfig: {
        $top: 100,
    },
    udlExpiry: {
        bootstrap: {
            bootstrap: Infinity,
            landing: Infinity,
        },
        discovery: {
            hubs: 3600,
            feed: 3600,
            pivotCategories: 240,
            program: 240,
            promotionalCategories: 240,
            series: 240,
            stores: Infinity, // **
            categoryItems: 240,
            categoriesSubcategories: 240,
            subCategoryItems: 240,
            collectionItems: 0,
            libraryItems: 240,
            libraryPivots: 240,
            catchupPivotItems: 240,
            catchupItems: 240,
            catchupPivots: 240,
            packages: 240,
            packageTitles: 240,
            schedules: 240,
            programSchedules: 240,
            person: 240,
            searchFilters: 0,
            subscriptionPackageCategories: 240,
            subscriptionPackageItems: 240,
            subscriptionPackageCategoryItems: 240,
        },
        search: {
            search: 0,
        },
        subscriber: {
            pinnedItems: 240,
            purchasedItems: 240,
            devices: 240,
            dynamicFeeds: 240,
            locationInfo: 240,
            playOptions: 400,
            profiles: 1500,
            profilesUpdate: 0,
            program: 240,
            series: 240,
            similarItems: 240,
            passcode: 0,
            myStations: 400,
            account: 400,
            packageActions: 240,
            bookmark: 240,
            pinnedItem: 240,
            allRecordingBookmarks: 240,
        },
        live: {
            catalogCache: 1800,
            catchup: typeof 240,
            channelRights: 0,
            scheduleCache: 1300,
            recentlyAired: 1300,
        },
    },
};
