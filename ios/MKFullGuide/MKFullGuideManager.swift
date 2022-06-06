import Foundation
@objc(MKFullGuideManager)
class MKFullGuideManager: RCTViewManager{
override func view() -> UIView! {
    return MKFullGuideViewController();
  }
}
