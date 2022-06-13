//
//  DiscoveryModels.swift
//  RetailClient
//
//  Created by Deepak on 13/12/21.
//  Copyright © 2022 MediaKind. All rights reserved.
//

import Foundation

struct Program: Codable {
    let stationID: String
    let programID: String
    let description: String?
    let startUTC: JSONDate
    let modifiedStartUTC: JSONDate = JSONDate(Date())!
    var endUTC: JSONDate
    var fakeStartUTC: JSONDate?
    let showType: ShowType
    let name: String?
    let seriesID: String?
    let episodeName: String?
    let seasonNumber: Int?
    let ratings: [Rating]
    let images: [Image]?
    let releaseYear: Int?
    let seasonID: String?
    let genres: [Genre]
    let isAdult: Bool
    let isNew: Bool?
    let episodeNumber: String?
    var isFocused = false
    //    let glfStationID, glfProgramID: String
    //    let glfSeriesID: String?
    let entitlements: [String]?
    //    let catchupStartUTC, catchupEndUTC: JSONDate?
    let isGeneric: Bool
    //    let audioTags: AudioTags?
    //    let tags: [String]
    
    //    let supportedImages: [String]?
    //    let imageBucketID: String?
    //    let supportedSeriesImages: [ImageType]?
    
    init(stationID: String = "", programID: String = "", description: String? = nil, startUTC: JSONDate, endUTC: JSONDate, showType: ShowType = .invalid, name: String = "", seriesID: String? = nil, episodeName: String? = nil, seasonNumber: Int? = nil, ratings: [Rating] = [Rating(system: "", value: "")], images: [Image]? = nil, releaseYear: Int? = nil, seasonID: String? = nil, genres: [Genre] = [Genre(id: "", name: "")], isAdult: Bool = false, isNew: Bool = false, episodeNumber: String? = nil, isFocused: Bool = false, fakeStartUTC: JSONDate? = nil, isGeneric: Bool = false, entitlements: [String]? = nil) {
        self.stationID = stationID
        self.programID = programID
        self.description = description
        self.startUTC = startUTC
        self.endUTC = endUTC
        self.showType = showType
        self.name = name
        self.seriesID = seriesID
        self.episodeName = episodeName
        self.seasonNumber = seasonNumber
        self.ratings = ratings
        self.images = images
        self.releaseYear = releaseYear
        self.seasonID = seasonID
        self.genres = genres
        self.isAdult = isAdult
        self.isNew = isNew
        self.episodeNumber = episodeNumber
        self.isFocused = isFocused
        self.fakeStartUTC = fakeStartUTC
        self.isGeneric = isGeneric
        self.entitlements = entitlements
    }
    
    enum CodingKeys: String, CodingKey {
        case stationID = "StationId"
        case programID = "ProgramId"
        case description = "Description"
        case startUTC = "StartUtc"
        case endUTC = "EndUtc"
        case showType = "ShowType"
        case name = "Name"
        case seriesID = "SeriesId"
        case episodeName = "EpisodeName"
        case seasonNumber = "SeasonNumber"
        case ratings = "Ratings"
        case images = "Images"
        case releaseYear = "ReleaseYear"
        case seasonID = "SeasonId"
        case genres = "Genres"
        case isAdult = "IsAdult"
        case isNew = "IsNew"
        case episodeNumber = "EpisodeNumber"
        //        case glfStationID = "GlfStationId"
        //        case glfProgramID = "GlfProgramId"
        //        case glfSeriesID = "GlfSeriesId"
        case entitlements = "Entitlements"
        //        case catchupStartUTC = "CatchupStartUtc"
        //        case catchupEndUTC = "CatchupEndUtc"
        case isGeneric = "IsGeneric"
        //        case audioTags = "AudioTags"
        //        case tags = "Tags"
        
        //        case supportedImages = "SupportedImages"
        //        case imageBucketID = "ImageBucketId"
        //        case supportedSeriesImages = "SupportedSeriesImages"
    }
}

