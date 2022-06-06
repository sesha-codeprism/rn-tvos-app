//
//  UILabelFontable.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

@IBDesignable
class UILabelFontable: UILabel {
    
    @IBInspectable var fontSize: CGFloat = 0 {
        didSet {
            setupFont()
        }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        setupFont()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        
        setupFont()
    }
        
    func setupFont(_ type: FontType = .regular) {
        self.textColor = .white
//        font = UIFont.font(of: type, size: fontSize == 0 ? font.pointSize : fontSize)
    }
}


class EPGLabel: UILabel {
    
    var textOffsetX: CGFloat = 0 {
        didSet {
            setNeedsDisplay()
            layoutIfNeeded()
        }
    }
    
    var textOffsetY: CGFloat = 0 {
        didSet {
            setNeedsDisplay()
            layoutIfNeeded()
        }
    }
    
    override func draw(_ rect: CGRect) {
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.alignment = .left
        let attributes: [NSAttributedString.Key: Any] = [.paragraphStyle: paragraphStyle, .font: font ?? UIFont(), .foregroundColor: textColor ?? UIColor.black]
        let attributedString = NSAttributedString(string: text ?? "", attributes: attributes)
        attributedString.draw(in: CGRect(x: textOffsetX, y: textOffsetY, width: frame.width - textOffsetX, height: frame.height - textOffsetY))
    }
}

enum FontType: String {
    case regular = "OpenSans-Regular"
    case bold =  "OpenSans-Bold"
    case light = "OpenSans-Light"
    case semibold = "OpenSans-SemiBold"
    
//    func getFontNameFromSource() -> String? {
//        switch self {
//        case .regular:
//            return DesignData.model?.general?.regularFont
//        case .bold:
//            return DesignData.model?.general?.boldFont
//        case .light:
//            return DesignData.model?.general?.lightFont
//        case .semibold:
//            return DesignData.model?.general?.semiBoldFont
//        }
//    }
}
