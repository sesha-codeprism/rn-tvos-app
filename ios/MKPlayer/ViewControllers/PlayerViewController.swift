//
//  PlayerViewController.swift
//  MKPlayerRefAppTVOS
//
//  Created by Priyank Saxena on 06/04/23.
//

import UIKit
import MKPlayer
import SwiftUI
//import Kingfisher
import GroupActivities

class PlayViewController: UIViewController {

    // Constants
    private let enableAutoPlay: Bool = false
    private let seekOffsetSeconds: TimeInterval = 10
    private let secondsToHideControls: TimeInterval = 8
    @IBOutlet weak var lblQuartileEvent: UILabel!

    var player: MKPlayer?
    @IBOutlet weak var playView: UIView!
    @IBOutlet weak var controlPanelView: UIView!
    @IBOutlet weak var channelDetailsView: UIView!
    //@IBOutlet weak var programDetailsView: UIView!
    @IBOutlet weak var progressView: UIProgressView!
    @IBOutlet weak var activityIndicatorView: UIActivityIndicatorView!
    @IBOutlet weak var lblDuration: UILabel!
    @IBOutlet weak var imgView: UIImageView!
//    @IBOutlet weak var topView: UIView!
//    @IBOutlet weak var heightContraint: NSLayoutConstraint!
//    @IBOutlet weak var segmentControl: UISegmentedControl!
//    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var btnRestart: UIButton!
    @IBOutlet weak var lblLive: UILabel!
    @IBOutlet weak var currentPositionView: CurrentPositionView!
    @IBOutlet weak var draggableProgressView: DraggableProgressView!
    @IBOutlet weak var btnPIP: UIButton!
    @IBOutlet weak var lblAdInfo: UILabel!
    @IBOutlet weak var lblTissotInfo: UILabel!
    @IBOutlet weak var infoView: UIView!
    @IBOutlet weak var lblTitle: UILabel!
    @IBOutlet weak var lblSubtitle: UILabel!
    @IBOutlet weak var lblChannelInfo: UILabel!
    @IBOutlet weak var imgVChannelLogo: UIImageView!
    @IBOutlet weak var btnSubtitle: UIButton!
  @IBOutlet weak var btnBitRate: UIButton!
  @IBOutlet weak var btnAD: UIButton!
  @IBOutlet weak var btnGoLive: UIButton!
//    @IBOutlet weak var liveLatencyLabel: UILabel!
//    @IBOutlet weak var videoFrameRateLabel: UILabel!
    
    //let tissotMetaData = TissotMetaData()
    var currentAdEndTime: Double = 0.0
    var currentAdsCount: Int = 0
    var currentAdIndex = 0

    private var playerState: PlayerState = PlayerState.idle
    private var userSeekedValue = -1.0

    var selectedSubTitleItem: Int = 0
    var selectedAudioItem: Int = 0
    var tracks = [String: [MKPTrack]]()
    var config: MKPSourceConfiguration?
    var alert: UIAlertController?

    let appDataMgr = AppDataManager.shared
    var akamaiTokenString: String?
    
    var isAdPlaying: Bool = false
    var controlsTimer: Timer? = nil
    private let controlsViewTimeoutSeconds: Double = 5
    var adBreakData: [MKPAdBreak]?
    var callbackDelegate: MKPlayerCallbacksDelegate?

    // Backend configuration
    lazy var backendConfig: MKPBackendConfiguration? = {
        guard let authToken = self.appDataMgr.stsToken, !authToken.isEmpty,
              let currentEnvironmentConfig = self.appDataMgr.currentEnvironmentConfig,
              !currentEnvironmentConfig.serverUrl.isEmpty else {
            return nil
        }

        return MKPBackendConfiguration(serverUrl: currentEnvironmentConfig.serverUrl,
                                       authToken: authToken)
    }()
    
    //Adobe Primetime configuration
    lazy var adobePrimetimeConfig: MKPAdobePrimetimeConfiguration? = {
        guard let appDataMgrAdobePTConfig = self.appDataMgr.currentEnvironmentConfig?.adobePrimetimeConfiguration,
              !appDataMgrAdobePTConfig.applicationId.isEmpty,
              !appDataMgrAdobePTConfig.requesterId.isEmpty,
              !appDataMgrAdobePTConfig.resourceId.isEmpty,
              !appDataMgrAdobePTConfig.userId.isEmpty,
              !appDataMgrAdobePTConfig.upStreamUserId.isEmpty,
              !appDataMgrAdobePTConfig.slmt.isEmpty,
              !appDataMgrAdobePTConfig.mvpd.isEmpty,
              !appDataMgrAdobePTConfig.endpointURL.isEmpty else {
            return nil
        }
        
        return MKPAdobePrimetimeConfiguration(applicationId: appDataMgrAdobePTConfig.applicationId,
                                             requesterId: appDataMgrAdobePTConfig.requesterId,
                                             resourceId: appDataMgrAdobePTConfig.resourceId,
                                             userId: appDataMgrAdobePTConfig.userId,
                                             upStreamUserId: appDataMgrAdobePTConfig.upStreamUserId,
                                             slmt: appDataMgrAdobePTConfig.slmt,
                                             mvpd: appDataMgrAdobePTConfig.mvpd,
                                             endpointURL: appDataMgrAdobePTConfig.endpointURL)
    }()
    