struct Channel: Codable {
    let callLetters: String
    let channelNumber: Int
    let name: String
    let originalStationID: Int?
    let stationID: String?
    let firstCatchupStartUTC: JSONDate?
    let lastCatchupEndUTC: JSONDate?
    let stationType: String?
    
    //    let genres: [JSONAny]?
    let serviceCollectionID: String?
    let images: [Image]?
    //    let concurrentViewerDisabled: Bool
    //    let localizedStoresIDs: [String]
    //    let isApplication, isGenericApplicationService: Bool
    //    let groups: [Int]?
    //    let providerID: String?
    //    let isAdult: Bool?
    //    let applicationID: String?
    let description: String?
    let ratings: [Rating]?
    //    let applicationURLType: String?
    
    enum CodingKeys: String, CodingKey {
        case callLetters = "CallLetters"
        case channelNumber = "ChannelNumber"
        case name = "Name"
        case originalStationID = "OriginalStationId"
        case stationID = "StationId"
        case firstCatchupStartUTC = "FirstCatchupStartUtc"
        case lastCatchupEndUTC = "LastCatchupEndUtc"
        case stationType = "StationType"
        case serviceCollectionID = "ServiceCollectionId"
        case images = "Images"
        //        case genres = "Genres"
        //        case concurrentViewerDisabled = "ConcurrentViewerDisabled"
        //        case localizedStoresIDs = "LocalizedStoresIds"
        //        case isApplication = "IsApplication"
        //        case isGenericApplicationService = "IsGenericApplicationService"
        //        case groups = "Groups"
        //        case providerID = "ProviderId"
        //        case isAdult = "IsAdult"
        //        case applicationID = "ApplicationId"
        case description = "Description"
        case ratings = "Ratings"
        //        case applicationURLType = "ApplicationUrlType"
    }
}

enum ShowType: String, Codable {
    case invalid = "Invalid"
    case movie = "Movie"
    case tVShow = "TVShow"
    case movieAndTVShow = "MovieAndTVShow"
    case live = "Live"
    case station = "Station"
    
    
    var apiKey: String {
        switch self {
        case .tVShow:
            return "Series"
            
        default:
            return "Program"
        }
    }
}

struct Rating: Codable {
    let system: String
    let value: String
    
    enum CodingKeys: String, CodingKey {
        case system = "System"
        case value = "Value"
    }
}

struct Image: Codable {
//    let size: ImageSize?
    let imageType: ImageType?
    let uri: String
    //let height, width: JSONNull?
    
    enum CodingKeys: String, CodingKey {
       // case size = "Size"
        case imageType = "ImageType"
        case uri = "Uri"
        //        case height = "Height"
        //        case width = "Width"
    }
}

enum ImageType: String, Codable {
    case posterLandscape = "PosterLandscape"
    case posterPortrait = "PosterPortrait"
    case keyArtLandscape = "KeyArtLandscape"
    case screenshotLandscape = "ScreenshotLandscape"
    case the1x1Poster  = "1x1/Poster"
    case the1x1KeyArt  = "1x1/KeyArt"
    case the2X3Poster = "2x3/Poster"
    case the2X3KeyArt = "2x3/KeyArt"
    case the3X2Poster = "3x2/Poster"
    case the3X2KeyArt = "3x2/KeyArt"
    case the3X4Poster = "3x4/Poster"
    case the3X4KeyArt = "3x4/KeyArt"
    case the4X3Poster = "4x3/Poster"
    case the4X3KeyArt = "4x3/KeyArt"
    case the16X9Poster = "16x9/Poster"
    case the16X9KeyArt = "16x9/KeyArt"
    case oneFoot = "OneFoot"
    case twoFoot = "TwoFoot"
    case tenFoot = "TenFoot"
    case icon = "Icon"
    case poster = "Poster"
    case keyArt = "KeyArt"
    case logo = "Logo"
}


struct Genre: Codable {
    let id: String
    let name: String
    
    enum CodingKeys: String, CodingKey {
        case id = "Id"
        case name = "Name"
    }
}

