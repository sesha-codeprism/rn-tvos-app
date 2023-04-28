//
//  String.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import Foundation
extension String {
    static func stringFromTimeInterval(interval: TimeInterval) -> NSString {
      let timeInterval = NSInteger(interval)
      let seconds = timeInterval % 60
      let minutes = (timeInterval / 60) % 60
      let hours = (timeInterval / 3600)
      return NSString(format: "%0.2d:%0.2d:%0.2d", hours, minutes, seconds)
    }
    
    /**
     * Convert UTC date string in format `2021-04-12T08:13:04Z` to Current Timezone/Locale date string
     */
    var toCurrentLocaleDateStringFromISO8601DateString: String? {
        let iso8601DateFormatter = ISO8601DateFormatter()
        iso8601DateFormatter.formatOptions = [
            .withFullDate,
            .withFullTime,
            .withDashSeparatorInDate
        ]

        if iso8601DateFormatter.date(from: self) == nil {
            // if the date string contains fractional seconds, add that to the formatOptions
            iso8601DateFormatter.formatOptions.insert(.withFractionalSeconds)
        }

        // Get the Date from string
        guard let iso8601Date = iso8601DateFormatter.date(from: self) else {
            return nil
        }

        let dateFormatter = DateFormatter()
        dateFormatter.locale = .current
        dateFormatter.timeZone = .current
        dateFormatter.dateFormat = "yyyy-MM-dd hh:mm:ss a"
        return dateFormatter.string(from: iso8601Date)
    }
    
    /**
     * Get array of sub string  for given regex
     */
    func matchingStrings(regex: String) -> [String] {
        guard let regex = try? NSRegularExpression(pattern: regex, options: []) else { return [] }
        let nsString = self as NSString
        let results  = regex.matches(in: self, options: [], range: NSMakeRange(0, nsString.length))
        var arrStr = [String]()
        for result in results {
            arrStr.append(nsString.substring(with: result.range))
        }
        return arrStr
    }
}