    // Source configuration
    lazy var sourceConfig: MKPSourceConfiguration? = {
        guard let appDataMgrSourceConfig = self.appDataMgr.currentSourceConfig else {
            return nil
        }

        var sourceConfig: MKPSourceConfiguration? = nil
        var cdnTokens: [String: String] = [:]
        let isLive = appDataMgrSourceConfig.isLive
        let isLiveEvent = appDataMgrSourceConfig.isLiveEvent ?? false

        // Registered source
        if let mediaId = appDataMgrSourceConfig.mediaId, !mediaId.isEmpty {
            sourceConfig = MKPSourceConfiguration(mediaId: mediaId,
                                                  isLive: appDataMgrSourceConfig.isLive,
                                                  applicationToken: appDataMgrSourceConfig.applicationToken,
                                                  title: appDataMgrSourceConfig.title)
        }

        // External source
        if let sourceUrl = appDataMgrSourceConfig.sourceUrl, !sourceUrl.isEmpty {
            sourceConfig = MKPSourceConfiguration(sourceUrl: sourceUrl,
                                                  isLive: appDataMgrSourceConfig.isLive,
                                                  title: appDataMgrSourceConfig.title)
        }

        // append analytics key if analytics is enabled and if we have a valid key
        if let analyticsKey = self.appDataMgr.analyticsLicense, !analyticsKey.isEmpty,
           self.appDataMgr.isAnalyticsEnabled {
            sourceConfig?.analyticsConfiguration = MKPAnalyticsConfiguration(key: analyticsKey)
        }

        // Append AD Parameters to CDN Tokens (hard-coded for now!)
        if isLive, isLiveEvent {               // Live event
            cdnTokens = [
                "csid": "nba.com_connecteddevices_tvos_live_mids",
                "caid": "nba_league_pass_video_080713",
                "afid": "131605628"
            ]
        } else if isLive, !isLiveEvent {       // Live 24x7
            cdnTokens = [
                "csid": "nba.com_live_nba-tv_tvos",
                "caid": "nba-tv_live_default_asset",
                "afid": "173335512"
            ]
        } else {                               // VOD
            cdnTokens = [
                "csid": "nba.com_connecteddevices_tvos_live_pre-mids",
                "caid": "nba_league_pass_video_080713",
                "afid": "131605628"
            ]
        }

        // append source options to the source config
        //  - Start Offset options apply to both Registered and External sources
        //  - CDN Options do not apply to external assets - passing them will have no effect!
        //    (SDK will ignore CDN options for External sources)
        if self.appDataMgr.isSourceOptionsEnabled {
            // Start offset
            if let timelineReference = self.appDataMgr.sourceOptions.startOffsetTimelineReference,
               let startOffsetTimelineReference = MKPTimelineReferencePoint(rawValue: timelineReference) {
                sourceConfig?.sourceOptions = MKPSourceOptions(startOffset: self.appDataMgr.sourceOptions.startOffset,
                                                               startOffsetTimelineReference: startOffsetTimelineReference)
            }

            // CDN options
            let cdnFailoverPercent = self.appDataMgr.sourceOptions.cdnFailoverPercent
            // merge the user given cdn tokens (keeping the new value given if there is a duplicate key)
            cdnTokens.merge(self.appDataMgr.sourceOptions.cdnTokenDict) {(_, new) in new}
            sourceConfig?.cdnOptions = MKPCdnOptions(cdnTokens: cdnTokens, cdnFailoverPercent: cdnFailoverPercent)
        } else if cdnTokens.count > 0 {
            // add the default CDN tokens
            sourceConfig?.cdnOptions = MKPCdnOptions(cdnTokens: cdnTokens)
        }

        return sourceConfig
    }()


    override func viewDidLoad() {
        super.viewDidLoad()
//        if #available(tvOS 15, *) {
//            MKPCoordinateManager.shared.delegate = self
//        }
        startPlayback()
        updateUI()
    }

