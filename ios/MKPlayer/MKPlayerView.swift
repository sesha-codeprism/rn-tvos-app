//
//  MKPlayerView.swift
//  RetailClient
//
//  Created by Priyank Saxena on 09/02/23.
//

import Foundation
import UIKit
import MKPlayer

public protocol MKPlayerCallbacksDelegate {
  func onPlayerExit()
  func onSubtitleClicked(tracks: [[String : String]])
  func onAudioClicked(tracks: [[String : String]])
  func onBitRateClicked(sender: Any)
  func onGuideClicked(sender: Any)
}

class MKPlayerView: UIView {
  
  @objc var onExit: RCTBubblingEventBlock?
  @objc var onBitratePressed: RCTBubblingEventBlock?
  @objc var onSubtitlePressed: RCTBubblingEventBlock?
  @objc var onAudioPressed: RCTBubblingEventBlock?
  @objc var onGuidePressed: RCTBubblingEventBlock?
 // @objc var onFavourite: RCTBubblingEventBlock?
  //var player: MKPlayer?
  weak var playerVC: PlayViewController?
  @objc var playerConfig: NSDictionary?
  
  let serverurl = "https://ottapp-appgw-amp-a.proda.tmo.tv3cloud.com"
  let authToken = "AuthToken1rVNdk6o4EP01w5tWSAIJDzyAoOOsylVRZ3y5hRDkG0wAcX79DVPObtXW7tZu1RbpfPTpbirndKwuSlkVMjNp20a8IOsFzuXgrHik1bUJePuYNryOgmlb1tO2R2FRd9E0rEsZpSyF6Bj_U65oxT-kjLF_hIYJKwMxHcpC1EEzrflVeu9CThAATS5fUxqxqk3bh9yGRZCWI14FJTMPCzW_T7Lrb9n8ZwyXPwlYepPGnmxSfXhzkqbh3v3ySSb2D1fZsaAozdXy6C4dxWdVULXLyIxYHHRFqzisT0PmPxpmnthlH8QBT59OGRVOAkxDyi5kcrmwiMR6PEEoACyM5VaxwrDuvso1PGiT9JIEoqsizkTygkHdtUVd5yMBsuLX7w6C8X8RPWdB23G24HXXyHBJCQAqUp7Z_-XyCy4LCBNDolH8Am1VIxBDya0Nn4afqzGiTxvPVBrSxwOgilUU9Z1F3-yJ3-n7S1XLNOS1qOP2qf23rnTUVf8bXXldMLNumKSm5v93XdFdRMjTC-OK1bVJzdPPoE3rah2I3EQGoZr8DJUCXTMgoYYOVYpUQwPQQFTFXzDVNaITDDQdAYh1Q4MAq5Qi3QC6ig2qSxBiQmU-0ZCEFXdoUqmuV5mqTgjQoK4ayoxLcVn07cQESqf3vLdf56zap9dKvsEZ462fdOWl4WnVmgbE1lynMwuoGKOZo2q6jVxD6jNXZzZ2IHANhClUvB_uzvK93X652Fj-YeeaYM47AK7D5-eH4YQjW69jBwzO205DcUXIzb9tYqf-wKG9pkDi3rHe3fx-XqTBfEO8KMnwWr8-MprAYX7OR_IH29neVvmRVMvXVYcW-7T3Dnk3c7fijVC0B1VXJrfm3B-W_HxwDo7KNv7nGvcHi1Tr0_1GbXpMBP94hP2meh-l6u2FHQbJar6G_Lg4da7B74M6NsFHUZYh3_oUZp08rrbAAG-uvg877dBDcN_nFy_Lyl5ii2P24WpxQ9MyP1-bjni-ukvQ2MiP7W59YkK7vl6HmW09WqGfxL04Hze9egv0xI4ZQq_lJhckXa2gn7Ef8Da808fCTmTlKMdktRmCd3DWcEbes3y7ve3yfO26p-2bfz-31xfkyPEL"
  let sourceURl = "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
  let ownerId = "azuki"
  
  override init(frame: CGRect) {
    super.init(frame: frame)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func layoutSubviews() {
    print("Received config is \(self.playerConfig ?? [:])")
      if playerVC == nil {
          embed()
      } else {
        playerVC?.view.frame = bounds
      }
  }
  
  private func embed() {
    if let config = playerConfig {
      AppDataManager.shared.currentSourceConfig = SourceConfig(title: "Sintel", isLive: config["live"] as? Bool ?? false, mediaId: config["mediaUID"] as? String ?? nil, applicationToken: config["appToken"] as? String ?? nil)
        
      AppDataManager.shared.currentEnvironmentConfig = EnvironmentConfig(environment: "SKT ProdB", serverUrl: config["server_url"] as? String ?? "https://ottapp-appgw-amp-a.prodb.skt.tv3cloud.com", clientUrl: config["server_url"] as? String ?? "https://ottapp-appgw-client-a.prodb.skt.tv3cloud.com")
      AppDataManager.shared.stsToken = config["stsToken"] as? String ?? authToken
    }
    
    let Storyboard  = UIStoryboard(name: "Player", bundle: .main)
    let vc = Storyboard.instantiateViewController(withIdentifier: "PlayViewController")
    vc.view.frame = CGRect(x: 0, y: 0, width: self.frame.size.width, height: self.frame.size.height);
    self.addSubview(vc.view)
    playerVC = vc as? PlayViewController
    playerVC?.callbackDelegate = self
  }

}

extension MKPlayerView: MKPlayerCallbacksDelegate {
  func onAudioClicked(tracks: [[String:String]]) {
    if onAudioPressed != nil {
      onAudioPressed!(["tracks": tracks] )
    }
    print("Audio Tracks: \(tracks)")
  }
  
  func onSubtitleClicked(tracks: [[String:String]]) {
    if onSubtitlePressed != nil {
      onSubtitlePressed!(["tracks": tracks] )
      print("Subtitle Tracks: \(tracks)")
    }
  }
  
  func onBitRateClicked(sender: Any) {
    if onBitratePressed != nil {
      onBitratePressed?(nil)
    }
  }
  
  func onPlayerExit() {
    if onExit != nil {
      onExit?(nil)
    }
  }
  func onGuideClicked(sender: Any) {
    if onGuidePressed != nil {
      onGuidePressed?(nil)
    }
  }
  @objc public func setSubtitle(identifier: String) {
    self.playerVC?.player?.setSubtitle(trackIdentifier: identifier)
  }
  
  @objc public func setAudio(identifier: String) {
    self.playerVC?.player?.setAudio(trackIdentifier: identifier)
  }
}


