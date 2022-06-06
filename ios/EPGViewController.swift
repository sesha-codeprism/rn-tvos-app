
//
//  EPGViewController.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit
//import Kingfisher

enum LoadType {
    case insert
    case append
    case replace
}

class EPGViewController: BaseBackgroundController {
    
    var channelDataSource: [LiveChannel] = []
    private var defaultChannelDataSource: [LiveChannel] = []
    
  // Details View
  
    @IBOutlet weak var assetImageView: UIImageView!
    @IBOutlet weak var assetDurationLable: UILabel!
    @IBOutlet weak var assetPlaybackProgressView: UIProgressView!
    @IBOutlet weak var assetTitleLabel: UILabel!
    @IBOutlet weak var assetChannelInfoLabel: UILabel!
    @IBOutlet weak var assetDescriptionLabel: UILabel!
    @IBOutlet weak var assetPlaceholderLabel: UILabel!
    @IBOutlet weak var timeLabel: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var filterButton: DetailButton!
    @IBOutlet weak var favouriteButton: UIButton!
    @IBOutlet private weak var tableView: UITableView!
    @IBOutlet private weak var containerView: UIView!
    private var collectionViews: [UICollectionView] = []
//    private var header: EPGHeaderViewController?
    private var isRequestCompleted = true
    private var filterBy = "All Channels"
    private var filterChannelBy = "All Channels"
    private var filterQualityBy = "All"
    
    var lastChannelFromOnNow: LiveChannel?
    
    @IBOutlet private weak var indicatorView: UIActivityIndicatorView!

//    private var headerDate: Date {
//        get { return header?.timeLineDataSource.first ?? Date() }
//        set { self.header?.timeLineDataSource = DateFormatter.getHours(programDate: newValue) }
//    }
    
    private var headerEndTime = Date()
    
    private var selectedChannelIndex = 0
    let blankProgramDescription = "No Information Available"
    let blankProgramName = "No Info Available"
  
    var clockUpdateTimer = Timer()

