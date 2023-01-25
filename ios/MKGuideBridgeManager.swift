//
//  MKGuideBridgeManager.swift
//  RetailClient
//
//  Created by Prathibha Sundresh on 04/01/23.
//

import Foundation
import FullGuideComponent

extension Collection where Iterator.Element == [String: Any] {
  func toJSONString(options: JSONSerialization.WritingOptions = .prettyPrinted) -> String {
    if let arr = self as? [[String: Any]],
       let dat = try? JSONSerialization.data(withJSONObject: arr, options: options),
       let str = String(data: dat, encoding: String.Encoding.utf8) {
      return str
    }
    return "[]"
  }
}

@objc (MKGuideBridgeManager)
public class MKGuideBridgeManager: NSObject {

  @objc func getCurrentSlots(_ useCache: Bool, callback: @escaping RCTResponseSenderBlock) -> Void {
    MKFullGuideStorageManager.shared.getCurrentSlots(useCache: true, onSuccess: {(json) in
      let finalJson = json.toJSONString();
      callback([finalJson])
    })
  }

  @objc func updateSlotsOnTime() {
    print("updateSlotsontime")
    MKFullGuideStorageManager.shared.updateSlotsOnTime()
  }

  @objc func setChannelmapId(_ value: Int) {
    print("channelmapId in swift = \(value)")
    MKFullGuideStorageManager.shared.setChannelmapId(value: value)
  }

  @objc func getChannelMapInfo(_ callback: @escaping RCTResponseSenderBlock) -> Void {
    MKFullGuideStorageManager.shared.getChannelMapData(onSuccess: {(json) in
      let returnedJSON: Dictionary = json
//			print("getChannelMapInfo \(returnedJSON)")

      callback([returnedJSON,returnedJSON])
    })
  }

  @objc func setEnvironment(_ value: Dictionary<String, Any>) {
    print("setEnvironment in swift = \(value)")
    MKFullGuideStorageManager.shared.setEnvironment(value: value)
  }

  @objc func setToken(_ value: String) {
    print("setToken in swift = \(value)")
    MKFullGuideStorageManager.shared.setToken(value: value)
  }

  @objc func setRefreshToken(_ value: String) {
    print("setRefreshToken in swift = \(value)")
    MKFullGuideStorageManager.shared.setRefrestToken(value: value)
  }

  @objc func clearCacheData() {
    print("clearCacheData")
    MKFullGuideStorageManager.shared.clearCacheData()
  }

}

