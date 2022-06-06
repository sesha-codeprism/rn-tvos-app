//
//  BaseScreenViewController.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class BaseScreenViewController: UIViewController, Focusable, Designable {
    
    var preferredViewToFocus: UIView? {
        didSet {
            if preferredViewToFocus != nil {
                setNeedsFocusUpdate()
            }
        }
    }
    
//    let connector = APIConnector()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .black
        localizeUI()
        designUI()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
//        Log.shared.addOpenNavigationEvent(classIdentifier, totalResponseTime: Date().milliseconds)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
       
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
//        Log.shared.addCloseNavigationEvent(classIdentifier, totalResponseTime: Date().milliseconds)
    }
        
    override var canBecomeFirstResponder: Bool {
        return true
    }
    
    override var preferredFocusEnvironments: [UIFocusEnvironment] {
        guard let preferredViewToFocus = preferredViewToFocus else { return super.preferredFocusEnvironments }
        return [preferredViewToFocus]
    }
    
    func localizeUI() {  }
    func designUI() {  }
}