    override func viewDidLoad() {
        super.viewDidLoad()
      setFocus(to: self.filterButton)
      // Load timer to update time in details view.
      clockUpdateTimer = Timer.scheduledTimer(timeInterval: 1.0, target: self, selector: #selector(self.updateTimeAndDate), userInfo: nil, repeats: true)
        
//        LocalNotificationCenter.subscribe(observer: self, selector: #selector(loadProgramsWhenChannelMapChanged), to: .channelMapChanged)
//        createEmptyProgramsAndUpdateUI()
        tableView.mask = nil
        isRequestCompleted = false
        if let url = Bundle.main.url(forResource: "EditedData", withExtension: "json") {
            do {
              let data = try Data(contentsOf: url)
              let channels: [LiveChannel] = try JSONDecoder().decode([LiveChannel].self, from: data)
              print("Data read")
              channelDataSource = channels
            }
            catch let error as NSError {
                print(error)
            }
        } else {
          print("### failure")
        }
      let indexPathOfTop = IndexPath(row: 0, section: 0)
      self.selectedChannelIndex = 0
      DispatchQueue.main.async {
          self.tableView.scrollToRow(at: indexPathOfTop, at: .top, animated: false)
//          self.setFocus(to: (self.tableView.cellForRow(at: indexPathOfTop) as? EPGChannelCell))
//          self.setDetailView(selectedIndex: self.selectedChannelIndex)
      }
//        menuButton(action: #selector(menuPressed))
//        loadPrograms(forDate: Date(), type: .replace, range: .current, onComplete: { (_) in
//            let indexPathOfStart = IndexPath(row: 2, section: 0)
//            if indexPathOfStart.row > 2 {
//                let indexPathOfTop = IndexPath(row: indexPathOfStart.row, section: indexPathOfStart.section)
//                self.tableView.scrollToRow(at: indexPathOfTop, at: .top, animated: false)
//                self.header?.filterByView.isUserInteractionEnabled = false
//                self.header?.channelTypeView.isUserInteractionEnabled = false
//                self.header?.qualityTypeView.isUserInteractionEnabled = false
//                self.header?.calendarView.isUserInteractionEnabled = false
//            }
//            let channel = (self.tableView.cellForRow(at: indexPathOfStart) as? EPGChannelCell)
//            self.setFocus(to: channel)
//            self.selectedChannelIndex = indexPathOfStart.row
//            self.setDetailView(selectedIndex: self.selectedChannelIndex)
//            self.loadPrograms(forDate: self.headerEndTime, type: .append, range: .futureFuture, onComplete: { (_) in
//                let selectedIndex = self.selectedChannelIndex
//                self.alignProgramsBy()
//                self.setDetailView(selectedIndex: selectedIndex)
//                self.isRequestCompleted = true
//            }, onNow: false)
//        }, onNow: true)
//        designUI()
//        embedHeader()
    }
    
    override func designUI() {
        super.designUI()
        
//        tableView.backgroundColor = .clear
//        containerView.backgroundColor = .clear
//        header?.view.subviews.forEach { $0.backgroundColor = .clear }
//        collectionViews.forEach { $0.backgroundView?.backgroundColor = .clear }
    }
  override func didUpdateFocus(in context: UIFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
    
  }
  
  override func shouldUpdateFocus(in context: UIFocusUpdateContext) -> Bool {
    return true
  }
    private func getRow(of channel: LiveChannel?) -> Int? {
        guard let liveChannel = channel else { return nil }
        for (index, element) in channelDataSource.enumerated() where element.channel.channelNumber == liveChannel.channel.channelNumber {
            return index
        }
        return nil
    }

    @IBAction func filterButtonClicked(_ sender: Any) {
    }
    
    @IBAction func favouriteButtonClicked(_ sender: UIButton) {
    }
    //    private func embedHeader() {
//        EmbededManager.embed(withIdentifier: EPGHeaderViewController.identifier, parent: self, container: containerView) { [weak self] vc in
//            guard let vc = vc as? EPGHeaderViewController else { return }
//            vc.delegate = self
//            self?.header = vc
//        }
//    }
    
//    private func loadPrograms(forDate: Date, type: LoadType, range: UdlManager.Live.ScheduleRange, onComplete: (([LiveChannel]) -> Void)? = nil, onNow: Bool = false) {
//        indicatorView.startAnimating()
//        self.view.isUserInteractionEnabled = false
//        print("loadPrograms called : \(Date())")
//        loadPrograms(forDate: forDate, range: range, onComplete: { (channels) in
//            print("loadPrograms onComplete : \(Date())")
//            switch type {
//            case .insert:
//                let calculateDataLoadTime = self.calculateDataLoadTime(from: forDate.addingTimeInterval(-6.0 * 3600.0))
//                for channel in channels where (channel.schedule.first?.startUTC.value.timeIntervalSince1970 ?? 0) < calculateDataLoadTime.epgOptimizedDate.timeIntervalSince1970 {
//                    channel.schedule.first?.startUTC.value = calculateDataLoadTime.epgOptimizedDate
//                }
//
//                var lastLocalSourceIndex = 0
//
//                for sourceChannel in channels {
//
//                    //Find the same channel in default data source.
//                    if let localDataSourceIndex = self.defaultChannelDataSource.firstIndex(where: { $0.channel.channelNumber == sourceChannel.channel.channelNumber }) {
//                        lastLocalSourceIndex = localDataSourceIndex
//                        for programIndex in 0..<sourceChannel.schedule.count {
//                            if self.defaultChannelDataSource[localDataSourceIndex].schedule.contains(where: { $0.programID == sourceChannel.schedule[programIndex].programID && $0.endUTC.value == sourceChannel.schedule[programIndex].endUTC.value }) == false {
//                                self.defaultChannelDataSource[localDataSourceIndex].schedule.insert(sourceChannel.schedule[programIndex], at: 0)
//                            }
//                        }
//                        self.defaultChannelDataSource[localDataSourceIndex].schedule.sort(by: { $0.startUTC.value < $1.startUTC.value })
//
//                    } else {
//                        self.defaultChannelDataSource.insert(sourceChannel, at: lastLocalSourceIndex + 1)
//                    }
//
//                }
//
//                self.handleSpacesAndOverlaps()
//
//                if self.filterChannelBy != "All Channels" || self.filterBy != "All Channels" || self.filterQualityBy != "All" {
//                    self.filtrate()
//                } else {
//                    self.channelDataSource = self.defaultChannelDataSource
//                }
//
//                DispatchQueue.main.async {
//                    self.tableView.reloadData {
//                        self.tableView.reload(rows: [IndexPath(row: self.tableView.visibleCells.endIndex - 1 >= 0 ? self.tableView.visibleCells.endIndex - 1 : 0, section: 0)], completion: {
//                            self.updateTextAligmentForVisibleCells()
//                            onComplete?(channels)
//                        })
//                    }
//                }
//            case .append:
//                print("loadPrograms append start : \(Date())")
//                let calculateDataLoadTime = self.calculateDataLoadTime(from: forDate)
//                var headerStartTime = forDate
//                if range == .current {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(3.0 * 3600.0)
//                } else if range == .futureFuture {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(6.0 * 3600.0)
//                } else if range == .currentFeatureFeature {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(9.0 * 3600)
//                } else if range == .currentPastPast {
//                    headerStartTime = self.getSlotStartTime(date: forDate.addingTimeInterval(-6.0 * 3600.0))
//
//                    //TODO: Investigate and Remove modifiedStartUTC from design.
//                    for channel in channels {
//                        channel.schedule = channel.schedule.filter({ $0.endUTC.value > headerStartTime.epgOptimizedDate })
//                        if (channel.schedule.first?.startUTC.value.timeIntervalSince1970 ?? 0) < headerStartTime.epgOptimizedDate.timeIntervalSince1970 {
//                            channel.schedule.first?.modifiedStartUTC.value = headerStartTime.epgOptimizedDate
//                            channel.schedule.first?.modifiedStartUTC.isModified = true
//                        }
//                    }
//
//                }
//
//                var lastLocalSourceIndex = 0
//
//                for sourceChannel in channels {
//
//                    if let localDataSourceIndex = self.defaultChannelDataSource.firstIndex(where: { $0.channel.channelNumber == sourceChannel.channel.channelNumber }) {
//                        lastLocalSourceIndex = localDataSourceIndex
//                        //Remove all "No Info Available" before appending to accomodate changes in schedule.
//                        if self.defaultChannelDataSource[localDataSourceIndex].schedule.count > 1 {
//                            self.defaultChannelDataSource[localDataSourceIndex].schedule.removeAll(where: { $0.name == self.blankProgramName })
//                        }
//
//                        //TODO: Investigate and Remove modifiedStartUTC from design.
//                        //Remove all the modifiedStartUTC's
//                        if range == .currentPastPast {
//                            if self.defaultChannelDataSource[localDataSourceIndex].schedule.first?.modifiedStartUTC.isModified == true {
//                                self.defaultChannelDataSource[localDataSourceIndex].schedule.first?.modifiedStartUTC.isModified = false
//                            }
//                        }
//
//                        for programIndex in 0..<sourceChannel.schedule.count {
//                            if self.defaultChannelDataSource[localDataSourceIndex].schedule.contains(where: { $0.programID == sourceChannel.schedule[programIndex].programID && $0.startUTC.value == sourceChannel.schedule[programIndex].startUTC.value }) == false {
//                                self.defaultChannelDataSource[localDataSourceIndex].schedule.append(sourceChannel.schedule[programIndex])
//                            }
//                        }
//
//                        //Remove "No Info Available" programs in case of latest programs added to blank channels while appending.
//                        if self.defaultChannelDataSource[localDataSourceIndex].schedule.count > 1 {
//                            self.defaultChannelDataSource[localDataSourceIndex].schedule.removeAll(where: { $0.name == self.blankProgramName })
//                        }
//
//                        //Sort the datasource.
//                        self.defaultChannelDataSource[localDataSourceIndex].schedule.sort(by: { $0.startUTC.value < $1.startUTC.value })
//
//                    } else {
//                        self.defaultChannelDataSource.insert(sourceChannel, at: lastLocalSourceIndex + 1)
//                    }
//                }
//
//                self.handleSpacesAndOverlaps()
//
//                if self.filterChannelBy != "All Channels" || self.filterBy != "All Channels" || self.filterQualityBy != "All" {
//                    self.filtrate()
//                } else {
//                    self.channelDataSource = self.defaultChannelDataSource
//                }
//                print("loadPrograms append complete : \(Date())")
//                DispatchQueue.main.async {
//                    self.tableView.reloadData {
//                        if channels.count > 0 {
//                            self.tableView.reload(rows: [IndexPath(row: self.tableView.visibleCells.endIndex - 1 >= 0 ? self.tableView.visibleCells.endIndex - 1 : 0, section: 0)], completion: {
//                                self.updateTextAligmentForVisibleCells()
//                                onComplete?(channels)
//                            })
//                        }
//                    }
//                }
//                print("loadPrograms reload complete : \(Date())")
//            case .replace:
//                let calculateDataLoadTime = self.calculateDataLoadTime(from: forDate)
//                if range == .current {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(3.0 * 3600.0)
//                } else if range == .futureFuture {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(6.0 * 3600.0)
//                } else if range == .currentFeatureFeature {
//                    self.headerEndTime = calculateDataLoadTime.addingTimeInterval(9.0 * 3600)
//                }
//
//                for channel in channels {
//                    channel.schedule = channel.schedule.filter({ $0.endUTC.value > forDate.epgOptimizedDate })
//                    if (channel.schedule.first?.startUTC.value.timeIntervalSince1970 ?? 0) < forDate.epgOptimizedDate.timeIntervalSince1970 {
//                        channel.schedule.first?.modifiedStartUTC.value = forDate.epgOptimizedDate
//                        channel.schedule.first?.modifiedStartUTC.isModified = true
//                    }
//                }
//
//                self.defaultChannelDataSource = channels
//                self.channelDataSource = channels
//                self.handleSpacesAndOverlaps()
//                if self.filterChannelBy != "All Channels" || self.filterBy != "All Channels" || self.filterQualityBy != "All" {
//                    self.filtrate()
//                }
//                self.tableView.reloadData()
//                self.clearContentOffset()
//                self.updateTextAligmentForVisibleCells()
//                onComplete?(channels)
//            }
//            self.indicatorView.stopAnimating()
//            self.view.isUserInteractionEnabled = true
//        }, onError: { (_) in
//            self.indicatorView.stopAnimating()
//            self.view.isUserInteractionEnabled = true
//            self.createEmptyProgramsAndUpdateUI()
//        }, onNow: onNow)
//    }
    
//    private func createEmptyProgramsAndUpdateUI() {
//        channelDataSource = []
//        defaultChannelDataSource = []
//        if let channels = InMemoryRepository.shared.getChannels() {
//            channelDataSource = channels.map({ (channel) -> LiveChannel in
//                return LiveChannel(channel: channel.channel, programs: createEmptyPrograms(for: Date().epgOptimizedDate))
//            })
//        }
//        DispatchQueue.main.async {
//
//            self.tableView.reloadData()
//        }
//    }
    
    private func calculateDataLoadTime(from: Date) -> Date {
        var date = from.epgOptimizedDate
        let calendar = Calendar.current
        let hours = calendar.component(.hour, from: date) % 3
        let minutes = calendar.component(.minute, from: date)
        date = date.addingTimeInterval(-(Double(hours) * 3600.0))
        date = date.addingTimeInterval(-(Double(minutes) * 60.0))
        return date
    }
    
//    private func handleSpacesAndOverlaps() {
//        //Scan all programs and insert "No Info Available" programs to fill the gaps.
//        for channelIndex in 0..<self.channelDataSource.count {
//
//            var programCount = self.channelDataSource[channelIndex].schedule.count
//            var programIndex = 0
//
//            while programIndex < programCount {
//
//                let currentProgram = self.channelDataSource[channelIndex].schedule[programIndex]
//                guard let currentUTC = JSONDate(headerDate.epgOptimizedDate) else { return }
//
//                if programIndex == 0 {
//                    if currentProgram.startUTC.value > currentUTC.value {
//                        //Insert "No Info Available" programs to fill the gap before the first program of a channel in full guide.
//                        let noInfoProgram: Program = Program(description: self.blankProgramDescription, startUTC: currentUTC, endUTC: currentProgram.startUTC, name: blankProgramName)
//
//                        self.channelDataSource[channelIndex].schedule.insert(noInfoProgram, at: programIndex)
//                        programCount += 1
//                    }
//                } else {
//                    let previousProgram = self.channelDataSource[channelIndex].schedule[programIndex - 1]
//                    if currentProgram.startUTC.value != previousProgram.endUTC.value {
//                        //Insert "No Info Available" programs between two programs where a gap is found.
//                        if previousProgram.endUTC.value < currentProgram.startUTC.value {
//                            let noInfoProgram: Program = Program(description: self.blankProgramDescription, startUTC: previousProgram.endUTC, endUTC: currentProgram.startUTC, name: self.blankProgramName)
//                            self.channelDataSource[channelIndex].schedule.insert(noInfoProgram, at: programIndex)
//                            programCount += 1
//
//                        //Remove old programs which are replaced with new ones in latest schedule.
//                        } else if previousProgram.startUTC.value == currentProgram.startUTC.value {
//                            self.channelDataSource[channelIndex].schedule.remove(at: programIndex - 1)
//                            programCount -= 1
//                        } else {
//                            if previousProgram.endUTC.value > currentProgram.startUTC.value {
//                                TVLog("Need to modify the endUTC to startUTC")
//                                self.channelDataSource[channelIndex].schedule[programIndex - 1].endUTC = currentProgram.startUTC
//                            } else {
//                                TVLog("EPGViewController: handleSpacesAndOverlaps - Invalid program detected: \(String(describing: currentProgram))")
//                            }
//                        }
//                    }
//                }
//                programIndex += 1
//            }
//        }
//
//        for channelIndex in 0..<self.defaultChannelDataSource.count {
//
//            var programCount = self.defaultChannelDataSource[channelIndex].schedule.count
//            var programIndex = 0
//
//            while programIndex < programCount {
//
//                let currentProgram = self.defaultChannelDataSource[channelIndex].schedule[programIndex]
//                guard let currentUTC = JSONDate(headerDate.epgOptimizedDate) else { return }
//
//                if programIndex == 0 {
//                    if currentProgram.startUTC.value > currentUTC.value {
//                        //Insert "No Info Available" programs to fill the gap before the first program of a channel in full guide.
//                        let noInfoProgram: Program = Program(description: self.blankProgramDescription, startUTC: currentUTC, endUTC: currentProgram.startUTC, name: self.blankProgramName)
//                        self.defaultChannelDataSource[channelIndex].schedule.insert(noInfoProgram, at: programIndex)
//                        programCount += 1
//                    }
//                } else {
//                    let previousProgram = self.defaultChannelDataSource[channelIndex].schedule[programIndex - 1]
//                    if currentProgram.startUTC.value != previousProgram.endUTC.value {
//                        //Insert "No Info Available" programs between two programs where a gap is found.
//                        if previousProgram.endUTC.value < currentProgram.startUTC.value {
//                            let noInfoProgram: Program = Program(description: self.blankProgramDescription, startUTC: previousProgram.endUTC, endUTC: currentProgram.startUTC, name: self.blankProgramName)
//                            self.defaultChannelDataSource[channelIndex].schedule.insert(noInfoProgram, at: programIndex)
//                            programCount += 1
//
//                        //Remove old programs which are replaced with new ones in latest schedule.
//                        } else if previousProgram.startUTC.value == currentProgram.startUTC.value {
//                            self.defaultChannelDataSource[channelIndex].schedule.remove(at: programIndex - 1)
//                            programCount -= 1
//                        } else {
//                            if previousProgram.endUTC.value > currentProgram.startUTC.value {
//                                TVLog("Need to modify the endUTC to startUTC")
//                                self.defaultChannelDataSource[channelIndex].schedule[programIndex - 1].endUTC = currentProgram.startUTC
//                            } else {
//                                TVLog("EPGViewController: Invalid program detected: \(String(describing: currentProgram))")
//                            }
//                        }
//                    }
//                }
//                programIndex += 1
//            }
//        }
//        self.validateChannelDataSource()
//    }
    
//    @objc private func loadProgramsWhenChannelMapChanged() {
//      self.loadPrograms(forDate: Date(), type: .replace, range: .current, onComplete: { _ in
//          let indexPathOfTop = IndexPath(row: 0, section: 0)
//          self.selectedChannelIndex = 0
//          DispatchQueue.main.async {
//              self.tableView.scrollToRow(at: indexPathOfTop, at: .top, animated: false)
//              self.setFocus(to: (self.tableView.cellForRow(at: indexPathOfTop) as? EPGChannelCell))
//              self.setDetailView(selectedIndex: self.selectedChannelIndex)
//          }
//          self.loadPrograms(forDate: self.headerEndTime, type: .append, range: .futureFuture, onComplete: { (_) in
//             let selectedIndex = self.selectedChannelIndex
//             DispatchQueue.main.async {
//               self.setDetailView(selectedIndex: selectedIndex)
//             }
//          }, onNow: false)
//      }, onNow: true)
//    }
    
//    private func validateChannelDataSource() {
//
//        for channelIndex in 0..<self.channelDataSource.count {
//
//            for programIndex in 0..<self.channelDataSource[channelIndex].schedule.count {
//                let currentProgram = self.channelDataSource[channelIndex].schedule[programIndex]
//
//                if self.channelDataSource[channelIndex].schedule.count == 1 {
//                    if currentProgram.startUTC.value > currentProgram.endUTC.value {
//                        TVLog("EPGViewController validateChannelDataSource, Rule1 Channel Name: \(String(describing: self.channelDataSource[channelIndex].channel.name)), startUTC: \(String(describing: currentProgram.startUTC.value)), endUTC: \(String(describing: currentProgram.startUTC.value))")
//                    }
//                } else  if programIndex > 1 {
//                    let previousProgram = self.channelDataSource[channelIndex].schedule[programIndex - 1]
//                    if currentProgram.startUTC.value > currentProgram.endUTC.value {
//                        TVLog("EPGViewController validateChannelDataSource, Rule2 Channel Name: , \(String(describing: self.channelDataSource[channelIndex].channel.name)) , Current startUTC: , \(String(describing: currentProgram.startUTC.value)), Previous endUTC: \(String(describing: previousProgram.endUTC.value))")
//                    }
//                    if previousProgram.endUTC.value != currentProgram.startUTC.value {
//                        TVLog("EPGViewController validateChannelDataSource, Rule3 Channel Name: , \(String(describing: self.channelDataSource[channelIndex].channel.name)) , Current startUTC: , \(String(describing: currentProgram.startUTC.value)), Previous endUTC: \(String(describing: previousProgram.endUTC.value))")
//                    }
//                }
//            }
//        }
//        TVLog("EPGViewController validateChannelDataSource complete")
//    }
    
    private func createEmptyPrograms(for date: Date) -> [Program] {
        var programs: [Program] = []
        var programDate = date
        for _ in 0..<30 {
            if let jsonDateStart = JSONDate(programDate), let jsonDateEnd = JSONDate(programDate.addingTimeInterval(1800.0)) {
                programDate = programDate.addingTimeInterval(1800.0)
                programs.append(Program(description: self.blankProgramDescription, startUTC: jsonDateStart, endUTC: jsonDateEnd, name: self.blankProgramName))
            }
        }
        return programs
    }
    
//    private func loadPrograms(forDate: Date, range: UdlManager.Live.ScheduleRange = .currentPastFeature, onComplete: (([LiveChannel]) -> Void)? = nil, onError: ((Error) -> Void)? = nil, onNow: Bool = false) {
//        DispatchQueue.global(qos: .background).async {
//            let useCache = range == .current ? false : true
//            UdlManager.shared.live.loadSchedulesRange(time: forDate, range: range, useCache: useCache, onSuccess: { (channels, _) in
//                DispatchQueue.main.async {
//                    onComplete?(channels)
//                }
//            }, onError: onError, onNow: onNow)
//        }
//    }
}

//extension EPGViewController: EPGHeaderViewControllerDelegate {
//    func didSelect(_ filter: EPGFilterCellModel) {
//        switch filter.type {
//        case .calendar:
//            if filter.filter == "ON NOW" {
//                headerDate = Date()
//            } else {
//                headerDate = filter.date
//            }
//            loadPrograms(forDate: headerDate, type: .replace, range: .currentFeatureFeature, onNow: headerDate < Date() ? true : false)
//        case .filterBy:
//            filterBy = filter.filter
//            filtrate()
//            tableView.reloadData()
//        case .channelType:
//            filterChannelBy = filter.filter
//            filtrate()
//            tableView.reloadData()
//        case .qualityType:
//            filterQualityBy = filter.filter
//            filtrate()
//            tableView.reloadData()
//        default: break
//        }
//    }
//
//    func getNewOnNow() {
//        loadPrograms(forDate: Date(), type: .replace, range: .currentFeatureFeature, onNow: true)
//        headerDate = Date().epgOptimizedDate
//    }
//
//    func reset() {
//        channelDataSource = defaultChannelDataSource
//        filterChannelBy = "All Channels"
//        filterBy = "All Channels"
//        filterQualityBy = "All"
//        tableView.reloadData()
//    }
//
//    private func filtrate() {
//
//        //Channel Type filter
//        channelDataSource = filterChannelBy == "All Channels" ? defaultChannelDataSource : defaultChannelDataSource.filter({ $0.channel.stationType == self.filterChannelBy })
//
//        //Filter By filter
//        if filterBy == "Playable On This Device" {
//            channelDataSource = channelDataSource.filter({
//                return EPGFilterViewController.isPlayableOnDevice(program: $0.firstProgram, channel: $0.channel) && InMemoryRepository.shared.isSubscribedChannel(channelNumber: $0.channel.channelNumber)
//            })
//        } else if filterBy == "Subscribed" {
//            channelDataSource = channelDataSource.filter({
//                return InMemoryRepository.shared.isSubscribedChannel(channelNumber: $0.channel.channelNumber)
//            })
//        } else {
//            //TODO : Add other filter logic if any.
//        }
//
//        // Quality filter
//        if filterQualityBy != "All" {
//            channelDataSource = channelDataSource.filter({
//                let channelNumber = "\($0.channel.channelNumber)"
//                return InMemoryRepository.shared.isChannelAvailableWithQuality(channelNumber: channelNumber, quality: filterQualityBy)
//            })
//        }
//    }
//
//    func setChannelTypeFilters() -> [String]? {
//        var uniqueFilters: Set<String> = []
//        channelDataSource.forEach { (LiveChannel) in
//            if let stationType = LiveChannel.channel.stationType, stationType != "" {
//                uniqueFilters.insert(stationType)
//            }
//        }
//        return Array(uniqueFilters.sorted())
//    }
//
//    func disable() {
//        view.subviews.forEach { subView in
//            if subView != containerView {
//                subView.isUserInteractionEnabled = false
//            }
//        }
//    }
//
//    func enable() {
//        view.subviews.forEach { $0.isUserInteractionEnabled = true }
//    }
//}

extension EPGViewController: UITableViewDelegate, UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return channelDataSource.count == 0 ? 1 : channelDataSource.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if channelDataSource.count == 0 {
            let cell: OnNowNoDataTableViewCell = tableView.dequeueReusableCell(for: indexPath)
            return cell
        } else {
            let cell: EPGChannelCell = tableView.dequeueReusableCell(for: indexPath)
            cell.delegate = self
          print(cell.delegate)
            cell.dataSource = channelDataSource[indexPath.row]
            if collectionViews.contains(cell.collectionView) == false { collectionViews.append(cell.collectionView) }
            return cell
        }
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        if channelDataSource.count == 0 {
            return 350
        }
        return 108
    }

    func tableView(_ tableView: UITableView, didUpdateFocusIn context: UITableViewFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
        switch context.focusHeading {
        case .up, .down:
          collectionViews.forEach { $0.backgroundColor = .clear }
            guard let row = context.nextFocusedIndexPath?.row else { return }
            if row == 0 || row == 1 {
//                header?.filterByView.isUserInteractionEnabled = row == 0 ? true : false
//                header?.channelTypeView.isUserInteractionEnabled = row == 0 ? true : false
//                header?.qualityTypeView.isUserInteractionEnabled = row == 0 ? true : false
//                header?.calendarView.isUserInteractionEnabled = row == 0 ? true : false
            }
            self.tableView.setContentOffset(CGPoint(x: Int(self.tableView.contentOffset.x), y: Int(row > 1 ? (row - 1) * 122 : 0)), animated: false)
        default:
            guard let defaultRow = context.nextFocusedIndexPath?.row else { return }
//            self.tableView.setContentOffset(CGPoint(x: Int(self.tableView.contentOffset.x), y: Int(defaultRow > 2 ? (defaultRow - 2) * 82 : 0)), animated: false)
        }
    }
}

