//
//  BaseCollectionViewCell.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class BaseCollectionViewCell: UICollectionViewCell, Designable {
        
    override init(frame: CGRect) {
        super.init(frame: frame)
        commonInit()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        commonInit()
    }
    
    private func commonInit() {
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
    }
}
