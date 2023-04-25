//
//  AppDataModels.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//

import Foundation

import UIKit
import Foundation

// MARK: - AppConfig data models
/**
 * Contents of `AppConfig.json`
 */
struct AppConfig: Codable {
    /**
     * Contents of the external source config tems as defined in `AppConfig.json`
     */
    var externalSourceConfigList: [SourceConfig] = [SourceConfig]()

    /**
     * List of available environment config items as defined in `AppConfig.json`
     */
    var environmentConfigList: [EnvironmentConfig] = [EnvironmentConfig]()
}

/**
 * Default Login Parameters (STS Token).
 */
struct DefaultLoginParams: Codable {
    /**
     * STS Token assiociated with the login account
     */
    var stsToken: String
}

/**
 * Object represents various config parameters for a single environment config from the list of environments in `AppConfig.json` file.
 */
struct EnvironmentConfig: Codable {
    /**
     * Environment name or title.
     */
    var environment: String

    /**
     * Environments server API endpoint.
     */
    var serverUrl: String

    /**
     * Environments client API endpoint.
     */
    var clientUrl: String

    /**
     * Identity endpoint
     */
    var identityEndpointUrl: String?

    /**
     * Akamai  token Endpoint Url
     */
    var akamaiTokenEndpointUrl: String?

    /**
     * Akamain subscription key
     */
    var akamaiSubscriptionKey: String?

    /**
     * Source config list for the current environment.
     */
    var sourceConfigList: [SourceConfig] = [SourceConfig]()

    /**
     * Default login parameters (STS Token)
     */
    var defaultLoginParams: DefaultLoginParams?
    
    /**
     * Adobe Primetime Configuration parameters.
     */
    var adobePrimetimeConfiguration: AdobePrimetimeConfiguration?
}

/**
 * Object represents various config parameters for a single source item ready `AppConfig.json` file.
 */
struct SourceConfig: Codable {
    /**
     * Human readable title for the current source config item.
     */
    var title: String

    /**
     * Indicates whether the current source is Live or VoD.
     */
    var isLive: Bool

    /**
     * Indicates whether the current source is a Live event or not.
     */
    var isLiveEvent: Bool? = false

    /**
     * Manifest URL for the current source item.
     *
     * - Note: This property only applies to External unencrypted sources.
     */
    var sourceUrl: String? = nil

    /**
     * Media Id for the current source item.
     *
     * - Note: This property applies only to registered source items.
     */
    var mediaId: String? = nil

    /**
     * Application Token for a Registered live source item.
     *
     * - Note: This applies only to registered Live source item.
     */
    var applicationToken: String? = nil
}

/**
 *  Adobe Primetime configuration parameters
 */
struct AdobePrimetimeConfiguration: Codable {
    var applicationId: String
    var requesterId: String
    var resourceId: String
    var userId: String
    var upStreamUserId: String
    var slmt: String
    var mvpd: String
    var endpointURL: String
}

// MARK: - Persistent AppData data model
/**
 * Application Data.
 *
 * All application specific data properties collected from user inputs and all that is read from `AppConfig.json`.
 * The contents of this object is saved to UserDefaults to keep this data persistent.
 */
struct AppData: Codable {
    /**
     * STS Token for the current environment.
     *
     * This could be either a regular or JWT based STS token obtained after login process is completed.
     */
    var stsToken: String? = nil

    /**
     * Bitmovin Player License Key.
     */
    var playerLicense: String? = nil

    /**
     * Bitmovin Analytics License Key.
     */
    var analyticsLicense: String? = nil

    /**
     * Bootstrap data for this environment
     */
    var bootstrapData: BootstrapData? = nil

    /**
     * Indicates whether analytics is enabled or not for the selected source item during playback.
     */
    var isAnalyticsEnabled: Bool = true
    
    /**
     * Indicates whether Adobe Primetime is enabled or not for the selected source item during playback.
     */
    var isAdobePrimetimeEnabled: Bool = false

    /**
     * Indicates whether additional source options are provided or not for the current source item.
     */
    var isSourceOptionsEnabled: Bool = false
    
    /**
     * Currently selected environment config from the list of environments as defined in `AppConfig.json`
     */
    var currentEnvironmentConfig: EnvironmentConfig? = nil

    /**
     * Currently applicable external source list items.
     */
    var externalSourceConfigList: [SourceConfig] = [SourceConfig]()
    
