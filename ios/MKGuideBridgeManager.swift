//
//  InMemoryRepository.swift
//  RetailClient
//
//  Created by Prathibha Sundresh on 19/10/22.
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

//  static let shared: MKFullGuideStorageManager = MKFullGuideStorageManager()
//  private let queue = DispatchQueue(label: "asyncQueue", attributes: .concurrent)
//  private let queue_fetchdata = DispatchQueue(label: "queue_fetchdata", attributes: .concurrent)

//  let fullGuideObject: MKFullGuideAPIClient = MKFullGuideAPIClient()
//  private let client = Client()

//  var slotWiseData: [String: [[String: Any]]]?
//
//  func saveDataFor(slot: String, programs: [[String: Any]]) {
//    queue.async(flags: .barrier) {
//      if self.slotWiseData == nil {
//        self.slotWiseData = [slot: programs]
//      } else {
//        self.slotWiseData?[slot] = programs
//      }
//    }
//  }
//
//  func getDataFor(slot: String) -> [[String: Any]]? {
//    var programs: [[String: Any]]?
//    queue.sync {
//      programs = self.slotWiseData?[slot]
//      if programs != nil {
//        print("data fetched from Cache for \(slot)")
//      }
//    }
//    return programs
//  }
//
//}
//
//extension MKFullGuideStorageManager {
//
// @objc public func getCurrentSlots(_ useCache: Bool = false) {
//   print("get current status")
//    self.queue_fetchdata.sync {
//      print("get Current Slots")
////      self.fullGuideObject.getSchedules(useCachedSchedule: useCache, onSuccess: { (json, value) in
////        print("getSchedules")
////      })
//    }
//  }
//
//  func updateSlotsOnTime() {
//    Timer.scheduledTimer(withTimeInterval:30, repeats: true, block: { (_) in
//      self.getCurrentSlots()
//    })
//  }
}
