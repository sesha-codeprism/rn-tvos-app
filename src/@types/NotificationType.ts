/**
 * Enum for NotificationType of duplex message
 * @enum {string}
 */
 enum NotificationType {
    // unknown type.
    Unknown = "Unknown",

    // purchase type.
    Purchase = "Purchase",

    // Subscription type notification for cross-device sync.
    Subscription = "Subscription",

    // Delete Grant notification for cross-device sync.
    // when an offer is removed from the account
    DeleteGrant = "DeleteGrant",

    // Add account to Group notification for cross-device sync.
    AddGroup = "AddGroup",

    // Remove account from group notification for cross-device sync.
    RemoveGroup = "RemoveGroup",

    // Account Wan Profile has been updated.
    WanProfileUpdated = "WanProfileUpdated",

    // Account Stream Profile has been updated.
    StreamProfileUpdated = "StreamProfileUpdated",

    // Whenever a device level preference change
    DevicePreference = "DevicePreference",

    // When all the device levels have changed
    DevicePreferences = "DevicePreferences",

    // Notification to reboot the device
    RebootNotification = "RebootNotification",

    // Notification to upgrade the device
    UpgradeNotification = "UpgradeNotification",

    // Notification to have device send diagnostic info to the required URL
    DiagnosticRequestNotification = "DiagnosticRequestNotification",

    // User terms and conditions acceptance changed
    TermsAcceptance = "TermsAcceptance",

    // The device broadcast type used for sending messages to all connected devices
    DeviceBroadcast = "DeviceBroadcast",

    // "catchup-disabled" channels list replaced
    DisabledCatchupChannels = "DisabledCatchupChannels",

    // "catchup-disabled" channels list add
    DisabledCatchupChannelsAdd = "DisabledCatchupChannelsAdd",

    // "catchup-disabled" channels list delete
    DisabledCatchupChannelsDelete = "DisabledCatchupChannelsDelete",

    // Device deleted from account notification.
    DeviceDeleted = "DeviceDeleted",

    // Notification that routing group has been refreshed
    RoutingGroupUpdate = "RoutingGroupUpdate",

    // Notification that the release slot has been updated for a routing group
    ReleaseSlotUpdate = "ReleaseSlotUpdate",

    // Notification that the GRCGroupMembership code has been changed
    GRCGroupMembershipUpdate = "GRCGroupMembershipUpdate",

    // A purchased offer has been modified
    OfferModified = "OfferModified",

    // A purchased offer has been cancelled
    OfferCanceled = "OfferCanceled",

    // UI Notification for an account or a device (implemented in OssProxy)
    UINotification = "UINotification",

    // Notification for device Settings property changes
    DeviceSettingsUpdate = "DeviceSettingsUpdate",

    // Notification for device data refresh
    DataRefreshNotification = "DataRefreshNotification",

    // Reminder for an account about starting some program
    Reminder = "Reminder",

    // Notification for recording synchronization request.
    SyncRecordings = "SyncRecordings",

    // Notification for device name update
    DeviceNameUpdate = "DeviceNameUpdate",

    // Notification for device channel tune
    ChannelTuneNotification = "ChannelTuneNotification",

    // Notification for EAS alerts
    AlertNotification = "AlertNotification",

    // Notification for LaunchAppNotification
    LaunchAppNotification = "LaunchAppNotification",

    // Notification that the experience group has been updated.
    ExperienceGroupUpdate = "ExperienceGroupUpdate",

    // Notification for Reminder creation.
    REMINDER_SET = "REMINDER_SET",

    // Notification for Reminder deletion.
    REMINDER_CANCELLED = "REMINDER_CANCELLED",

    // Notification for Google Action Voice Intent
    GoogleActionIntent = "GoogleActionIntent",

    // Notification for External MediaFirst Voice Intent
    ExternalMFIntent = "ExternalMFIntent",

    // Notification for changes in the voice providers linked with an account.
    VoiceProviderLinkNotification = "VoiceProviderLinkNotification",

    // Notification for changes in the vod/title download change.
    TitleDownloadCountChanged = "TitleDownloadCountChanged",

    // Notification for changes in the client settings.
    ClientSettingsChanged = "ClientSettingsChanged",

    // Notification for changes in the IP address.
    IPAddressChanged = "IPAddressChanged",

    // Notification for canary request
    CanaryRequest = "CanaryRequest",

    // Notification for canary message
    CanaryMessage = "CanaryMessage",

    // Notification for state reporting
    StateReportingMessage = "StateReportingMessage",

    // Notification for asset pinning
    pin = "pin",

    // Notification for asset unpinning
    unpin = "unpin",

    // Notification for Profile Updates
    ProfileUpdated = "profile_updated",

    // EAS Alert message
    easmessage = "eas-message",

    // dvr changed
    dvrUpdated = "DvrUpdated"
}

export default NotificationType
