export interface UserAccountInfo {
    TenantId: string;
    AccountState: string;
    ChannelMapId: number;
    ChannelMapGroupId: number;
    SubscriberGroupIds: number[];
    AccountHash: string;
    Version: string;
    Id: string;
    Disabled: boolean;
    TermsAccepted: boolean;
    PbrOverride: boolean;
    WanProfile: WanProfile;
    TimeZoneId: string;
    AccountType: string;
    MediaFirstRequiredSku: string;
    StateFlags: StateFlags;
    DvrCapability: string;
    IhdServiceEnabled: boolean;
    ClientIpStatus: ClientIpStatus;
}

interface ClientIpStatus {
    InHome: string;
    InCountry: string;
    IsContentPortabilityRoaming: boolean;
    ReportBackRadius: number;
}

interface StateFlags {
    ChannelMap: string;
    Created: string;
    Enabled: string;
    Offer: string;
    PasscodeSyncV2: string;
    RecordingsSynched10: string;
    RecordingSyncStarted10: string;
}

interface WanProfile {
}