extension EPGViewController: EPGChannelCellDelegate {
    
    func leftSwipe(_ cell: UICollectionViewCell, _ collectionView: UICollectionView, _ indexPath: IndexPath, _ nextIndexPath: IndexPath, programs: [Program]?) {
        focused(cell, collectionView, indexPath, nextIndexPath, .left, programs: programs)
    }
    
    func didSelect(_ program: Program?, _ id: String, channel: LiveChannel?) {
      print("DPEPG: didSelect called")
        //let detailVC: DetailViewController = DetailViewController.instantiateViewController()
//        var methadata = MediaItem.Methadata()
//        if program?.isOnNow == true {
//           methadata[dynamicMember: "live"] = "true"
//            methadata[dynamicMember: "start"] = program?.startUTC.string
//            methadata[dynamicMember: "duration"] = "\(Date.hoursAndMinutesFrom(program?.startUTC.value)) - \(Date.hoursAndMinutesFrom(program?.endUTC.value))".trimmingCharacters(in: .whitespaces)
//            methadata[dynamicMember: "end"] = program?.endUTC.string
//        } else {
//            methadata[dynamicMember: "start"] = program?.startUTC.string
//            methadata[dynamicMember: "duration"] = "\(Date.hoursAndMinutesFrom(program?.startUTC.value)) - \(Date.hoursAndMinutesFrom(program?.endUTC.value))".trimmingCharacters(in: .whitespaces)
//            methadata[dynamicMember: "upcoming"] = "true"
//            methadata[dynamicMember: "end"] = program?.endUTC.string
//        }
//        if let channel = channel {
//            methadata[dynamicMember: "channel"] = "\(channel.channel.channelNumber) \(channel.channel.callLetters)"
//            methadata[dynamicMember: "channelNumber"] = "\(channel.channel.channelNumber)"
//            methadata[dynamicMember: feedType] = liveFeed
//        }
//
//        methadata[dynamicMember: "seriesID"] = program?.seriesID
//        //detailVC.uniqueDetailHeaderModel
//        if let model = program.map({ (item) -> MediaItem in
//            return MediaItem(id: item.seriesID ?? item.programID,
//                             type: .live,
//                             itemType: .live,
//                             showType: (item.seriesID == nil && item.seasonID == nil) ? .movie : .tVShow,
//                             methadata: methadata,
//                             name: item.name,
//                             description: item.description,
//                             item: channel,
//                             isGeneric: item.isGeneric)
//        }) {
//        //navigateShow(to: detailVC)
//            navigateToDetailsOrEpisodeListingWith(item: model) }
    }
    