    func addSwipeGesture() {
        let leftSwipe = UISwipeGestureRecognizer(target: self, action: #selector(swipeAction(swipe:)))
        leftSwipe.direction = .left
        let rightSwipe = UISwipeGestureRecognizer(target: self, action: #selector(swipeAction(swipe:)))
        rightSwipe.direction = .right
        let upSwipe = UISwipeGestureRecognizer(target: self, action: #selector(swipeAction(swipe:)))
        upSwipe.direction = .up
        let downSwipe = UISwipeGestureRecognizer(target: self, action: #selector(swipeAction(swipe:)))
        downSwipe.direction = .down
        self.view.addGestureRecognizer(rightSwipe)
        self.view.addGestureRecognizer(upSwipe)
        self.view.addGestureRecognizer(downSwipe)
        self.view.addGestureRecognizer(leftSwipe)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        clearPlayer()
    }

    func clearPlayer() {
        guard let player = player else {
            log("Player is not available to clear")
            return
        }

        player.removeEvent(listener: self)
        player.pictureInPictureDelegate = nil
        player.destroy()
        sourceConfig = nil
        self.player = nil
    }
    
   // Update player metrics
   //  - Video Frame Rate (FPS)
   //  - Live Latency (Latency)
   //  - TimeShift (TS)
   func updatePlayerMetrics() {
       guard let player = self.player,
             let sourceConfig = self.sourceConfig,
             let isLive = sourceConfig.isLive else {
           return
       }
       // update video frame rate (round decimal to 2 places)
       //self.videoFrameRateLabel.text = "FPS: \(player.currentVideoFrameRate)"
       // Only for Live
       if isLive {
           // update Live latency
           //let liveLatency = Date(timeIntervalSince1970: player.currentTime).getSeconds(from: Date())
           //self.liveLatencyLabel.text = "Latency: \(liveLatency)"
           // update current timeshift value
           //self.currentTimeShiftLabel.text = "TS: \(Float(player.timeShift))"
           //self.bufferLabel.text = "B: \(Float(player.bufferLevel))"
       }
   }
    
    func cancelControlsTimer() {
        if self.controlsTimer != nil {
            self.controlsTimer?.invalidate()
            self.controlsTimer = nil
        }
    }
    
    // Show controls on play button pressed or swipe action
    @objc func showControls() {
print("ShowControls")
        // show the controls
        self.controlsView(shouldHide: false)

        // hide the info view labels
        self.infoViewLabels(shouldHide: false)

        // invalidate the timer if it's already running
        self.cancelControlsTimer()

        // schedule the timer to hide the controls after timeout
      self.controlsTimer?.invalidate()
        self.controlsTimer = Timer.scheduledTimer(withTimeInterval: self.controlsViewTimeoutSeconds, repeats: false, block: { [weak self] _ in
            DispatchQueue.main.async {
                self?.hideControls()
            }
        })
    }
    
    // hide the controls
    func hideControls() {
        guard let player = player, !player.isPaused else {
            return
        }
        // hide the controls
        self.controlsView(shouldHide: true)

        // show the info view labels
        self.infoViewLabels(shouldHide: false)
        
    }
    
    // show or hide the various labels in the info view.
    func infoViewLabels(shouldHide: Bool) {
        //self.videoFrameRateLabel.isHidden = shouldHide
        //self.bufferLabel.isHidden = shouldHide
        if let isLive = self.sourceConfig?.isLive, isLive {
          self.btnGoLive.isHidden = shouldHide
          //  self.liveLatencyLabel.isHidden = shouldHide
            //self.currentTimeShiftLabel.isHidden = shouldHide
        }
    }
    
    // Show or hide the controls
    func controlsView(shouldHide: Bool) {
        self.currentPositionView.isHidden = shouldHide
        self.progressView.isHidden = shouldHide
        self.lblDuration.isHidden = shouldHide
        self.controlPanelView.isHidden = shouldHide
        self.infoView.isHidden = shouldHide
        self.channelDetailsView.isHidden = shouldHide
    }

}

// MARK: - Gesture Handling
extension PlayViewController {

    /**
     * Creates a new instance of MKPlayer and loads the source configuration to start playback.
     *
     * - Note: If `autoplay` is disabled, you must explicitly call `player.play()` to start
     * playback. After a call to `player.load()` the `onSourceLoaded` event callback is expected
     * from the player. It is recommended to start playback from `onSourceLoaded`. For more details,
     * please check this source for implementation.
     */
    func startPlayback() {

        // 1. Prepare the player configuration
        let playerConfiguration = MKPPlayerConfiguration()
        playerConfiguration.enableHlsImageMediaPlaylistSupport = self.appDataMgr.isThumbnailEnabled
        playerConfiguration.backendConfiguration = backendConfig
        playerConfiguration.isUiEnabled = false                 // default UI disabled as we have a UI of our own to use
        playerConfiguration.isMuted = false                     // start playback with audio - so setting muted to false
        playerConfiguration.isLoggingEnabled = true             // enable logging for the MKPlayer SDK
        playerConfiguration.isAutoplayEnabled = enableAutoPlay  // disabling autoplay - we need to call play() when we get onSourceLoaded event

        // Enabling this property has no effect when isPictureInPictureAvailable is false
        playerConfiguration.isPictureInPictureEnabled = true

        // 2. Create the player and pass the player config
        player = MKPlayer(parentView: playView, configuration: playerConfiguration)

        // 3. Register for player events.
        player?.addEvent(listener: self)

        // 4. Registering for Picture in Picture delegate
        // If isPictureInPictureAvailable is false,
        // registering for this delegate has no effect.
        if  let player = player,
            player.isPictureInPictureAvailable {
            player.pictureInPictureDelegate = self
        }
        
        // 5. Get the Akamai token for this environment if available.
//        AkamaiToken().getToken { [weak self] response in
//            if let tokenData = response, !tokenData.tokenString.isEmpty {
//                // append the acquired Akamai Token to CDN Tokens in SourceConfig
//                if var cdnOptions = self?.sourceConfig?.cdnOptions, cdnOptions.cdnTokens.count > 0 {
//                    // append to the existing list of tokens
//                    cdnOptions.cdnTokens["hdnts"] = tokenData.tokenString
//                    self?.sourceConfig?.cdnOptions = cdnOptions
//                } else {
//                    // add the Akmai token (this is the only one in this case!)
//                    self?.sourceConfig?.cdnOptions = MKPCdnOptions(cdnTokens: ["hdnts": tokenData.tokenString], cdnFailoverPercent: 0)
//                }
//            }
//
//            // 6. Set Adobe Primetime configuration if available.
//            if let adobePrimetimeConfig = self?.adobePrimetimeConfig, self?.appDataMgr.isAdobePrimetimeEnabled == true {
//                self?.player?.setAdobePrimetimeConfig(adobePrimetimeConfig: adobePrimetimeConfig)
//            }
//
            // 7. Finally load the source configurations on the player by calling `player.load()`
//            if let sourceConfig = self?.sourceConfig {
//                self?.player?.load(sourceConfiguration: sourceConfig)
//            }
//
//            if #available(tvOS 15, *) {
//                if let sourceConfig = self?.sourceConfig {
//                    self?.activateGroupSession(mkpSourceConfig: sourceConfig)
//                }
//            }
//        }
        if let sourceConfig = self.sourceConfig {
            self.player?.load(sourceConfiguration: sourceConfig)
        }
    }

    @objc func playButtonPressed() {

        guard let player = player else {
            log("player is nil")
            return
        }
        if self.playerState == PlayerState.idle || self.playerState == PlayerState.playEnded {
            self.btnRestart.isHidden = true
            player.play()
            self.showControls()
        } else if self.playerState == PlayerState.playing && player.isPlaying {
            player.pause()
            self.controlsView(shouldHide: false)
        } else if self.playerState == PlayerState.paused && player.isPaused {
            // if user uses progress bar to seek, it first seeks to the position and then calls the play
            if userSeekedValue > -1.0 {
                handleSeekToPosition(position: userSeekedValue)
                userSeekedValue = -1.0
            }
            player.play()
            self.showControls()
        } else {
            log("called in the wrong state")
        }
    }

    @objc func swipeAction(swipe: UISwipeGestureRecognizer) {

        guard let player = player else {
            log("player is nil")
            return
        }
        
        // show the controls - this will keep the controls visible for a few seconds before
        // the controls are hidden (dismissed)
        self.showControls()
        if draggableProgressView.isHidden {

            // Shows audio & subtitle tracks when restart button is hidden & player state is playing
            if swipe.direction == .down,  player.isPlaying {
                //UIView.animate(withDuration: 0.2, delay: 0.2, options: .curveEaseIn) {
//                    self.topView.isHidden = false
//                    self.segmentControl.selectedSegmentIndex = 0
//                    self.playView.bringSubviewToFront(self.topView)
                    //self.configureFocusLayout()
              setFocusOnParentAndSubView(view: controlPanelView)
                    //self.collectionView.reloadData()
              //  }
            // Hides subtitle & audio tracks on swipe up when it is displayed.
            }
            else if swipe.direction == .up /*, topView.isHidden == false */{
              setFocusOnParentAndSubView(view: draggableProgressView)
//                UIView.animate(withDuration: 0.2, delay: 0.2, options: .curveEaseIn) {
//                    self.topView.isHidden = true
//                }
            } else if swipe.direction == .up/*, topView.isHidden */{
                self.playView.bringSubviewToFront(self.btnPIP)
                self.btnPIP.isHidden = false

                Timer.scheduledTimer(withTimeInterval: 0.2, repeats: false) { _ in
                    self.setFocusOnParentAndSubView(view: self.btnPIP)
                }

               Timer.scheduledTimer(withTimeInterval: 5, repeats: false) { _ in
                    self.btnPIP.isHidden = true
                }
            } else {
                // hide the topView when seeking
                //topView.isHidden = true

                // Seeks forward on right swipe when topView is hidden
                if swipe.direction == .right {
                    updateImageView(resourceName: "forward-10s")
                    player.skipForward(seconds: self.seekOffsetSeconds)

                // Seeks backward on left swipe when topView is hidden
                } else if swipe.direction == .left {
                    updateImageView(resourceName: "replay-10s")
                    player.skipBackward(seconds: self.seekOffsetSeconds)
                }
            }
        }
    }

    @IBAction func indexChanged(_ sender: Any) {
//        if self.topView.isHidden == false {
//            //self.collectionView.reloadData()
//        }
    }

  @IBAction func subtitleButtonPressed(_ sender: Any) {
    print("subtitleButtonPressed")
    self.callbackDelegate?.onSubtitlePressed(sender: sender)
  }
  @IBAction func audioDescButtonPressed(_ sender: Any) {
    print("audioDescButtonPressed")
  }
  @IBAction func bitrateButtonPressed(_ sender: Any) {
    print("bitrateButtonPressed")
    self.callbackDelegate?.onBitRatePressed(sender: sender)
  }
  @IBAction func goLiveButtonPressed(_ sender: Any) {
    print("goLiveButtonPressed")
  }
    @IBAction func restartButtonPressed(_ sender: Any) {
        guard let player = player else { return }
        if player.isLive {
            player.seek(time: 0.0)
        } else if playerState == .playEnded {
            self.progressView.progress = 0
            playButtonPressed()
        }
        self.btnRestart.isHidden = true
    }

    @IBAction func pip_clicked(_ sender: Any) {
        if let player = self.player {
            if player.isPictureInPicture {
                player.exitPictureInPicture()
            } else {
                player.enterPictureInPicture()
            }
        }
        self.btnPIP.isHidden = true
    }

    @objc func menuButtonPressed() {
      //self.navigationController?.popViewController(animated: true)
      clearPlayer()
      self.callbackDelegate?.onPlayerExit()
      //Send callback to React native  via bridge
    }

    // Release all the player resources and deallocate the source configs
    func destroy() {
        if player != nil {
            player?.destroy()
            sourceConfig = nil
        }
    }

    func animateAndShowQuartileEvent(eventName: String) {

        UIView.animate(withDuration: 0.5, delay: 0.0, options: [.curveEaseInOut, .curveLinear]) {
            self.lblQuartileEvent.text = eventName
            self.lblQuartileEvent.alpha = 0.5
        } completion: { _ in
            UIView.animate(withDuration: 0.5, delay: 0.0, options: [.curveEaseInOut, .curveLinear], animations: {
                self.lblQuartileEvent.alpha = 0.0
            }, completion: nil)
        }
    }

    func handleSeekToPosition(position: TimeInterval) {
        guard let player = self.player,
              let isLive = self.sourceConfig?.isLive else {
            return
        }

        if isLive {
            // check if we have any seekable range available for seeking
            guard let seekableRange = player.getSeekableRange else {
                print("No seekable range available for seeking!")
                return
            }

            // calculate the relative (negative) seek offset
            var seekOffset = position - seekableRange.duration
            // Check if we are seeking within seekable range
            if seekOffset > 0 || seekOffset < player.maxTimeShift {
                seekOffset = 0
            }

            // seek for live
            player.seek(time: seekOffset)
        } else {
            if position < player.currentTime { // seeking back
                player.seek(time: max(0, position))
            } else { // Sseeking forward
                player.seek(time: min(position, player.duration))
            }
        }
    }
    
    func updateAdInfo() {
        //lblAdInfo.text = "Ad \(currentAdIndex) of \(currentAdsCount) | \(currentAdDuration)"
    }
}

// MARK: - MKPlayerEventListener
extension PlayViewController: MKPPlayerEventListener {
    func onDurationChanged(event: MKPDurationChangedEvent) {
        log("--> onDurationChanged: updated duration: \(event.duration)")
        self.lblDuration.isEnabled = true
        self.lblDuration.isHidden = false
        self.lblDuration.text = String.stringFromTimeInterval(interval: event.duration) as String
    }

    func onDvrWindowExceeded(event: MKPDvrWindowExceededEvent) {
        log("--> onDvrWindowExceeded: called")
    }

    func onStallStarted(event: MKPStallStartedEvent) {
        log("--> onStallStarted: Video Stalled - show spinner")
    }

    func onStallEnded(event: MKPStallEndedEvent) {
        log("--> onStallEnded: Video Stall ended - stop showing spinner")
    }

    func onVideoSizeChanged(event: MKPVideoSizeChangedEvent) {
        log("--> onVideoSizeChanged: called")
    }

    func onSourceWillUnload(event: MKPSourceWillUnloadEvent) {
        log("--> onSourceWillUnload: called")
    }

    func onSubtitleChanged(event: MKPSubtitleChangedEvent) {
        log("--> onSubtitleChanged: called")
        if let subtitleTrackOld = event.subtitleTrackOld {
            log(" ---> subtitleTrackOld:")
            dump(subtitleTrackOld)
        }
        if let subtitleTrackNew = event.subtitleTrackNew {
            log(" ---> subtitleTrackNew:")
            dump(subtitleTrackNew)
        }
    }

    func onAudioChanged(event: MKPAudioChangedEvent) {
        log("--> onAudioChanged: called")
        if let audioTrackOld = event.audioTrackOld {
            log(" ---> audioTrackOld:")
            dump(audioTrackOld)
        }
        let audioTrackNew = event.audioTrackNew
        log(" ---> audioTrackNew:")
        dump(audioTrackNew)
    }

    func onVideoDownloadQualityChanged(event: MKPVideoDownloadQualityChangedEvent) {
        log("--> onVideoDownloadQualityChanged: called")
        if let videoQualityOld = event.videoQualityOld {
            log(" ---> videoQualityOld:")
            dump(videoQualityOld)
        }
        if let videoQualityNew = event.videoQualityNew {
            log(" ---> videoQualityNew:")
            dump(videoQualityNew)
        }
    }

    func onError(event: MKPErrorEvent) {
        log("--> onError: errorCode: \(event.code) and message: \(event.message)")
        self.showErrorAlertView(code: event.code, message: event.message)
    }

    func onMuted(event: MKPMutedEvent) {
        log("--> onMuted: Audio muted")
    }

    func onPaused(event: MKPPausedEvent) {
        guard
            let sourceConfig = sourceConfig,
            let player = self.player,
            let isLive = sourceConfig.isLive else {
            return
        }

        log("--> onPaused: Playback paused")
        self.playerState = PlayerState.paused
        updateImageView(resourceName: "play")
        //self.topView.isHidden = true

        // When playback is paused, it shows draggable progress view in the current position.
        self.draggableProgressView.isHidden = false
        self.draggableProgressView.dynamicCurrentTimeViewLeadingConstraint?.constant = progressView.subviews.last?.subviews.last?.frame.width ?? 0
        if isLive {
            self.btnRestart.isHidden = true
            self.draggableProgressView.lblPosition.text = Date(timeIntervalSince1970: player.currentTime).toHHmmss
        } else {
            self.draggableProgressView.lblPosition.text = String.stringFromTimeInterval(interval: player.currentTime) as String
        }
        setFocusOnParentAndSubView(view: self.draggableProgressView)
    }

    func onPlay(event: MKPPlayEvent) {
        log("--> onPlay: Playback is about to start")
        DispatchQueue.main.async {
            self.activityIndicatorView.stopAnimating()
            self.activityIndicatorView.isHidden = true
            self.progressView.isHidden = false
            self.imgView.isHidden = true
            self.draggableProgressView.isHidden = true
        }
    }

    func onPlaybackFinished(event: MKPPlaybackFinishedEvent) {
        log("--> onPlaybackFinished: Playback finished")
        self.playerState = PlayerState.playEnded
        //self.topView.isHidden = true
        self.playView.bringSubviewToFront(self.btnRestart)
        self.btnRestart.isHidden = false
        setFocusOnParentAndSubView(view: self.btnRestart)
    }

    func onPlaying(event: MKPPlayingEvent) {
        log("--> onPlaying: Playback started")
        self.playerState = PlayerState.playing
        DispatchQueue.main.async {
            self.currentPositionView.isHidden = false
        }

        if self.player?.isLive == true {
            self.btnRestart.setTitle("GoLive", for: .normal)
            self.btnRestart.backgroundColor = UIColor.red
            self.btnRestart.setTitleColor(.white, for: .normal)
        }
        
        // show the controls - this will keep the controls visible for a few seconds before
        // the controls are hidden (dismissed)
        self.showControls()
    }

    func onReady(event: MKPReadyEvent) {
        // onReady event is not guaranteed for all types of playback.
        // so we recommend that playback be started when `autoplay` is
        // disabled when you get the `onSourceLoaded` event as that event
        // is guaranteed for all types of playback.

        // player is put in `ready` state when we get `onSourceLoaded` event.
        loadTracks()
    }

    func onSeek(event: MKPSeekEvent) {
        log("--> onSeek: seeking started")
        // Hiding lblAdInfo while seeking
        self.lblAdInfo.isHidden = true
    }

    func onSeeked(event: MKPSeekedEvent) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.imgView.isHidden = true
        }
        if let player = self.player {
            log("--> onSeeked: seek completed, currentPosition: \(player.currentTime)")
        }
        // Hiding lblAdInfo while seeking
        self.lblAdInfo.isHidden = true
        
        // show the controls - this will keep the controls visible for a few seconds before
        // the controls are hidden (dismissed)
        self.showControls()
    }

    func onTimeShift(event: MKPTimeShiftEvent) {
        log("--> onTimeShift: timeShift (seeking) started")
    }

    func onTimeShifted(event: MKPTimeShiftedEvent) {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
            self.imgView.isHidden = true
        }
        if let player = self.player {
            let currentPosition = Date(timeIntervalSince1970: player.currentTime).toHHmmss
            log("--> onTimeShifted: timeshift completed, currentPosition: \(currentPosition)")
        }
    }

    func onSourceLoaded(event: MKPSourceLoadedEvent) {
        // See the comments under `onReady` event - it is recommended to start
        // playback on `onSourceLoaded` event.
        log("--> onSourceLoaded: source loaded")
        guard let player = player else {
            log("player is nil")
            return
        }

        // update player state.
        self.playerState = .ready

        // start playback by calling `play()` if `autoplay` is disabled
        if !enableAutoPlay {
            log("Calling play() to start playback")
            player.play()
        }
        btnRestart.isHidden = true
    }

    func onSourceUnloaded(event: MKPSourceUnloadedEvent) {
        log("Successfully source unloaded")
        self.playerState = PlayerState.idle
    }

    func onUnmuted(event: MKPUnmutedEvent) {
        log("--> onUnmuted: Audio unmuted")
    }

    func onTimeChanged(event: MKPTimeChangedEvent) {
        guard let player = self.player,
              let config = sourceConfig,
              let isLive = config.isLive else {
            return
        }

        // print the video frame rate
        log("--> videoFrameRate: \(player.currentVideoFrameRate)")

        if isLive {
            // print the current live program start, end time and duration if available
            if let programTime = player.getCurrentLiveProgramTimeRange {
                let programStartTime = Date(timeIntervalSince1970: programTime.start).toHHmmss
                let programEndTime = Date(timeIntervalSince1970: programTime.end).toHHmmss
                let programDuration = programTime.duration
                log("--> programTime: start: \(programStartTime) end: \(programEndTime) duration: \(programDuration)")
            }

            // player current position
            let currentPosition = Date(timeIntervalSince1970: event.currentTime)

            // Calculate latency (current wall clock time - player current time) and print - just for Live service
            let latency = currentPosition.getSeconds(from: Date())

            // print current position and latency along with current timeshift value
            log("--> onTimeChanged: currentPosition: \(currentPosition.toHHmmss) latency: \(latency) currentTimeShift: \(player.timeShift)")

            for markerView in self.progressView.subviews where markerView.backgroundColor == .yellow {
                markerView.removeFromSuperview()
            }
            // print the seekable range if available
            if let seekableRange = player.getSeekableRange {
                let rangeStart = Date(timeIntervalSince1970: seekableRange.start)
                let rangeEnd = Date(timeIntervalSince1970: seekableRange.end)
                log("--> seekableRange: start: \(rangeStart.toHHmmss) end: \(rangeEnd.toHHmmss) duration: \(seekableRange.duration)")

                // update the progress elements
                self.lblDuration.text = rangeEnd.toHHmmss
                self.progressView.progress =  Float(currentPosition.getSeconds(from: rangeStart) / seekableRange.duration)

                // Assign current position value to label
                let centerX = Double(progressView.progress) * progressView.frame.width - (Double(currentPositionView.frame.width) / 2)
                self.currentPositionView.dynamicCurrentTimeViewLeadingConstraint?.constant = centerX
                self.currentPositionView.lblCurrentPostion.text = currentPosition.toHHmmss
                if let adBreakData = self.adBreakData {
                    for adBreak in adBreakData {
                        let mappedValue = seekableRange.duration / self.progressView.frame.width
                        let x = (adBreak.position - seekableRange.start) / mappedValue
                        let y = self.progressView.frame.height / 2
                        let lineView =  self.drawLineOnSlider(rect: CGRect(x: x, y: y - 5, width: 2, height: 10.0))
                        self.progressView.addSubview(lineView)
                    }
                }
            } else {
                // Static Live progress bar - seeking not allowed in this case
                self.progressView.progress = 100
                self.lblLive.isHidden = false
                self.playView.bringSubviewToFront(lblLive)
            }

            if player.isLive == true {
                if player.timeShift != 0 {
                    self.playView.bringSubviewToFront(self.btnRestart)
                    self.btnRestart.isHidden = false
                    setFocusOnParentAndSubView(view: self.btnRestart)
                } else {
                    self.btnRestart.isHidden = true
                }
            }
        } else { // For VoD
            log("--> onTimeChanged: currentPosition: \(event.currentTime)")

            // Defines the currentPositionView of x-axis value.
            self.progressView.progress =  Float(event.currentTime / player.duration)
            let centerX = Double(progressView.progress) * progressView.frame.width - (Double(currentPositionView.frame.width) / 2)
            self.currentPositionView.dynamicCurrentTimeViewLeadingConstraint?.constant = centerX

            // Assign current position value to label
            self.currentPositionView.lblCurrentPostion.text = String.stringFromTimeInterval(interval: player.currentTime) as String
        }
        
        // update adBreak info label
        let adDuration = currentAdEndTime - event.currentTime
        if adDuration >= 0 {
            lblAdInfo.text = "Ad \(currentAdIndex) of \(currentAdsCount) | \(round(adDuration))"
        }
        
        // update player metrics
        self.updatePlayerMetrics()
    }

    /**
     * This event callback is only received for registerd LIVE sources when current program start and end time is available.
     */
    func onProgramTimeChanged(event: MKPProgramTimeChangedEvent) {
        // get the program start and end time and duration
        let startTime = Date(timeIntervalSince1970: event.timeRange.start)
        let endTime = Date(timeIntervalSince1970: event.timeRange.end)
        let duration = event.timeRange.duration

        // print details in the logs
        log("--> onProgramTimeChanged: startTime: \(startTime.toHHmmss) endTime: \(endTime.toHHmmss) duration: \(duration)")
    }

    func onMetadata(event: MKPMetadataEvent) {
//        if self.appDataMgr.isTissotEnabled {
//            tissotMetaData.processTissoMetaData(entries: event.metadata.entries)
//            lblTissotInfo.text = tissotMetaData.formatedTissotData
//        }
    }
    
    func onMetadataParsed(event: MKPMetadataParsedEvent) {
        log("--> onMetadataParsed: metadataParsedEvent")
        dump(event)
    }
    
    func onAdBreakStarted(event: MKPAdBreakStartedEvent) {
        log("--> onAdBreakStart: \(event)")
        self.lblAdInfo.isHidden = false
        self.currentAdsCount = event.adsCount
        self.currentAdIndex = 0
        self.isAdPlaying = true
        showControls()
        animateAndShowQuartileEvent(eventName: "AD Break Started")
    }

    func onAdStarted(event: MKPAdStartedEvent) {
        log("--> onAdStarted: adClickUrl: \(String(describing: event.adClickUrl)), adClickTrackingUrl: \(String(describing: event.adClickTrackingUrl))")
        currentAdEndTime = round(event.duration + event.position)
        if let index = event.adIndex {
            currentAdIndex = index
        } else {
            currentAdIndex = currentAdIndex + 1
        }
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.5) {
            self.animateAndShowQuartileEvent(eventName: "Ad Started")
        }
    }

