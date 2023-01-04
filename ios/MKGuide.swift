import Foundation
import UIKit
class MKGuide: UIView {
    weak var epgVC: UIViewController?

    var token: String? {
        didSet {
            print("Token: received \(self)")
            setNeedsLayout()
        }
    }

    func setData(data: Dictionary<String,Any>) {
       // Access your data here
     }

    override init(frame: CGRect) {
        super.init(frame: frame)
    }
  
    required init?(coder aDecoder: NSCoder) { fatalError("nope") }

    override func layoutSubviews() {
        super.layoutSubviews()
      print("Received token is \(self.token ?? "not received")")
        if epgVC == nil {
            embed()
        } else {
            epgVC?.view.frame = bounds
        }
    }

    private func embed() {
      let bundle = Bundle(identifier: "com.mediakind.FullGuideComponent")
      let Storyboard  = UIStoryboard(name: "EPGViewController", bundle: bundle)
      let vc = Storyboard.instantiateViewController(withIdentifier: "EPGViewController")
      vc.view.frame = CGRect(x: 0, y: 0, width: self.frame.size.width, height: self.frame.size.height);
      self.addSubview(vc.view)
      epgVC = vc
    }

}

extension UIView {
    var parentViewController: UIViewController? {
        var parentResponder: UIResponder? = self
        while parentResponder != nil {
            parentResponder = parentResponder!.next
            if let viewController = parentResponder as? UIViewController {
                return viewController
            }
        }
        return nil
    }
}