    /**
     * Indicates whether Tissot is enabled or not.
     */
    var isTissotEnabled: Bool = false
    
    /**
     * Indicates whether thumbnail support is enabled or not.
     */
    var isThumbnailEnabled: Bool = true
}

/**
 * Video Quality Setting data model
 */
struct VideoQualitySetting {
    /**
     * Label or name for the quality setting.
     */
    let label: String

    /**
     * The bitrate value assiociated with this quality setting.
     */
    let bitrate: UInt
}

/**
 * Source options Page properties.
 *
 * The start offset and CDN options for a selected source item if configured are saved in this object.
 *
 * This is not persistent data (not saved in user defaults) and reset with every source item selection.
 */
struct SourceOptions {
    /**
     * CDN Failover Percentage.
     *
     * A value in the range [0..100] that determines how much traffic is routed to the second in the list of CDN's available.
     */
    var cdnFailoverPercent: UInt8 = 0

    /**
     * Additional/optional CDN Tokens that will be appended to the manifest URL by the SDK when provided.
     *
     * Tokens when specified will be appended to the manifest URL such that if the manifest URL contains existing keys
     * that match the given token, then the value for that key is overwritten with the value provided here.
     */
    var cdnTokens: String? = nil

    /**
     * Start offset or book mark position.
     *
     * This is a relative time interval (offset)
     */
    var startOffset: Double?

    /**
     * Timeline Reference Point
     *  - Auto: the SDK will choose the appropriate timeline reference point for the selected source item.
     *  - Start (also the default for VoD) - the offset is applied from the start of the timeline (Ex: 10)
     *  - End (also the default for Live) - the offset is applied from the end of the timeline (live edge) - this is expected
     *  to be a negative value (Ex: -20)
     */
    var startOffsetTimelineReference: Int?

    /**
     * Maximum selectable bitrate value for the network bandwidth consumption for the currently played source.
     */
    var maxSelectableBitrate: UInt = 0

    /**
     * Currently selected video quality setting.
     */
    var currentVideoQualitySetting: VideoQualitySetting? = nil
}

extension SourceOptions {

    /**
     * Return a dictionary of CDN Tokens from the given string.
     */
    var cdnTokenDict: [String: String] {
        var dict: [String: String] = [String: String]()
        if let cdnTokens = self.cdnTokens?.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed), !cdnTokens.isEmpty {
            let urlComponents = URLComponents(string: "?" + cdnTokens)
            if let queryItems = urlComponents?.queryItems {
                for queryItem in queryItems {
                    if let value = queryItem.value {
                        dict[queryItem.name] = value
                    }
                }
            }
        }
        return dict
    }
}

// MARK: - JWT Login Data models
/**
 * NBA Identity API response data model
 */
struct NBAIdentityResponse: Decodable {
    /**
     * Indicates whether the API call contains a `success` or `failure` response.
     */
    let status: String

    /**
     * API response data.
     */
    let data: NBAIdentityResponseData?
}

/**
 * NBA Identity API response data
 */
struct NBAIdentityResponseData: Decodable {
    /**
     * The obtained JWT token string from the response data.
     */
    let jwt: String?
}

/**
 * STS Token using JWT token API response data model
 */
struct STSResponse: Decodable {
    /**
     * STS Token obtained from the response data.
     */
    let stsToken: String?

    /**
     * Validity of the STS token.
     */
    let expiryTime: String?

    enum CodingKeys: String, CodingKey {
        case stsToken = "AccessToken"
        case expiryTime = "ExpiryTime"
    }
}

// MARK: - Short Code authentication Data models
/**
 * Response data object model for the `landing.json` request.
 */
struct LandingRequestResponse: Decodable {
    let version: String?
    let sts: String?
}

/**
 * Response data object model for the `request-token` request.
 */
struct RequestTokenResponse: Decodable {
    let registrationCode: String?
    let maxRetryTime: Int?
    let nextCheckInterval: Int?
    let registrationUrl: String?
    let accessToken: String?
    let refreshToken: String?
    let tokenExpire: String?
    let status: String

    enum CodingKeys: String, CodingKey {
        case registrationCode = "RegistrationCode"
        case maxRetryTime = "MaxRetryTime"
        case nextCheckInterval = "NextCheckInterval"
        case registrationUrl = "RegistrationUrl"
        case accessToken = "AccessToken"
        case refreshToken = "RefreshToken"
        case tokenExpire =  "TokenExpires"
        case status = "Status"
    }
}
