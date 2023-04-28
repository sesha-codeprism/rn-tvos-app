//
//  SubTitleCell.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import Foundation
import UIKit

class SubtitleCell: UICollectionViewCell {
    @IBOutlet weak var textLabel: UILabel!
    @IBOutlet weak var imageView: UIImageView!

    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
        log("previouslyFocusedView :\(context.previouslyFocusedView)")
        log("nextFocusedView :  \(context.nextFocusedView)")
    }

    override var canBecomeFocused: Bool {
        return true
    }
}
