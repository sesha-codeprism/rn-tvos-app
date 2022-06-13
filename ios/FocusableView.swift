//
//  FocusableView.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

protocol FocusableViewDelegate: class {
    func focusOn(_ view: FocusableView)
    func unfocusOn(_ view: FocusableView)
    func tapOn(_ view: FocusableView)
}

extension FocusableViewDelegate {
    func focusOn(_ view: FocusableView) { }
    func tapOn(_ view: FocusableView) { }
    func unfocusOn(_ view: FocusableView) { }
}

class FocusableView: UIView {
    
    weak var baseDelegate: FocusableViewDelegate?
    
    var setBorder: Bool = false
    
    @IBOutlet weak var title: UILabel?
    
    var backgroundFocusColor = UIColor.gray
    var backgroundUnFocusedColor: UIColor?

    @IBInspectable var borderColor: UIColor? {
        get {
            guard let cgColor = layer.borderColor else {
                return nil
            }
            return UIColor(cgColor: cgColor)
        }
        set {
            layer.borderColor = newValue?.cgColor
        }
    }
    
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
        if isFocused {
            baseDelegate?.focusOn(self)
        } else {
            baseDelegate?.unfocusOn(self)
        }
        if setBorder {
//            layer.setBorder(focusedColor: .homeItemFocus, isFocused: isFocused)
            layer.backgroundColor = isFocused ? backgroundFocusColor.cgColor : backgroundUnFocusedColor?.cgColor
        }
    }
    
    override var canBecomeFocused: Bool {
        return true
    }
    
    override init(frame: CGRect) {
        super.init(frame: UIScreen.main.bounds)
        setupView()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setupView()
    }
    
    func setupView() {
//        layer.setup(width: 3)
        let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
        addGestureRecognizer(tap)
        isUserInteractionEnabled = true
    }
    
    @objc func handleTap(_ sender: UITapGestureRecognizer) {
        baseDelegate?.tapOn(self)
    }
}

class DetailButton: UIButton {
    
    @IBInspectable
  var focusedColor: UIColor = .cyan
    
    @IBInspectable
    var unFocusedColor: UIColor = .lightGray {
        didSet {
//            if DesignData.model?.general?.isButtonBorderNeeded ?? true {
                layer.setup(withColor: unFocusedColor, width: 2)
//            }
        }
    }
    
    @IBInspectable
  var focusedBackgroundColor: UIColor = .cyan
    
    @IBInspectable
    var unFocusedBackgroundColor: UIColor = .clear
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupFont()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        setupFont()
    }

    override func awakeFromNib() {
        super.awakeFromNib()
//        self.spacingBetweenTitleAndImage(WithSpace: 8)
//        if DesignData.model?.general?.isButtonBorderNeeded ?? true {
            layer.setup(withColor: unFocusedColor, width: 2)
//        }
        focusedBackgroundColor = .cyan
//        layer.cornerRadius = DesignData.model?.general?.buttonCornerRadius ?? commonButtonBorder

        // This is added to shrink the button title when text is long
        self.titleLabel?.allowsDefaultTighteningForTruncation = true
        self.titleLabel?.lineBreakMode = .byTruncatingTail
        self.titleLabel?.numberOfLines = 1
    }
    
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
//        if DesignData.model?.general?.isButtonBorderNeeded ?? true {
            layer.setBorder(focusedColor: focusedColor, unFocusedColor: unFocusedColor, isFocused: isFocused)
//        }
        let backgroundColor: UIColor = isFocused ? focusedBackgroundColor : unFocusedBackgroundColor
        layer.backgroundColor = backgroundColor.cgColor
        guard let text = titleLabel?.text else { return }
        setTitle(text, for: .normal)
    }
    
    func setupFont() {
        unFocusedBackgroundColor = .clear
        guard let titleLabel = titleLabel else { return }
//        titleLabel.font = UIFont.default(size: titleLabel.font.pointSize)
        guard let text = titleLabel.text else { return }
        setTitle(text, for: .normal)
    }
}
