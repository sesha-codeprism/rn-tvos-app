//
//  BaseTableViewCell.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class BaseTableViewCell: UITableViewCell, Designable {
    
    @IBOutlet weak var titleLabel: UILabelFontable!
    
    var enableBackgroundFocus = false
    
    var layerBackgroundFocusColor = UIColor.blue
    var layerBackgroundUnfocusColor = UIColor.clear
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        layoutIfNeeded()
        layoutSubviews()
        setNeedsDisplay()
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
//        layer.setup()
        localizeUI()
        designUI()
    }
    
    func localizeUI() {  }
    func designUI() {  }
    
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
//        layer.setBorder(isFocused: isFocused)
        if enableBackgroundFocus { layer.backgroundColor = isFocused ? layerBackgroundFocusColor.cgColor : layerBackgroundUnfocusColor.cgColor }

    }
}

class BaseFocusableTableViewCell: UITableViewCell, Designable, Focusable {
    
    @IBOutlet weak var titleLabel: UILabelFontable!
    
    var enableBackgroundFocus = false
    
    var layerBackgroundFocusColor = UIColor.blue
    var layerBackgroundUnfocusColor = UIColor.gray
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        layoutIfNeeded()
        layoutSubviews()
        setNeedsDisplay()
    }
    
    override func awakeFromNib() {
        super.awakeFromNib()
//        layer.setup()
        localizeUI()
        designUI()
    }
    
    func localizeUI() {  }
    func designUI() { backgroundColor = .gray }
    
    var preferredViewToFocus: UIView? {
        didSet {
            if preferredViewToFocus != nil {
                setNeedsFocusUpdate()
            }
        }
    }
    
    override var canBecomeFirstResponder: Bool {
        return true
    }
    
    override var preferredFocusEnvironments: [UIFocusEnvironment] {
        guard let preferredViewToFocus = preferredViewToFocus else { return super.preferredFocusEnvironments }
        return [preferredViewToFocus]
    }
    
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
//        layer.setBorder(isFocused: isFocused)
        if enableBackgroundFocus { layer.backgroundColor = isFocused ? layerBackgroundFocusColor.cgColor : layerBackgroundUnfocusColor.cgColor }
    }
}

