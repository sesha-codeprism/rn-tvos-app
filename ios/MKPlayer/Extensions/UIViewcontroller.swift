//
//  UIViewcontroller.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import Foundation
import UIKit
extension UIViewController {

    func menuButton(action: Selector?) {
        let tap = UITapGestureRecognizer(target: self, action: action)
        tap.allowedPressTypes = [NSNumber(value: UIPress.PressType.menu.rawValue)]
        view.addGestureRecognizer(tap)
    }

    func playButton(action: Selector?) {
        let tap = UITapGestureRecognizer(target: self, action: action)
        tap.allowedPressTypes = [NSNumber(value: UIPress.PressType.playPause.rawValue)]
        view.addGestureRecognizer(tap)
    }

}

// MARK: - UIFocusGuide implementation
extension UIViewController {
    @discardableResult
    func addFocusGuide(from origin: UIView, to destination: UIView, direction: UIRectEdge, debugMode: Bool = false) -> UIFocusGuide {
        return addFocusGuide(from: origin, to: [destination], direction: direction, debugMode: debugMode)
    }

    @discardableResult
    func addFocusGuide(from origin: UIView, to destinations: [UIView], direction: UIRectEdge, debugMode: Bool = false) -> UIFocusGuide {
        let focusGuide = UIFocusGuide()
        view.addLayoutGuide(focusGuide)
        focusGuide.preferredFocusEnvironments = destinations
        focusGuide.widthAnchor.constraint(equalTo: origin.widthAnchor).isActive = true
        focusGuide.heightAnchor.constraint(equalTo: origin.heightAnchor).isActive = true

        switch direction {
        case .bottom:
            focusGuide.topAnchor.constraint(equalTo: origin.bottomAnchor).isActive = true
            focusGuide.leftAnchor.constraint(equalTo: origin.leftAnchor).isActive = true
        case .top:
            focusGuide.bottomAnchor.constraint(equalTo: origin.topAnchor).isActive = true
            focusGuide.leftAnchor.constraint(equalTo: origin.leftAnchor).isActive = true
        case .left:
            focusGuide.topAnchor.constraint(equalTo: origin.topAnchor).isActive = true
            focusGuide.rightAnchor.constraint(equalTo: origin.leftAnchor).isActive = true
        case .right:
            focusGuide.topAnchor.constraint(equalTo: origin.topAnchor).isActive = true
            focusGuide.leftAnchor.constraint(equalTo: origin.rightAnchor).isActive = true
        default:
            // Not supported :(
            break
        }

        if debugMode {
            view.addSubview(FocusGuideDebugView(focusGuide: focusGuide))
        }

        return focusGuide
    }
}

class FocusGuideDebugView: UIView {

    init(focusGuide: UIFocusGuide) {
        super.init(frame: focusGuide.layoutFrame)
        backgroundColor = UIColor.green.withAlphaComponent(0.15)
        layer.borderColor = UIColor.green.withAlphaComponent(0.3).cgColor
        layer.borderWidth = 1
    }

    required init?(coder aDecoder: NSCoder) {
        return nil
    }
}

extension UIButton {
  func setCustomPlayerFont(title: String) {
    self.titleLabel?.font = UIFont(name: "Mediakind-Icons.otf", size: 27)
    self.titleLabel?.text = title
  }
}