    func onAdFinished(event: MKPAdFinishedEvent) {
        log("--> onAdFinished: adClickUrl: \(String(describing: event.adClickUrl)), adClickTrackingUrl: \(String(describing: event.adClickTrackingUrl))")
        DispatchQueue.main.async {
            self.animateAndShowQuartileEvent(eventName: "Ad Finished")
        }
    }
    
    func onAdBreakEnd(event: MKPAdBreakEndEvent) {
        log("--> onAdBreakEnd: \(event)")
        showControls()
        self.lblAdInfo.isHidden = true
        currentAdsCount = 0
        currentAdIndex = 0
        self.isAdPlaying = false
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.5) {
            self.animateAndShowQuartileEvent(eventName: "AD Break Finished")
        }
    }

    func onAdMarkerData(event: [MKPAdBreak]) {
        log("--> onAdMarkerData")
        dump(event)
        for markerView in self.progressView.subviews where markerView.backgroundColor == .yellow {
            markerView.removeFromSuperview()
        }
        guard let player = player else { return }
        let duration = player.duration
        self.adBreakData = event
        let sliderWidth = self.progressView.frame.width
        if player.isLive == false && duration > 0 {
            for adBreak in event {
                let start = adBreak.position
                let x = ((sliderWidth / duration) * start)
                let y = self.progressView.frame.height / 2
                let lineView = self.drawLineOnSlider(rect: CGRect(x: x, y: y - 5, width: 2, height: 10.0))
                self.progressView.addSubview(lineView)
            }
        } else if let seekableRange = player.getSeekableRange {
            if seekableRange.duration > 0 {
                for adBreak in event {
                    let mappedValue = seekableRange.duration / sliderWidth
                    let x = (adBreak.position - seekableRange.start) / mappedValue
                    let y = self.progressView.frame.height / 2
                    let lineView =  self.drawLineOnSlider(rect: CGRect(x: x, y: y - 5, width: 2, height: 10.0))
                    self.progressView.addSubview(lineView)
                }
            }
        }
    }

    func onAdQuartile(event: MKPAdQuartileEvent) {
        log("--> onAdQuartile: adClickUrl: \(String(describing: event.adClickUrl)), adClickTrackingUrl: \(String(describing: event.adClickTrackingUrl))")
        var eventName = String()
        switch event.quartile {
        case .firstQuartile:
            eventName = "First Quartile"
        case .midpoint:
            eventName = "Midpoint"
        case .thirdQuartile:
            eventName = "Third Quartile"
        @unknown default:
            log("Unknown quartile event")
        }
        animateAndShowQuartileEvent(eventName: eventName)
    }

    func onThumbnailAvailable(resolutions: [MKPImageMediaPlaylist]) {
        log("Available resolutions: \(resolutions)")
    }
}

