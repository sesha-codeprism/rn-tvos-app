//
//  BaseBackgroundController.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class BaseBackgroundController: LogoViewController {
    
    var background: UIImageView?
    
    var showbackgroundImage = true
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        addObservers()
        view.backgroundColor = .clear
        background = UIImageView()
        guard let bg = background else { return }
//        background?.alpha = DesignData.model?.general?.alpha ?? commonAlpha
//        background?.backgroundColor = .white
        background?.frame = view.frame
        view.addSubview(bg)
        if let backgroundView = background { view.sendSubviewToBack(backgroundView) }
    }
    
    private func addObservers() {
//        LocalNotificationCenter.subscribe(observer: self, selector: #selector(playerDidFinishPlaying), to: .mediaWasEndedPlaying)
    }

//    @objc private func playerDidFinishPlaying() {
//        background?.alpha = DesignData.model?.general?.alpha ?? commonAlpha
//        view.layer.sublayers?.removeAll(where: { $0 is AVPlayerLayer })
//    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
//
//        #if PLAYER
//        if let player = PlayerManager.shared.player?.getAVPlayer() {
//            let layer = AVPlayerLayer(player: player)
//            layer.frame = view.frame
//            playerDidFinishPlaying()
//            background?.alpha = (DesignData.model?.general?.isOverLayNeeded ?? false) ? DesignData.model?.general?.playbackOverLayAlpha ?? overLayAlpha : commonAlpha
//            view.layer.insertSublayer(layer, at: 0)
//            background?.image = nil
//        } else {
//            playerDidFinishPlaying()
//        }
//        #endif
    }
    
//    func setImage(id: String, type: MediaType, imgBucketId: String? = "images") {
//        //background image is set to nil, while playing the video
//        #if PLAYER
//        if PlayerManager.shared.player?.getAVPlayer()?.isPlaying ?? false {
//            background?.image = nil
//            return
//        }
//        #endif
//        let imageBucketId = imgBucketId ?? "images"
//        let imgUrl = URLManager.backgroundImageURL(withID: id, type: type, imgBucketId: imageBucketId).asURL
//        TVLog("Poster image URL : \(String(describing: imgUrl))")
//        background?.kf.setImage(with: imgUrl, placeholder: UIImage.backgroundPlaceholder(type: type))
//    }
    
}
