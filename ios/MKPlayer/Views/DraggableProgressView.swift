//
//  DraggableProgressView.swift
//  TestDragableProgressBar
//
//  Created by Priyank Saxena on 06/04/23.
//

import Foundation
import UIKit
import MKPlayer

protocol DraggableProgressViewDelegate: AnyObject {
    func didDragBegin()
    func didDragChange(seekValue: Double)
    func didDragEnd(seekValue: Double)
}

class DraggableProgressView: UIView {

    // Local variables
    private var panGestureRecognizer: UIPanGestureRecognizer!
    private var maxPos: CGFloat = 0.0
    private let minPos: CGFloat = 0.0
    private var thumbViewCenterXConstraintConstant: CGFloat = 0
    private var progressBarValue = 0.0

    // Contraint whose value will be changed at runtime
    @IBOutlet weak var dynamicCurrentTimeViewLeadingConstraint: NSLayoutConstraint?
    @IBOutlet weak var lblPosition: UILabel!
    @IBOutlet weak var thumbnailImgView: UIImageView!
    var isThumbnailAvailable: Bool = false
    public weak var progressView: UIProgressView?

    weak var delegate: DraggableProgressViewDelegate?

    override func draw(_ rect: CGRect) {
        // Drawing code
        self.thumbnailImgView.isHidden = true
        setUpGestures()
    }

    private func setUpGestures() {
        panGestureRecognizer = UIPanGestureRecognizer(target: self, action: #selector(panGestureWasTriggered(panGestureRecognizer:)))
        addGestureRecognizer(panGestureRecognizer)
    }

    override var canBecomeFocused: Bool {
        return true
    }

    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {

        if context.nextFocusedView == self {
            coordinator.addCoordinatedAnimations({ () -> Void in
                // Do Animations
            }, completion: nil)

        } else if context.previouslyFocusedView == self {
            coordinator.addCoordinatedAnimations({ () -> Void in
               // Do Animations
            }, completion: nil)
        }
    }

    // MARK: - Actions
    @objc
    private func panGestureWasTriggered(panGestureRecognizer: UIPanGestureRecognizer) {

        // Should be only the horizontal gesture
        if self.isVerticalGesture(panGestureRecognizer) {
            return
        }

        // Gets x-axis value of the gesture
        let translation = CGFloat(panGestureRecognizer.translation(in: self).x)
        switch panGestureRecognizer.state {
        case .began:
            print("began")
            // Previous leading constraint value
            thumbViewCenterXConstraintConstant = CGFloat(dynamicCurrentTimeViewLeadingConstraint?.constant ?? 0.0)

        case .changed:
            print("changed")
            guard let progressbar = self.progressView else {
                return
            }
            
            if isThumbnailAvailable {
                thumbnailImgView.isHidden = false
            } else {
                thumbnailImgView.isHidden = false
            }

            // Calculates the current leading constraint value using translation
            maxPos = self.progressView?.frame.size.width ?? 0.0
            var centerX = thumbViewCenterXConstraintConstant + translation
            if translation < 0 {
                centerX = centerX < minPos ? minPos : centerX
            } else {
               centerX = centerX > maxPos ? maxPos : centerX
            }
            dynamicCurrentTimeViewLeadingConstraint?.constant = centerX

            // Caculates the partial current seek position.
            // The full seek value can be calculated using playback duration on "didDragChange" delegate method.
            // calculation : let seekValue = (TimeInterval(seekValue) * (player.duration / 1000)) * 1000
            progressBarValue = Double(centerX / progressbar.frame.size.width)
            self.delegate?.didDragChange(seekValue: progressBarValue)
        case .ended, .cancelled:
            print("ended/cancelled")
            self.delegate?.didDragEnd(seekValue: progressBarValue)
        default:
            break
        }
    }

    private func isVerticalGesture(_ recognizer: UIPanGestureRecognizer) -> Bool {
        let translation = recognizer.translation(in: self)
        if abs(translation.y) > abs(translation.x) {
            return true
        }
        return false
    }
}
