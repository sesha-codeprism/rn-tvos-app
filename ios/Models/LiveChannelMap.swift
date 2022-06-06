//
//  LiveChannelMap.swift
//  RetailClient
//
//  Created by Deepak on 13/12/21.
//

import Foundation

public class LiveChannel: Codable {
    let channel: Channel
    var schedule: [Program]
    var isFocused = false
    var isSubscribed = false
    var isPermitted = false
    var isRTPOnly = false
    let BlankProgramDescription = "No Information Available"
    let blankProgramName = "No Info Available"

    init(channel: Channel, programs: [Program]?) {
        self.channel = channel
        self.schedule = programs ?? [Program]()
        self.fillSpaces()
    }
}

public class LiveStation: LiveChannel {
    let station: Station
    
    init(channel: Channel, progrms: [Program], station: Station) {
        self.station = station
        super.init(channel: channel, programs: progrms)
    }
  
  required init(from decoder: Decoder) throws {
    fatalError("init(from:) has not been implemented")
  }
}

struct Station: Codable {
    let stationID: String
    let durationInSeconds: Int
    let channelNumber: Int
    
    enum CodingKeys: String, CodingKey {
        case stationID = "StationId"
        case durationInSeconds = "DurationInSeconds"
        case channelNumber = "ChannelNumber"
    }
}

extension LiveChannel {
    var now: Program? {
        let nowTime = Date()
        return schedule.first(where: { nowTime.isLive(startDate: $0.startUTC.value, endDate: $0.endUTC.value) })
    }
    var lastProgram : Program? {
        return schedule.sorted(by: { $0.startUTC.value > $1.startUTC.value }).first
    }
    var firstProgram : Program? {
        return schedule.sorted(by: { $0.startUTC.value < $1.startUTC.value }).first
    }
    
    var shortName: String {
        return "\(self.channel.channelNumber) \(self.channel.callLetters)"
    }
    
    internal convenience init(channel: Channel, programs: ArraySlice<Program>?) {
        self.init(channel: channel, programs: [Program](programs ?? ArraySlice<Program>()))
    }
    
    func fillSpaces () {
        if schedule.count == 0 {
//            TVLog("LiveChannelMap: Channel found without any programs. Adding No Info Available program.")
            guard let date = JSONDate(Date().epgOptimizedDate) else { return }
            schedule.insert(Program(description: BlankProgramDescription, startUTC: date, endUTC: JSONDate(date.value.addingTimeInterval(3*3600)) ?? date, name: blankProgramName), at: 0)
        }
    }
}

extension Program {
    var isOnNow: Bool {
        return Date().isLive(startDate: startUTC.value, endDate: endUTC.value)
    }
}

extension Schedule {
    var isOnNow: Bool {
        return Date().isLive(startDate: startUTC.value, endDate: endUTC.value)
    }
}

extension Calendar {
    static var utc: Calendar {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone.utc
        return calendar
    }
}

extension String {
  var seconds: Int {
      let components = split { $0 == ":" } .map { Int($0) ?? 0 }
      
      guard !components.isEmpty else { return 0 }
      
      if count == 5 {
        return (components[0] * 60 + components[1])
      } else {
        return (components[0] * 3600 + (components[1] * 60 + components[2]))
      }
  }
}