    func focused(_ cell: UICollectionViewCell?, _ collectionView: UICollectionView, _ indexPath: IndexPath, _ nextIndexPath: IndexPath, _ focusHeading: UIFocusHeading, programs: [Program]?) {
      print("DPEPG: focused called -> Moving from \(indexPath.row), \(indexPath.section) TO \(nextIndexPath.row), \(nextIndexPath.section) and focus is heading \(focusHeading)")
        guard let cell = cell as? EPGProgramsCell else { return }
//      collectionView.cellForItem(at: indexPath)?.backgroundView?.backgroundColor = UIColor.darkGray
//      collectionView.cellForItem(at: nextIndexPath)?.backgroundColor = UIColor.blue
        selectedChannelIndex = channelDataSource.firstIndex(where: { $0.channel.channelNumber == cell.model?.channel.channelNumber }) ?? 0

//        var startTime = Date()
//        if cell.dataSource?.modifiedStartUTC.isModified ?? false {
//            startTime = cell.dataSource?.modifiedStartUTC.value ?? Date()
//        } else {
//            startTime = cell.dataSource?.startUTC.value ?? Date()
//        }

      if focusHeading == .right && nextIndexPath.row > indexPath.row {
        let currentCell = collectionView.cellForItem(at: indexPath)
        self.setContentOffset(x: currentCell?.frame.width, onComplete: {
//          self.updateTextAligmentForVisibleCells()
        })
      } else if focusHeading == .left && nextIndexPath.row < indexPath.row {
        let nextCell = collectionView.cellForItem(at: nextIndexPath)
        self.setContentOffset(x: -(nextCell?.frame.width ?? 0.0), onComplete: {
//          self.updateTextAligmentForVisibleCells()
        })
      }
      
      guard let dataSource = cell.dataSource else { return }
      self.loadDetailsViewWith(focusedProgram: dataSource, focusedChannel: channelDataSource[selectedChannelIndex])
      
//        header?.calendarView.title?.text = startTime.shortStringDate?.uppercased()
//        if startTime.timeIntervalSince1970 - headerDate.timeIntervalSince1970 >= 30.0 * 60.0, focusHeading == .right {
//            let hourDiffrent = Int(startTime.timeIntervalSince1970 - headerDate.timeIntervalSince1970)
//            let shift = hourDiffrent / Int((30.0 * 60.0))
//            headerDate = startTime
//            setContentOffset(x: CGFloat(450 * shift), onComplete: {
//                self.updateTextAligmentForVisibleCells()
//            })
//        }
//        if focusHeading == .left, startTime.timeIntervalSince1970 < headerDate.timeIntervalSince1970 {
//            let hourDiffrent = Int(headerDate.timeIntervalSince1970 - startTime.timeIntervalSince1970)
//            var shift = hourDiffrent / Int((30.0 * 60.0))
//            if (hourDiffrent % Int(30.0 * 60.0)) > 0 { shift += 1 }
//            headerDate = startTime
//            setContentOffset(x: CGFloat(-450 * shift), onComplete: {
//                self.updateTextAligmentForVisibleCells()
//            })
//        }
//        if focusHeading == .up || focusHeading == .down {
//            self.alignProgramsBy()
//            setContentOffset(x: 0, onComplete: { self.updateTextAligmentForVisibleCells() })
//            if let selectedIndex = channelDataSource.firstIndex(where: { $0.channel.channelNumber == cell.model?.channel.channelNumber }) {
//                  self.setDetailView(selectedIndex: selectedIndex)
//            }
//            if let visibleCells = collectionView.visibleCells as? [EPGProgramsCell] {
//                if let nextFocusedCell = visibleCells.sorted(by: { ($0.dataSource?.startUTC.value ?? Date()) < ($1.dataSource?.startUTC.value ?? Date()) }).first(where: { ($0.dataSource?.endUTC.value ?? Date()).timeIntervalSince1970 > customised(toDate: headerDate).timeIntervalSince1970 }) {
//                    if header?.filterByView.isUserInteractionEnabled == false {
//                        self.setFocus(to: nextFocusedCell.backView)
//                        Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(updateTextAligmentForVisibleCells), userInfo: nil, repeats: false)
//                    }
//                }
//            }
//        }
//
//        if focusHeading == .right, isRequestCompleted == true, headerEndTime.timeIntervalSince1970 - headerDate.timeIntervalSince1970 <= 4.0 * 3600.0 {
//
//            loadPrograms(forDate: headerEndTime, type: .append, range: .currentFeatureFeature, onComplete: { (_) in
//                let selectedIndex = self.selectedChannelIndex
//                self.alignProgramsBy()
//                self.setDetailView(selectedIndex: selectedIndex)
//            }, onNow: false)
//        } else {
//            if focusHeading == .left, (indexPath.row == 0 || nextIndexPath.row == 0), startTime > Date() {
//                loadPrograms(forDate: headerDate, type: .append, range: .currentPastPast, onComplete: { (_) in
//                    let selectedIndex = self.selectedChannelIndex
//                    self.clearContentOffset()
//                    let firstProgramStartTime = self.channelDataSource.first?.schedule.first?.modifiedStartUTC.isModified ?? false ? self.channelDataSource.first?.schedule.first?.modifiedStartUTC : self.channelDataSource.first?.schedule.first?.startUTC
//                    let x: CGFloat = CGFloat((self.headerDate.timeIntervalSince1970 - (firstProgramStartTime?.value.timeIntervalSince1970 ?? Date().timeIntervalSince1970)) / 3600)
//                    self.setContentOffset(x: x * 900, onComplete: {
//                        self.setFocus(to: (self.tableView.cellForRow(at: IndexPath(row: selectedIndex, section: 0)) as? EPGChannelCell)?.collectionView.firstVisibleCell)
//                        Timer.scheduledTimer(timeInterval: 0.1, target: self, selector: #selector(self.updateTextAligmentForVisibleCells), userInfo: nil, repeats: false)
//                    })
//                    self.alignProgramsBy()
//                    self.setDetailView(selectedIndex: selectedIndex)
//                }, onNow: false)
//            }
//        }
    }
    
