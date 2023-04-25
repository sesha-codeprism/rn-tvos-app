//
//  MKPlayerManager.swift
//  RetailClient
//
//  Created by Priyank Saxena on 09/02/23.
//

import Foundation
@objc(MKPlayerManager)
class MKPlayerManager : RCTViewManager {
override func view() -> UIView! {
    return MKPlayerView();
  }
@objc override static func requiresMainQueueSetup() -> Bool {
      return false
  }
}