// MARK: - UIUpdates
extension PlayViewController {
    func updateImageView(resourceName: String, isHidden: Bool = false, imageColor: UIColor = .white) {

        DispatchQueue.main.async {
            self.imgView.isHidden = isHidden
            //self.imgView.image = UIImage(imageLiteralResourceName: resourceName)
            //self.imgView.setImageColor(color: imageColor)
        }
    }

    func updateUI() {

      //Button Text setting
      self.btnRestart.setCustomPlayerFont(title: UnicodeButtonTitles.Restart)
      self.btnAD.setCustomPlayerFont(title: UnicodeButtonTitles.AD)
      self.btnSubtitle.setCustomPlayerFont(title: UnicodeButtonTitles.Subtitles)
      self.btnBitRate.setCustomPlayerFont(title: UnicodeButtonTitles.Bitrate)
      
        self.playView.bringSubviewToFront(self.activityIndicatorView)
        self.activityIndicatorView.startAnimating()
        self.progressView.isHidden = true
        self.activityIndicatorView.isHidden = false
        self.lblLive.isHidden = true
        self.lblDuration.isHidden = false

        playButton(action: #selector(playButtonPressed))
        menuButton(action: #selector(menuButtonPressed))
        imgView.isHidden = true
        self.playView.bringSubviewToFront(imgView)
        //self.topView.isHidden = true
        //self.topView.translatesAutoresizingMaskIntoConstraints = false
        self.btnPIP.isHidden = true
        addSwipeGesture()
        self.playView.bringSubviewToFront(self.progressView)

        // Setup draggable progress bar.
        self.draggableProgressView.progressView = self.progressView
        self.playView.bringSubviewToFront(self.draggableProgressView)
        self.playView.bringSubviewToFront(self.currentPositionView)
        self.playView.bringSubviewToFront(self.lblDuration)
        draggableProgressView.delegate = self
        currentPositionView.isHidden = true
        draggableProgressView.isHidden = true
        self.playView.bringSubviewToFront(self.lblQuartileEvent)
        self.playView.bringSubviewToFront(self.lblAdInfo)
        self.lblAdInfo.isHidden = true
        
        self.playView.bringSubviewToFront(self.lblTissotInfo)
        self.playView.bringSubviewToFront(self.infoView)
    }

    func loadTracks() {
        tracks["subtitleTrack"] = player?.getAvailableSubtitleTracks
        tracks["audioTrack"] = player?.getAvailableAudioTracks

        let currentSubTitle = player?.getCurrentSubtitleTrack
        let currentAudio = player?.getCurrentAudioTrack

        if let subTitles = tracks["subtitleTrack"] {
            var index = 0
            for subTitle in subTitles {
                if subTitle.identifier == currentSubTitle?.identifier {
                    selectedSubTitleItem = index
                    break
                }
                index += 1
            }
        }

        if let audioTracks = tracks["audioTrack"] {
            var index = 0
            for audioTrack in audioTracks {
                if audioTrack.identifier == currentAudio?.identifier {
                    selectedAudioItem = index
                    break
                }
                index += 1
            }
        }
    }
    
    func drawLineOnSlider(rect: CGRect) -> UIView {
        let lineView = UIView(frame: rect)
        lineView.backgroundColor = .yellow
        lineView.layer.zPosition = 1
        return lineView
    }

}

// MARK: - PlayerSate
extension PlayViewController {
    enum PlayerState: Int {
        case idle = 0
        case ready
        case playing
        case paused
        case playEnded
    }
}

extension PlayViewController {
    var loadJson: MKPSourceConfiguration? {
        if let url = Bundle.main.url(forResource: "SourceConfig", withExtension: "json") {
            do {
                let data = try Data(contentsOf: url)
                let decoder = JSONDecoder()
                let sourceConfig = try decoder.decode(MKPSourceConfiguration.self, from: data)
                return sourceConfig
            } catch {
                print("error:\(error)")
            }
        }
        return nil
    }
}

// MARK: - Focusable Methods
extension PlayViewController {
    override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
//        if let nextFousedView = context.nextFocusedView as? SubtitleCell,
//           self.topView.isHidden == false {
//            nextFousedView.textLabel.textColor = .white
//            (context.previouslyFocusedView as? SubtitleCell)?.textLabel.textColor = .lightGray
//        }
    }

    override func shouldUpdateFocus(in context: UIFocusUpdateContext) -> Bool {
        return true
    }

    func configureFocusLayout() {
//       self.addFocusGuide(from: segmentControl, to: collectionView, direction: .bottom)
//       self.addFocusGuide(from: collectionView, to: segmentControl, direction: .top)
      // setFocusOnParentAndSubView(view: self.segmentControl)
      //self.addFocusGuide(from: draggableProgressView, to: controlPanelView, direction: .bottom)
      setFocusOnParentAndSubView(view: controlPanelView)
    }

    // Set focus to the parent view and the particular subview
    private func setFocusOnParentAndSubView(view: UIView) {
        self.view.setNeedsFocusUpdate()
        self.view.updateFocusIfNeeded()
        view.setNeedsFocusUpdate()
        view.updateFocusIfNeeded()
    }
}

// MARK: - Focusable Methods
extension PlayViewController: DraggableProgressViewDelegate {
    func didDragChange(seekValue: Double) {
        doSeekOnProgressBarDrag(seekValue: seekValue)
    }