    func getSlotStartTime(date: Date) -> Date {
        let calendar = Calendar.utc
        let slot = (calendar.component(.hour, from: date) / 3) * 3
        var components = calendar.dateComponents([.year, .month, .day, .hour, .minute, .second], from: date)
        components.hour = slot
        components.minute = 0
        components.second = 0
        return calendar.date(from: components) ?? date
    }
    
//    @objc private func updateTextAligmentForVisibleCells() {
//        let headerTime = header?.timeLineDataSource.first?.timeIntervalSince1970 ?? 0
//        for collectionView in collectionViews where !collectionView.visibleCells.isEmpty {
//            guard let visibleCells = collectionView.visibleCells.sorted(by: { $0.frame.origin.x < $1.frame.origin.x }) as? [EPGProgramsCell] else { return }
//            for cell in visibleCells {
//                let needRedrawRect = (cell.dataSource?.startUTC.value.timeIntervalSince1970 ?? 0) < headerTime && (cell.dataSource?.endUTC.value.timeIntervalSince1970 ?? 0) > headerTime
//                let visibleCellX = collectionView.contentOffset.x - cell.frame.origin.x
//                cell.titleLabel.textOffsetX = needRedrawRect ? visibleCellX : 0
//            }
//        }
//    }
    
    private func setContentOffset(x: CGFloat? = nil, visibleCell: UICollectionViewCell? = nil, onComplete: @escaping () -> Void) {
        for index in 0..<collectionViews.count {
            let offset = collectionViews[index].contentOffset.x
            var x: CGFloat = offset + (x ?? 0)
            if let visibleCell = visibleCell, offset > visibleCell.frame.origin.x {
                x = offset - (offset - visibleCell.frame.origin.x)
            }
            collectionViews[index].setContentOffset(CGPoint(x: x, y: 0)) {
                if index == self.collectionViews.count - 1 {
                    onComplete()
                }
            }
        }
    }
    
