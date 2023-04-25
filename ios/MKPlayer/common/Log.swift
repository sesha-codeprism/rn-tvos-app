//
//  Log.swift
//  MKPlayerRefApp
//
//  Created by Priyank Saxena on 06/04/23.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import Foundation
import os.log

extension OSLog {
    private static var subsystem = Bundle.main.bundleIdentifier!

    /// Filter logs in console using "MKPlayerRefApp" category
    static let mkpRefApp = OSLog(subsystem: subsystem, category: "MKPlayerRefApp")
}

func log(_ message: String) {
    if #available(iOS 12.0, *) {
        os_log(.default, log: OSLog.mkpRefApp, "%{public}@", message)
    } else {
        // Fallback on earlier versions
        print(message)
    }
}