    func didDragEnd(seekValue: Double) {
        doSeekOnProgressBarDrag(seekValue: seekValue)
    }

    func didDragBegin() {

    }

    private func doSeekOnProgressBarDrag(seekValue: Double) {
        guard
            let player = self.player,
            let seekableRange = player.getSeekableRange else {
            return
        }

        let seekValue = (TimeInterval(seekValue) * (seekableRange.duration / 1000)) * 1000
        if player.isLive {
            let seekOffset = seekableRange.start + seekValue
            self.draggableProgressView.lblPosition.text = Date(timeIntervalSince1970: seekOffset).toHHmmss as String
        } else {
            self.draggableProgressView.lblPosition.text = String.stringFromTimeInterval(interval: seekValue) as String
        }

        // If thumbnails are available do the following things
        // 1. Show thumbnail view and move the image view as knob dragged.
        // 2. Get the MKPThumbnail for the scrubbed posistion
        // 3. Download the thumbnail image for url
        // 4. Set downloaded image to image view
        let thumbnails = player.getThumbnails()
        if thumbnails.count > 0 {
            draggableProgressView.isThumbnailAvailable = true
            let value = Double(seekValue)
            let thumbnail = player.getThumbnail(time: value)
            if let thumbnail = thumbnail,
               let url = thumbnail.url {
                // Set url to kf libray which will take care of fetching and caching the image
//                    draggableProgressView.thumbnailImgView.kf.setImage(with: url, completionHandler: { _ in
//                    if let img = self.draggableProgressView.thumbnailImgView.image {
//
//                        // When thumbnail image is available to imageview crop and assign it back to the imageview.
//                        let rect = CGRect(x: thumbnail.x, y: thumbnail.y, width: thumbnail.width, height: thumbnail.height)
//                        if let cgImage = img.cgImage,
//                           let image = cgImage.cropping(to: rect) {
//                            self.draggableProgressView.thumbnailImgView.image = UIImage(cgImage: image)
//                        }
//                    }
//                })
            }
        } else {
            self.draggableProgressView.thumbnailImgView.isHidden = true
        }
        userSeekedValue = seekValue
    }
}

// MARK: - AlertView Implementation
extension PlayViewController {
    func showErrorAlertView(code: String, message: String) {
        DispatchQueue.main.async {
            self.alert = UIAlertController(title: "Error: (\(code))", message: message, preferredStyle: .alert)
            self.alert?.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                self.alert?.dismiss(animated: true) {
                    //self.navigationController?.popViewController(animated: true)
                  self.callbackDelegate?.onPlayerExit()
                }
            }))
            if let alert = self.alert {
                self.present(alert, animated: true)
            }
        }
    }
}

