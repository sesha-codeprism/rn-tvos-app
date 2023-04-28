//
//  Date.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import Foundation

extension Date {
    /**
     * Returns the amount of seconds from the given date.
     */
    func getSeconds(from date: Date) -> Double {
        return Double(Calendar.current.dateComponents([.second], from: date, to: self).second ?? 0)
    }

    /**
     * Convert the Date to HH:mm:ss format time string.
     */
    var toHHmmss: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss"
        formatter.locale = Locale.current
        formatter.timeZone = .current
        return formatter.string(from: self as Date)
    }
    
    /**
     * Convert the Date to `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` format time string.
     */
    var toUTCZDateString: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
        formatter.timeZone = TimeZone(abbreviation: "UTC")
        return formatter.string(from: self as Date)
    }
}
