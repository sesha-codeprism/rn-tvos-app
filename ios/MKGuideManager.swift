import Foundation
@objc(MKGuideManager)
class MKGuideManager : RCTViewManager {
override func view() -> UIView! {
    return MKGuide();
  }
@objc override static func requiresMainQueueSetup() -> Bool {
      return false
  }
  
@objc func initiateFullGuideWith(token: String) {
    print("Received a new token", token)
}
}