// MARK: - Picture in Picture delegate methods handling
extension PlayViewController: MKPPictureInPictureDelegate {
    func onPictureInPictureEnter(event: MKPPictureInPictureEnterEvent) {
        log("onPictureInPictureEnter")
    }

    func onPictureInPictureEntered(event: MKPPictureInPictureEnteredEvent) {
        log("onPictureInPictureEntered")

        // clear player stuff and assign activePlayerViewControllerWithPIP = nil
        // If already exists then assign the current playerViewController.
    }

    func onPictureInPictureExit(event: MKPPictureInPictureExitEvent) {
        log("onPictureInPictureExit")
    }

    func onPictureInPictureExited(event: MKPPictureInPictureExitedEvent) {
        log("onPictureInPictureExited")
    }

    func onRestoreUserInterfaceForPictureInPicture(withCompletionHandler completionHandler: @escaping (Bool) -> Void) {
        log("onRestoreUserInterfaceForPictureInPicture")
        completionHandler(true)
    }
}

// MARK: - SharePlay
//@available(tvOS 15, *)
//extension PlayViewController: MKPCoordinateManagerDelegate {
//    func groupActivityDidChanged(groupSession: GroupSession<MKPMediaWatchingActivity>, activity: MKPMediaWatchingActivity) {
//        if let sourceMediaId = sourceConfig?.mediaId, activity.mkpSourceConfig.mediaId != sourceMediaId {
//            player?.unload()
//            doShareplay(activity: activity)
//        } else if let sourceMediaId = sourceConfig?.mediaId, activity.mkpSourceConfig.mediaId == sourceMediaId  {
//            self.player?.coordinate(with: groupSession)
//        }
//    }
//}