struct Schedule: Codable {
    let stationID : String
    let stationEXTID: String?
    let startUTC: JSONDate
    let endUTC: JSONDate
    let groups: [Int]?
    //let entitlements: [String]
    let programID: String?
    let entitlements: [String]?
    //let glfProgramID: String
    let name: String
    let isGeneric: Bool
    let channelNumber: Int? //Setting optional value to address favourite issue 1111920
   // let audioTags: AudioTags
    let tags: [String]?
    let SeasonId: String?
    
    enum CodingKeys: String, CodingKey {
        case stationID = "StationId"
        case stationEXTID = "StationExtId"
        case startUTC = "StartUtc"
        case endUTC = "EndUtc"
        case groups = "Groups"
        case entitlements = "Entitlements"
        case programID = "ProgramId"
       // case glfProgramID = "GlfProgramId"
        case name = "Name"
        case isGeneric = "IsGeneric"
        case channelNumber = "ChannelNumber"
        //case audioTags = "AudioTags"
        case tags = "Tags"
        case SeasonId = "SeasonId"
    }
}

class JSONDate: Codable {
    private static var utcDateFormatter: DateFormatter {
        let formatter = DateFormatter.utc
        return formatter
    }
    private static var isoDateFormatter: DateFormatter {
        let formatter = DateFormatter.utc
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return formatter
    }
    
    var value: Date
    
    var isModified: Bool? = false
    
    var string: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        return formatter.string(from: value)
    }

    required init?(_ date: Date?) {
        if let initDate = date {
            self.value = initDate
        } else {
            return nil
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        let string = JSONDate.utcDateFormatter.string(from: value)
        try container.encode(string)
    }

    required public init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        let raw = try container.decode(String.self)
        if let date = JSONDate.utcDateFormatter.date(from: raw) {
            self.value = date
        } else {
            if let date = JSONDate.isoDateFormatter.date(from: raw) {
                self.value = date
            } else {
                throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot parse date: \(raw)")
            }
        }
    }
}

extension DateFormatter {
    static var `default`: DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss'Z'"

        return formatter
    }
    
    static var utc: DateFormatter {
        let formatter = DateFormatter.default
        formatter.timeZone = TimeZone.utc
        return formatter
    }
    
    static var hour: DateFormatter {
        return formatter(dateFormat: "h:mm a")
    }
    
    static var epg: DateFormatter {
        return formatter(dateFormat: "MM/dd/yy h:mm a")
    }
    
    private static func formatter(dateFormat: String) -> DateFormatter {
        let formatter = DateFormatter()
        formatter.dateFormat = dateFormat
        formatter.amSymbol = "AM"
        formatter.pmSymbol = "PM"
        
        return formatter
    }
    
    static func getHours(programDate: Date = Date()) -> [Date] {
        var dataSource: [Date] = []
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        formatter.amSymbol = "AM"
        formatter.pmSymbol = "PM"
        
        var date = programDate.epgOptimizedDate
        for _ in 0..<24 {
            dataSource.append(date)
            
            date = date.addingTimeInterval(60.0 * 30.0)
            dataSource.append(date)
            date = date.addingTimeInterval(60.0 * 30.0)
        }
        return dataSource
    }
}


extension Date {
    var epgOptimizedDate: Date {
        var result = self
        let calendar = Calendar.current
        let minutes = Double(calendar.component(.minute, from: result))
        let seconds = Double(calendar.component(.second, from: result))
        let miliseconds = Double(calendar.component(.nanosecond, from: result))
        result = minutes >= 30 ? result.addingTimeInterval(-(minutes * 60.0) + 30.0 * 60.0) : result.addingTimeInterval(-(minutes * 60.0))
        result = result.addingTimeInterval(-seconds).addingTimeInterval(-miliseconds / 1000000000.0)
        return result
    }
  
  func isLive(startDate: Date, endDate: Date) -> Bool {
      let currentTime = self.timeIntervalSince1970
      return currentTime >= startDate.timeIntervalSince1970 && currentTime < endDate.timeIntervalSince1970
  }
}

extension TimeZone {
    static var utc: TimeZone {
        return TimeZone(abbreviation: "UTC") ?? TimeZone.current
    }
}

