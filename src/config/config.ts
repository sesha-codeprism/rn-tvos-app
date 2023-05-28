export enum Protocol {
    http = "http",
    https = "https"
}
export const config = {
    skin: "skt.default.prodb",
    id: "applicationConfig",
    name: "Application Configuration",
    whyDidYouRun: false, // developer config, to be turned on for perf log generation, default value 'false'.
    protocol: "https" as Protocol,
    hostname: "reachclient.prodb.skt.tv3cloud.com",
    buildVersion: "version.YYYYMMDD.varBuildNum.constBuildNum-commitID",
    deviceId: (global as any).deviceId,
    deviceType: "AppleTV",
    prefixType: "10ft",
    oauth: "LIVEID",
    tenantId: "tenantID",
    authenticationType: "native",
    allowPinReset: true,
    allowAdultLocks: false,
    adultContentMasking: true,
    allowPurchase: false,
    parentalControlsMultipPin: true,
    defaultFeedItemsCount: 16,
    defaultSkip: 0,
    defaultTop: 30,
    defaultOrderBy: "Popularity",
    longPressThreshold: 500,
    inhomeDetection: {
        inHomeDefault: false,
        connectionUrl: "mediafirst.bsm.esb-qa.sasktel.com",
        inHomeApiEndpoint:
            "/rest/ST_Process_MaxProvisioning/REST/DeviceInHome/{accountId}?jsonFormat=stream",
        useSubscriberInHome: false,
    },
    excludeStores: {
        disableZones: true,
    },
    audioLanguages: {
        primary: "en",
        secondary: "en",
        tracks: ["en"],
    },
    onScreenLanguage: {
        primary: "en-CA",
        tracks: ["en-CA"],
    },
    subtitleLanguages: {
        primary: "en",
        secondary: "en",
        tracks: ["en"],
    },
    bitrates10ft: [
        {
            localizedText: "str_bitrate_option_0",
            id: "7040",
            icon: "quality_best",
            default: true,
        },
        {
            localizedText: "str_bitrate_option_1",
            id: "4324",
            icon: "quality_better",
        },
        {
            localizedText: "str_bitrate_option_2",
            id: "3250",
            icon: "quality_good",
        },
    ],
    settings: {
        developerEnabled: false,
        subtitleEnabled: false,
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
        seekAccumulationTimeout: 1000, // in milliseconds
        seekCompletionTimeout: 10000,
        supportedEncodings: {
            Hls: 1,
            SmoothStreaming: 2,
            Jitp: 3
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
                    id: "live/feeds/allSubscribed/",
                    image16x9KeyArtURL: {
                        uri: "AllChannels",
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
                    id: "live/feeds/allCanadianSatellite/",
                    image16x9KeyArtURL: {
                        uri: "Business",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_canadian_satellite",
                    title: "Canadian Satellite",
                    Name: "Canadian Satellite",
                    ItemType: "liveTvGuide",
                    filterId: "Canadian Satellite",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allDigital/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_digital",
                    title: "Digital",
                    Name: "Digital",
                    ItemType: "liveTvGuide",
                    filterId: "Digital",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allEntertainment/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Entertainment",
                    title: "Entertainment",
                    Name: "Entertainment",
                    ItemType: "liveTvGuide",
                    filterId: "Entertainment",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allFrench/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_French",
                    title: "French",
                    Name: "French",
                    ItemType: "liveTvGuide",
                    filterId: "French",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/fullPowerBroadcast/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_full_power_broadcast",
                    title: "Full Power Broadcast",
                    Name: "Full Power Broadcast",
                    ItemType: "liveTvGuide",
                    filterId: "Full Power Broadcast",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allKids/",
                    image16x9KeyArtURL: {
                        uri: "Children",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_kids",
                    title: "Kids",
                    Name: "Kids",
                    ItemType: "liveTvGuide",
                    filterId: "Kids",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allKnowledge/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Knowledge",
                    title: "Knowledge",
                    Name: "Knowledge",
                    ItemType: "liveTvGuide",
                    filterId: "Knowledge",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allLife/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Life",
                    title: "Life",
                    Name: "Life",
                    ItemType: "liveTvGuide",
                    filterId: "Life",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allMovies/",
                    image16x9KeyArtURL: {
                        uri: "Movies",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Movies",
                    title: "Movies",
                    Name: "Movies",
                    ItemType: "liveTvGuide",
                    filterId: "Movies",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allMulticultural/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Multicultural",
                    title: "Multicultural",
                    Name: "Multicultural",
                    ItemType: "liveTvGuide",
                    filterId: "Multicultural",
                },
                {
                    $type: "PROGRAM-LIVE",
                    assetType: {
                        itemType: "GENERIC-LIVE",
                        contentType: "GENERIC",
                        sourceType: "LIVE",
                    },
                    id: "live/feeds/allNetworks/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Networks",
                    title: "Networks",
                    Name: "Networks",
                    ItemType: "liveTvGuide",
                    filterId: "Networks",
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
                        uri: "News",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_News",
                    title: "News",
                    Name: "News",
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
                    id: "live/feeds/allPPV/",
                    image16x9KeyArtURL: {
                        uri: "DefaultBackground",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_PPV",
                    title: "PPV",
                    Name: "PPV",
                    ItemType: "liveTvGuide",
                    filterId: "PPV",
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
                        uri: "Sports",
                    },
                    metadataLine2: "",
                    metadataLine3: "",
                    stringId: "all_Sports",
                    title: "Sports",
                    Name: "Sports",
                    ItemType: "liveTvGuide",
                    filterId: "Sports",
                },
            ],
        },
        epgConfig: {
            font: {
                H1: {
                    file: "Montserrat-Bold.ttf",
                    size: "58",
                    color: "#EEEEEE",
                },
                H2: {
                    file: "Montserrat-Bold.ttf",
                    size: "24",
                    color: "#EEEEEE",
                },
                H3: {
                    file: "Montserrat-Medium.ttf",
                    size: "22",
                    color: "#EEEEEE",
                },
                H4: {
                    file: "Montserrat-Medium.ttf",
                    size: "20",
                    color: "#EEEEEE",
                },
                tag: {
                    file: "Montserrat-Regular.ttf",
                    size: "20",
                    color: "#A7A7A7",
                },
                body: {
                    file: "Montserrat-Medium.ttf",
                    size: "16",
                    color: "#A7A7A7",
                },
            },
            view: {
                backgroundColor: "#00000000",
                focusColor: "#DC1895",
            },
            filterButton: {
                backgroundColor: "#424242FF",
                backgroundfocusColor: "#DC1895",
            },
            filterToggleButton: {
                backgroundFocusColor: "#DC1895",
            },
            list: {
                verticalStreamingRange: 2.0,
                horizontalStreamingRange: 1.4,
            },
            button: {
                backgroundColor: "#424242FF",
                backgroundfocusColor: "#DC1895",
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
                    forward: 13,
                    backward: 7,
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
            isDefaultSubscribedFilterEnabled: true,
            enableMiniEPG: false,
            // @TODO Get filters from Redux Reducer

            filters: [
                {
                    title: "Filter By",
                    entries: [
                        {
                            title: "Favorite Channels",
                            tag: "Favorites",
                        },
                        {
                            title: "Playable on this Device",
                            tag: "Playable",
                        },
                        {
                            title: "Subscribed",
                            tag: "Subscribed",
                        },
                    ],
                },
                {
                    title: "Category",
                    entries: [
                        {
                            title: "Networks",
                            tag: "Networks",
                            stringId: "all_networks",
                        },
                        {
                            title: "Kids",
                            tag: "Kids",
                            stringId: "all_kids",
                        },
                        {
                            title: "Entertainment",
                            tag: "Entertainment",
                            stringId: "all_entertainment",
                        },
                        {
                            title: "Movies",
                            tag: "Movies",
                            stringId: "all_movies",
                        },
                        {
                            title: "News",
                            tag: "News",
                            stringId: "all_news",
                        },
                        {
                            title: "Life",
                            tag: "Life",
                            stringId: "all_life",
                        },
                        {
                            title: "Multicultural",
                            tag: "Multicultural",
                            stringId: "all_multicultural",
                        },
                        {
                            title: "Application",
                            tag: "Application",
                            stringId: "all_application",
                        },
                        {
                            title: "Sports",
                            tag: "Sports",
                            stringId: "all_sports",
                        },
                        {
                            title: "Knowledge",
                            tag: "Knowledge",
                            stringId: "all_knowledge",
                        },
                        {
                            title: "French",
                            tag: "French",
                            stringId: "all_french",
                        },
                        {
                            title: "Canadian Satellite",
                            tag: "Canadian Satellite",
                            stringId: "all_canadian_satellite",
                        },
                        {
                            title: "Digital",
                            tag: "Digital",
                            stringId: "all_digital",
                        },
                        {
                            title: "PPV",
                            tag: "PPV",
                            stringId: "all_ppv",
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
                january: "january",
                february: "february",
                march: "march",
                april: "april",
                may: "may",
                june: "june",
                july: "july",
                august: "august",
                september: "september",
                october: "october",
                november: "november",
                december: "december",
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
            Library: {
                itemTypes: "Title,PayPerView",
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
        restrictedRecording: false,
    },
    appInsights: {
        InstrumentationKey: "f857600d-1346-44e2-bb59-8c5e96430833",
    },
    analytics: {
        isEnabled: true,
        intervalMilliSec: 300000,
        maxSize: 800000,
        warnSize: 5000000,
        playerAnalyticsInterval: 180, // playerAnalyticsInterval must be >= 60(seconds)
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
            default: ["CanadaTV", "SaskFilm"],
        },
        logUnknownRatingSystems: false,
    },
    pconDefaultConfig: {
        defaultRestrictedAge: 17,
    },
    favoriteConfig: {
        $top: 100,
    },
    appTimeout: {
        liveTimeOut: 90, //minutes
        guideTimeout: 90, //minutes
        sessionInactivityTimeout: 90, //minutes
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
            libraryItems: 480,
            libraryPivots: 240,
            catchupPivotItems: 240,
            catchupItems: 480,
            catchupPivots: 240,
            packages: 240,
            packageTitles: 240,
            schedules: 240,
            programSchedules: 240,
            person: 240,
            searchFilters: 0,
            subscriptionPackageCategories: 240,
            subscriptionPackageItems: 480,
            subscriptionPackageCategoryItems: 240,
        },
        search: {
            search: 0,
        },
        subscriber: {
            pinnedItems: 480,
            purchasedItems: 480,
            devices: 240,
            dynamicFeeds: 240,
            locationInfo: 240,
            playOptions: 500,
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
            pinnedItem: 480,
            allRecordingBookmarks: 240,
        },
        live: {
            catalogCache: 1800,
            catchup: typeof 480,
            channelRights: 0,
            scheduleCache: 1300,
            recentlyAired: 1300,
        },
    },
    ppvFeedExpiry: 600,
    ppvAutoPurchasePrice: 1, // PPV that costs less than "ppvAutoPurchasePrice" will be considered as Free-PPV & it'll be auto purchased.
};