//@available(tvOS 15.0, *)
//extension PlayViewController {
//
//    func doShareplay(activity: MKPMediaWatchingActivity) {
//        guard let groupSession = MKPCoordinateManager.shared.groupSession else {
//            log("doShareplay: GroupSession is nil")
//            return
//        }
//
//        let asset =  activity.mkpSourceConfig
//        let sourceConfig = SourceConfig(title: asset.title ?? "", isLive: asset.isLive ?? false, mediaId: asset.mediaId, applicationToken: asset.applicationToken)
//        // If a sourceConfig is available, keep the sourceOption, metadata, and cdhOptions the same.
//        let currentSourceConfig = self.sourceConfig
//        self.sourceConfig = asset
//        self.sourceConfig?.metadata = currentSourceConfig?.metadata
//        self.sourceConfig?.cdnOptions = currentSourceConfig?.cdnOptions
//        self.sourceConfig?.sourceOptions = currentSourceConfig?.sourceOptions
//        self.appDataMgr.currentSourceConfig = sourceConfig
//
//        guard let sourceConfig = self.sourceConfig else {
//            log("doShareplay: SourceConfig is nil")
//            return
//        }
//
//        self.player?.load(sourceConfiguration: sourceConfig)
//        // Assigning a group session to the player's coordinate API
//        self.player?.coordinate(with: groupSession)
//    }
//
//    func activateGroupSession(mkpSourceConfig: MKPSourceConfiguration) {
//
//        // If groupSession is nil, pass the source config to prepareToPlay which will create a group session and join to it.
//        if (MKPCoordinateManager.shared.groupSession == nil) {
//         MKPCoordinateManager.shared.prepareToPlay(mkpSourceConfig: mkpSourceConfig)
//        } else if let groupSession = MKPCoordinateManager.shared.groupSession, let sourceMediaId = sourceConfig?.mediaId, sourceMediaId != groupSession.activity.mkpSourceConfig.mediaId {
//            MKPCoordinateManager.shared.prepareToPlay(mkpSourceConfig: mkpSourceConfig)
//        }else if let groupSession = MKPCoordinateManager.shared.groupSession  {
//            self.player?.coordinate(with: groupSession)
//        }
//    }
//}
