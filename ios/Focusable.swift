//
//  Focusable.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

protocol Focusable: class {
    var preferredViewToFocus: UIView? { get set }
    func setFocus(to view: UIView?)
}

extension Focusable where Self: UIFocusEnvironment {
    func setFocus(to view: UIView?) {
        guard let view = view else {
            return
        }
        preferredViewToFocus = view
        setNeedsFocusUpdate()
    }
}
