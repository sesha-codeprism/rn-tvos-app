//
//  BootstrapData.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//

import Foundation

// MARK: - BootstrapData
struct BootstrapData: Codable {
    let accountId: String?
    let defaultProfileId: String?
    let profileIds: [String]?
    let originalAccountId: String?
    let deviceId: String?
    let channelMapId: UInt?
    let channelMapGroupName: String?
    let subscriberGroupIds: String?
    let rightsGroupIds: String?
    let notificationGroupIds: String?
    let userId: String?
    let defaultUserId: String?
    let serviceMap: ServiceMap?

    enum CodingKeys: String, CodingKey {
        case accountId = "AccountId"
        case defaultProfileId = "DefaultProfileId"
        case profileIds = "ProfileIds"
        case originalAccountId  = "OriginalAccountId"
        case deviceId = "DeviceId"
        case channelMapId = "ChannelMapId"
        case channelMapGroupName = "ChannelMapGroupName"
        case subscriberGroupIds = "SubscriberGroupIds"
        case rightsGroupIds = "RightsGroupIds"
        case notificationGroupIds = "NotificationGroupIds"
        case userId = "UserId"
        case defaultUserId = "DefaultUserId"
        case serviceMap = "ServiceMap"
    }
}

// MARK: - ServiceMap
struct ServiceMap: Codable {
    let id: String?
    let services: Services?

    enum CodingKeys: String, CodingKey {
        case id = "Id"
        case services = "Services"
    }
}

// MARK: - Services
struct Services: Codable {
    let buildmakerweb: String?
    let catchupPlaybackInfo: String?
    let channelMapSlabs: String?
    let client: String?
    let clientTraceLog: String?
    let collection: String?
    let collectionReach: String?
    let collectionstb: String?
    let defaultAccHostName: String?
    let discovery: String?
    let discoverySSL: String?
    let duplex: String?
    let duplexLongPoll: String?
    let dvr: String?
    let dvrnotification: String?
    let image: String?
    let kafkaCollection: String?
    let license: String?
    let napaSlabs: String?
    let PrerollAudio: String?
    let scheduleCache: String?
    let search: String?
    let searchSSL: String?
    let sts: String?
    let subscriber: String?
    let subscriberbkmark: String?
    let ucGMSLog: String?
    let uclicense: String?
    let upgradeNapa: String?
    let vodstorefront: String?
}
