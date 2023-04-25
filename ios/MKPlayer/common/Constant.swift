//
//  Constant.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//

import Foundation

/**
 * Constants for keys (strings use as keys at various places in the project)
 */
struct Key {
    static let UserDefaultsAppDataKey = "MKPlayerRefAppTVOSAppData"
    static let PlayerLicenseInfoPlistKey = "BitmovinPlayerLicenseKey"
    static let AnalyticsLicenseInfoPlistKey = "BitmovinAnalyticsLicenseKey"
}

/**
 * Constants for all section headers
 */
struct SectionHeaderText {
    static let PlayerdaAndAnalyticsLicense = "Player & Analytic License Key"
    static let EnvironmentSelection = "Select An Evironment"
    static let UseDefaultLogin = "Use Default Login"
    static let LoginMethod = "Choose A Login Method"
    static let SettingAndOptions = "Settings & Options"
    static let RegisteredSourceList = "Registered Source List"
    static let ExternalSourceList = "External Source List"
    static let LiveSchedules = "Live Schedules"
    static let Vods = "Vods"
    static let startOffSet = "START OFFSET"
    static let cdnOptions = "CDN OPTIONS"
    static let maxBitrate = "MAX BITRATE"
    static let adobeConfig = "ADOBE PRIMETIME CONFIGURATION"
}
/**
 * Constants for all   Navigation link headers
 */
struct NavigationLinkText {
    static let JWTLogin = "NBA JWT Login"
    static let ShortCodeAuthentication = "Short Code Authentication"
    static let ChangeEnvironment = "Change Environment"
    static let LiveEvents = "Live Events"
}

/**
 *  Constants for Navigation titles
 */
struct NavigationTitle {
    static let Setup = "Setup"
    static let LiveEvents = "Live Events"
    static let PlayOptions = "Play Options"
    static let SourceOptions = "Source Options"
}

/**
 * Constants for controls place holder
 */
struct PlaceHolder {
    static let PlayerLicense = "Player License Key"
    static let AnalyticLicense = "Analytics License Key"
    static let Done = "Done"
    static let Ok = "OK"
    static let GettingYouIn =  "Getting You In..."
    static let FetchingLiveEvents = "Fetching Live Events"
    static let Username = "username"
    static let Password = "password"
    static let JWTLogin = "JWT Login"
    static let ShortCode = "Short Code"
    static let PairingStatus = "Pairing Status: Pending"
    static let EnableAnalytics = "Enable Analytics"
    static let EnablePrimetime = "Enable Adobe Primetime"
    static let EnableThumbnail = "Enable Thumbnail support"
    static let EnableSourceOptions = "Enable Source Options"
    static let EnableTissot = "Enable Tissot"
    static let Live = "Live"
    static let Vod = "Vod"
    static let LiveEvent = "Live Event"
    static let ApplicationToken = "ApplicationToken"
    static let MediaId = "MediaId"
    static let VodAsset = "Vod Asset"
    static let Play = "Play"
    static let Bitrate = "Bitrate"
    static let zero = "0"
    static let CndPlaceHolder = "key1=value1&key2=value2"
    static let MaxBitratePlaceHolder = "6000000"
    static let Offset = "offset"
    static let TimelineReference = "Timeline Reference"
    static let Tokens = "Tokens"
    static let FailoverPercentage = "Failover Percentage"
    static let ResourceId = "ResourceId"
    static let ResourceIdPlaceHolder = "NBALP3"
    static let SLMT = "SLMT"
    static let SLMTPlaceHolder = "<signatureInfo>"
    static let ApplicationId = "ApplicationId"
    static let ApplicationIdPlaceHolder = "ApplicationId"
    static let UserId = "UserId"
    static let UserIdPlaceHolder = "UserId"
    static let UpStreamUserId = "UpStreamUserId"
    static let UpStreamUserIdPlaceHolder = "UpStreamUserId"
    static let RequesterId = "RequesterId"
    static let RequesterIdPlaceHolder = "NBADE"
    static let MVPD = "MVPD"
    static let MVPDPlaceHolder = "lib040"
    static let EndpointURL = "EndpointURL"
    static let EndpointURLPlaceHolder = "https://streams-stage.adobeprimetime.com"
}

/*
 * Constants for alert message
 */

struct AlertMessage {
    static let SelectEnvironment = "Please Select An Environment"
    static let Error = "Error"
}

/*
 * Constants for Special Characters
 */
struct SpecialCharacter {
    static let Empty = ""
    static let Colomn = ":"

}

struct UnicodeButtonTitles {
  static let Restart = "\u{E029}"
  static let AD = "\u{E00A}"
  static let Subtitles = "\u{E03B}"
  static let Bitrate = "\u{E020}"
}
