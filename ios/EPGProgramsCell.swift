//
//  EPGProgramsCell.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

protocol EPGProgramsCellDelegate: class {
    func focused(_ cell: UICollectionViewCell, _ dataSource: Program?)
    func leftSwipe(_ cell: UICollectionViewCell, _ program: Program?)
    func tapAction(program: Program?)
}

class EPGProgramsCell: BaseCollectionViewCell {
    @IBOutlet weak var titleLabel: EPGLabel!
    
    @IBOutlet weak var backView: FocusableView!
    
    override var canBecomeFocused: Bool {
        return false
    }
    
    weak var delegate: EPGProgramsCellDelegate?
    
    var dataSource: Program? {
        didSet {
            titleLabel.text = dataSource?.name
            if dataSource?.isOnNow == true {
//                backView.backgroundColor = .red
                backView.alpha = 1
            } else {
//                backView.backgroundColor = .red
                backView.alpha = 0.85
            }
        }
    }
    
    var model: LiveChannel?
    
    override func awakeFromNib() {
        super.awakeFromNib()
        
        let playTap = UITapGestureRecognizer(target: self, action: #selector(playButtonPressed))
        playTap.allowedPressTypes = [NSNumber(value: UIPress.PressType.playPause.rawValue)]
        addGestureRecognizer(playTap)
        
//        backView.layer.setup()
        
        let leftTap = UITapGestureRecognizer(target: self, action: #selector(leftButtonPressed))
        leftTap.allowedPressTypes = [NSNumber(value: UIPress.PressType.leftArrow.rawValue)]
        backView.addGestureRecognizer(leftTap)
        
        let leftSwipe = UISwipeGestureRecognizer(target: self, action: #selector(leftButtonPressed))
        leftSwipe.direction = .left
        backView.addGestureRecognizer(leftSwipe)
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(tapAction))
        backView.addGestureRecognizer(tap)
    }
    
    @objc private func leftButtonPressed() {
        delegate?.leftSwipe(self, dataSource)
    }
    
    @objc private func tapAction() {
        if dataSource != nil {
            delegate?.tapAction(program: dataSource)
        }
    }
    
    @objc private func playButtonPressed() {
        guard let model = dataSource, dataSource?.isOnNow == true else { return }
        guard let channel = self.model, channel.isSubscribed == true, channel.isPermitted == true, channel.isRTPOnly == false else { return }
//        if let context = parentViewController {
//            var methadata = MediaItem.Methadata()
//            methadata[dynamicMember: "duration"] = toString(values: ("\(Date.hoursAndMinutesFrom(model.startUTC.value)) - \(Date.hoursAndMinutesFrom(model.endUTC.value))", ""),
//                                                            (model.ratings.first?.value, " | "))
//                .trimmingCharacters(in: .whitespaces)
//
//            methadata[dynamicMember: "rating"] = model.ratings.first?.value
//            methadata[dynamicMember: feedType] = liveFeed
//            methadata[dynamicMember: "channelNumber"] = "\(channel.channel.channelNumber)"
//            if let stationId = self.model?.channel.stationID {
//                methadata[dynamicMember: "stationId"] = "\(stationId)"
//                _ = PlayerFlowCoordinator(context: context, model: MediaItem(id: model.programID, type: .live, methadata: methadata))
//            }
//        }
    }
    
    private func toString(values: (value: Any?, prefix: String)...) -> String {
        var result = ""
        for item in values {
            if let o = item.value {
                result += item.prefix + (result.isEmpty ? "\(o)" : " \(o)")
            }
        }
        return result
    }
    
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
      context.previouslyFocusedView?.backgroundColor = UIColor.darkGray
      context.nextFocusedView?.backgroundColor = UIColor.blue
        super.didUpdateFocus(in: context, with: coordinator)
        backView.layer.setBorder(isFocused: backView.isFocused)
        if backView.isFocused { delegate?.focused(self, dataSource) }
    }
}

extension CALayer {
    func setBorder(focusedColor: UIColor = .blue, unFocusedColor: UIColor = .clear, isFocused: Bool) {
        borderColor = isFocused ? focusedColor.cgColor : unFocusedColor.cgColor
    }
    
  func setup(withColor: UIColor = .clear, width: CGFloat = 1.0) {
        borderWidth = width
        borderColor = withColor.cgColor
    }
}