    private func alignProgramsBy() {
        let x = collectionViews.sorted(by: { $0.contentOffset.x > $1.contentOffset.x }).first?.contentOffset.x ?? 0
        for collectionView in collectionViews where collectionView.contentOffset.x != x {
            collectionView.setContentOffset(CGPoint(x: x, y: collectionView.contentOffset.y), animated: false)
        }
    }
    
    private func clearContentOffset() {
        for collectionView in collectionViews {
            collectionView.setContentOffset(CGPoint(x: 0, y: 0), animated: false)
        }
    }
    
    private func setDetailView(selectedIndex: Int) {
        for cell in self.tableView.visibleCells {
            guard let visibleIndex = self.channelDataSource.firstIndex(where: { $0.channel.channelNumber == (cell as? EPGChannelCell)?.dataSource?.channel.channelNumber }) else { return }
            if visibleIndex < selectedIndex {
                cell.frame = CGRect(x: 0, y: visibleIndex * 82, width: Int(cell.frame.width), height: 68)
            } else {
                if visibleIndex == selectedIndex {
                    cell.frame = CGRect(x: 0, y: visibleIndex * 82, width: Int(cell.frame.width), height: 389)
                } else {
                    cell.frame = CGRect(x: 0, y: (visibleIndex * 82 + 389) - 68, width: Int(cell.frame.width), height: 68)
                }
            }
        }
        self.tableView.setContentOffset(CGPoint(x: Int(self.tableView.contentOffset.x), y: Int(selectedIndex > 2 ? (selectedIndex - 2) * 82 : 0)), animated: false)
    }

