interface CurrentSlotObject {
    ImageBucketId?: string;
    CatchupEndUtc?: string;
    IsGeneric?: boolean;
    CatchupEntitlements?: string[];
    IsNew?: boolean;
    EndUtc?: string;
    ShowType?: string;
    StationId?: string;
    Name?: string;
    GlfStationId?: string;
    Description?: string;
    GlfProgramId?: string;
    IsAdult?: boolean;
    StartUtc?: string;
    Tags?: string[];
    AudioTags?: AudioTags;
    Genres?: Genre[];
    Images?: Image[];
    Entitlements?: string[];
    CatchupStartUtc?: string;
    ProgramId?: string;
}

interface Image {
    ImageType: string;
    Uri: string;
    Size: string;
}

interface Genre {
    Id: string;
    Name: string;
}

interface AudioTags {
    ClosedCaptioned?: any;
}