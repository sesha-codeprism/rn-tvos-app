//
//  MKGuideBridgeManager.swift
//  RetailClient
//
//  Created by Prathibha Sundresh on 04/01/23.
//

import Foundation
import FullGuideComponent

@objc (MKGuideBridgeManager)
public class MKGuideBridgeManager: NSObject {

  @objc func getCurrentSlots(_ useCache: Bool, callback: @escaping RCTResponseSenderBlock) -> Void {
    MKFullGuideStorageManager.shared.getCurrentSlots(useCache: true, onSuccess: {(json) in
      print("Json value \(json)")
      callback(json)
    })
  }

  @objc func updateSlotsOnTime() {
    print("updateSlotsontime")
    MKFullGuideStorageManager.shared.updateSlotsOnTime()
  }
}