    // Return true live time to focus currently playing programs if its available in
//    func customised(toDate: Date) -> Date {
//        let timeDiff = (toDate.timeIntervalSince1970 - Date().timeIntervalSince1970) / 60
//        if timeDiff > 30 || timeDiff < -30 {
//            return toDate
//        }
//        let currentDate = Date().fetchMinutesAndSecond()
//        let headerDate = fetchDateDetails(fromDate: toDate)
//        let calendar = Calendar.utc
//        let dateComponents = DateComponents(calendar: calendar, year: headerDate.years, month: headerDate.months, day: headerDate.days, hour: headerDate.hours, minute: currentDate.minutes, second: currentDate.seconds)
//
//        // DateComponents as a date specifier
//        let date = calendar.date(from: dateComponents) ?? Date()
//        return date
//    }

    // to fetch the headerDate Value
    func fetchDateDetails(fromDate: Date) -> (years: Int, months: Int, days: Int, hours: Int) {
        let calendar = Calendar.utc
        let years = calendar.component(.year, from: fromDate)
        let months = calendar.component(.month, from: fromDate)
        let days = calendar.component(.day, from: fromDate)
        let hours = calendar.component(.hour, from: fromDate)
        return (years, months, days, hours)
    }
  
    // Load details view
  func loadDetailsViewWith(focusedProgram: Program, focusedChannel: LiveChannel) {
    // From focusedProgram
    // name
    // startUTC
    // endUTC
    // description
    // releaseYear
    // Images - images array ?
    let formatter = DateFormatter()
    formatter.dateFormat = "hh:mm a"
    formatter.amSymbol = "AM"
    formatter.pmSymbol = "PM"
    self.assetDurationLable.text = "\(formatter.string(from: focusedProgram.startUTC.value)) - \(formatter.string(from: focusedProgram.endUTC.value))"
    self.assetTitleLabel.text = focusedProgram.name
    self.assetDescriptionLabel.text = focusedProgram.description
    self.assetPlaybackProgressView.progress = 0.8
    // From focusedChannel
    // channel name - callLetters (or) name
    // channel number - channelNumber
    var assetRating = ""
    var assetReleaseYear = ""
    if let rating = focusedProgram.ratings.first?.value {
      assetRating = "\(rating) · "
    }
    if focusedProgram.releaseYear != nil {
      assetReleaseYear = "\(focusedProgram.releaseYear ?? 0) · "
    }
    self.assetChannelInfoLabel.text = "\(assetReleaseYear)\(assetRating) \(focusedChannel.channel.callLetters)\(focusedChannel.channel.channelNumber) · "
    if let urlString = focusedProgram.images?.first?.uri {
//      self.assetImageView.kf.setImage(with: URL(string: urlString))
    }
  }
  
  @objc func updateTimeAndDate() {
    let formatter = DateFormatter()
    formatter.dateFormat = "hh:mm a"
    formatter.amSymbol = "AM"
    formatter.pmSymbol = "PM"
    self.timeLabel.text = formatter.string(from: Date())
    
    formatter.dateFormat = "MMM dd"
    self.dateLabel.text = formatter.string(from: Date())
  }
}

extension UICollectionView {
    func setContentOffset( _ at: CGPoint, animated: Bool = false, completion: @escaping () -> ()) {
        UIView.animate(withDuration: 0, animations: { self.setContentOffset(at, animated: animated) }) { _ in completion() }
    }
}

extension UITableView {
    func reload(rows: [IndexPath], completion: @escaping () -> ()) {
        // TODO: Can we use reconfigureRows() ?
        UIView.animate(withDuration: 0, animations: { self.reloadRows(at: rows, with: .automatic) }) { _ in completion() }
    }
    
    func reloadData(completion: @escaping () -> ()) {
        UIView.animate(withDuration: 0, animations: { self.reloadData() }) { _ in completion() }
    }
}

extension EPGViewController {
    @objc func menuPressed() {
        if self.selectedChannelIndex != 0 {
            let indexPath = IndexPath(row: 0, section: 0)
            self.tableView.scrollToRow(at: indexPath, at: .top, animated: false)
            let row = (self.tableView.cellForRow(at: indexPath) as? EPGChannelCell)
            self.setFocus(to: row)
            self.selectedChannelIndex = 0
            self.setDetailView(selectedIndex: 0)
        } else {
            self.navigationController?.popViewController(animated: true)
        }

    }
}
//extension UITableView {
//    func dequeueReusableCell<T: UITableViewCell>(for indexPath: IndexPath) -> T {
//        guard let cell = dequeueReusableCell(withIdentifier: T.identifier, for: indexPath) as? T else {
//            fatalError("Could not find table view cell with identifier \(T.identifier)")
//        }
//        return cell
//    }
//    func dequeueReusableCell<T: UITableViewCell>() -> T {
//        guard let cell = dequeueReusableCell(withIdentifier: T.identifier) as? T else {
//            fatalError("Could not find table view cell with identifier \(T.identifier)")
//        }
//        return cell
//    }
//
//    func cellForRow<T: UITableViewCell>(at indexPath: IndexPath) -> T {
//        guard let cell = cellForRow(at: indexPath) as? T else {
//            fatalError("Could not get cell as type \(T.self)")
//        }
//        return cell
//    }
//
//    func register<T: UITableViewCell>(cell: T.Type) {
//        register(T.nib, forCellReuseIdentifier: T.identifier)
//    }
//}

extension UIViewController {
    class var identifier: String {
        return String(describing: self)
    }
    
    var classIdentifier: String {
        return String(describing: type(of: self))
    }
    
    static func instantiateViewController<T: UIViewController>(_ bundle: Bundle? = nil) -> T {
        let storyboard = UIStoryboard(name: identifier, bundle: nil)
        return storyboard.instantiateViewController(withIdentifier: identifier) as? T ?? T()
    }
}

protocol Poppable {
    func pop(_ animated: Bool, completion: (() -> Void)?)
}

extension UINavigationController: Poppable {
    func pop(_ animated: Bool, completion: (() -> Void)?) {
        CATransaction.begin()
        CATransaction.setCompletionBlock(completion)
        popViewController(animated: animated)
        CATransaction.commit()
    }
}

extension UIView {
    class var identifier: String {
        return String(describing: self)
    }
    
    class var nib: UINib {
        return UINib(nibName: identifier, bundle: Bundle(for: self))
    }
    
    class func viewFromNib<T: UIView>() -> T {
        return nib.instantiate(withOwner: self, options: nil).first as? T ?? T()
    }
}

extension UITableView {
    func dequeueReusableCell<T: UITableViewCell>(for indexPath: IndexPath) -> T {
        guard let cell = dequeueReusableCell(withIdentifier: T.identifier, for: indexPath) as? T else {
            fatalError("Could not find table view cell with identifier \(T.identifier)")
        }
        return cell
    }
    func dequeueReusableCell<T: UITableViewCell>() -> T {
        guard let cell = dequeueReusableCell(withIdentifier: T.identifier) as? T else {
            fatalError("Could not find table view cell with identifier \(T.identifier)")
        }
        return cell
    }
    
    func cellForRow<T: UITableViewCell>(at indexPath: IndexPath) -> T {
        guard let cell = cellForRow(at: indexPath) as? T else {
            fatalError("Could not get cell as type \(T.self)")
        }
        return cell
    }
    
    func register<T: UITableViewCell>(cell: T.Type) {
        register(T.nib, forCellReuseIdentifier: T.identifier)
    }
}

extension UICollectionView {
    func dequeueReusableCell<T: UICollectionViewCell>(for indexPath: IndexPath) -> T {
        guard let cell = dequeueReusableCell(withReuseIdentifier: T.identifier, for: indexPath) as? T else {
            fatalError("Could not find collection view cell with identifier \(T.identifier)")
        }
        return cell
    }
    
    func dequeueReusableSupplementaryView<T: UICollectionReusableView>(ofKind kind: String, for indexPath: IndexPath) -> T {
        guard let header = dequeueReusableSupplementaryView(ofKind: kind,
                                                            withReuseIdentifier: T.identifier,
                                                            for: indexPath) as? T
            else {
                fatalError("Could not find collection supplementary view with identifier \(T.identifier)")
        }
        return header
    }
    
    func register<T: UICollectionViewCell>(cell: T.Type) {
        register(T.nib, forCellWithReuseIdentifier: T.identifier)
    }
    
    func scrollToFirst() {
        if !visibleCells.isEmpty {
            scrollToItem(at: IndexPath(row: 0, section: 0), at: .left, animated: true)
        }
    }
    
    func isFocused() -> Bool {
        return visibleCells.first(where: { $0.isFocused })?.isFocused ?? false
    }
}

