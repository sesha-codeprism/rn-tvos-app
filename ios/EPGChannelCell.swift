//
//  EPGChannelCell.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

protocol EPGChannelCellDelegate: class {
    func focused(_ cell: UICollectionViewCell?, _ collectionView: UICollectionView, _ indexPath: IndexPath, _ nextIndexPath: IndexPath, _ focusHeading: UIFocusHeading, programs: [Program]?)
    func didSelect(_ program: Program?, _ id: String, channel: LiveChannel?)
    func leftSwipe(_ cell: UICollectionViewCell, _ collectionView: UICollectionView, _ indexPath: IndexPath, _ nextIndexPath: IndexPath, programs: [Program]?)
}

class EPGChannelCell: BaseTableViewCell {
    
    @IBOutlet private weak var progrmaDetailView: UIView!
    
    @IBOutlet private weak var channelImage: UIImageView!
    
    @IBOutlet weak var gradientView: UIView!
    
    weak var delegate: EPGChannelCellDelegate?
    
    override var canBecomeFocused: Bool {
        return false
    }
    
    @IBOutlet weak var collectionView: UICollectionView!
    
    var dataSource: LiveChannel? {
        didSet {
            gradientView.isHidden = !(dataSource?.isFocused ?? false)
            titleLabel.text = """
            \(String(describing: dataSource?.channel.channelNumber ?? 0))
            \(dataSource?.channel.callLetters ?? "")
            """
//            channelImage.kf.setImage(with: dataSource?.channel.images?.first?.uri.asURL, placeholder: UIImage.chanelPlaceholder)
            collectionView.reloadData()
        }
    }
    
    func setDetails(program: Program? ) {
        progrmaDetailView.isHidden = true
//        progrmaDetailView.dataSource = program
//        progrmaDetailView.isHidden = false
    }

    override func awakeFromNib() {
        super.awakeFromNib()
        
//        gradientView.setGradient()
        collectionView.delegate = self
        collectionView.dataSource = self
//        progrmaDetailView.alpha = DesignData.model?.screen?.epg?.FullGuideFocusAlpha ?? 0.9
    }
}


// MARK: - UICollectionViewDelegate
extension EPGChannelCell: UICollectionViewDelegate, UICollectionViewDataSource, UICollectionViewDelegateFlowLayout {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return dataSource?.schedule.count ?? 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(for: indexPath) as EPGProgramsCell
        cell.delegate = self
        cell.model = dataSource
        cell.dataSource = dataSource?.schedule[indexPath.row]
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didUpdateFocusIn context: UICollectionViewFocusUpdateContext, with coordinator: UIFocusAnimationCoordinator) {
        let previouslyIndexPath = context.previouslyFocusedIndexPath ?? IndexPath(row: 0, section: 0)
        let nextIndexPath = context.nextFocusedIndexPath ?? previouslyIndexPath
        let nextCell = collectionView.cellForItem(at: nextIndexPath)
        switch context.focusHeading {
        case .left:
            delegate?.focused(nextCell, collectionView, previouslyIndexPath, nextIndexPath, context.focusHeading, programs: dataSource?.schedule)
        case .right:
            delegate?.focused(nextCell, collectionView, previouslyIndexPath, nextIndexPath, context.focusHeading, programs: dataSource?.schedule)
        case .down, .up:
            delegate?.focused(nextCell, collectionView, previouslyIndexPath, nextIndexPath, context.focusHeading, programs: dataSource?.schedule)
        default: break
        }
        setDetails(program: dataSource?.schedule[nextIndexPath.row])
    }
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath: IndexPath) -> CGSize {
        if let schedules = dataSource?.schedule, !schedules.isEmpty {
            var startUTC: Date;
            if schedules[indexPath.row].modifiedStartUTC.isModified ?? false {
                startUTC = schedules[indexPath.row].modifiedStartUTC.value
            } else {
                startUTC = schedules[indexPath.row].startUTC.value
            }
            return CGSize(width: getTimeFormat(start: startUTC, end: schedules[indexPath.row].endUTC.value), height: 108)
        }
        return CGSize(width: 900, height: 108)
    }
    
    private func getTimeFormat(start: Date, end: Date) -> CGFloat {
        //let formatter = DateFormatter.utc
        let startDate = start//formatter.date(from: start) ?? Date()
        let endDate = end//formatter.date(from: end) ?? Date()
        let duration = endDate.timeIntervalSince1970 - startDate.timeIntervalSince1970
        let durationDate = Date(timeIntervalSince1970: duration)
        let durationFormatter = DateFormatter()
        let hour = Calendar.utc.component(.hour, from: durationDate)
        durationFormatter.dateFormat = hour == 0 ? "mm:ss" : "hh:mm:ss"
        durationFormatter.timeZone = TimeZone.utc
        let stringDuration = durationFormatter.string(from: durationDate)
        let intDuration = stringDuration.seconds
        let hours = (intDuration % 86400) / 3600
        let minutes = ((intDuration % 3600) / 60) + (hours * 60)
        return minutes < 0 ? 200 : CGFloat(minutes * 15)
    }
}

extension EPGChannelCell: EPGProgramsCellDelegate {
    func tapAction(program: Program?) {
        if program?.seasonID == nil, program?.programID == "" { return }
        delegate?.didSelect(program, dataSource?.channel.stationID ?? "", channel: dataSource)
    }
    
    func leftSwipe(_ cell: UICollectionViewCell, _ program: Program?) {
        if let index = dataSource?.schedule.firstIndex(where: { $0.programID == program?.programID && $0.startUTC.value == program?.startUTC.value}) {
            delegate?.leftSwipe(cell, collectionView, IndexPath(row: index, section: 0), IndexPath(row: index, section: 0), programs: dataSource?.schedule)
        }
    }
    
    func focused(_ cell: UICollectionViewCell, _ dataSource: Program?) {
        setDetails(program: dataSource)
    }
}

//extension UICollectionView {
//    func dequeueReusableCell<T: UICollectionViewCell>(for indexPath: IndexPath) -> T {
//        guard let cell = dequeueReusableCell(withReuseIdentifier: T.identifier, for: indexPath) as? T else {
//            fatalError("Could not find collection view cell with identifier \(T.identifier)")
//        }
//        return cell
//    }
//    
//    func dequeueReusableSupplementaryView<T: UICollectionReusableView>(ofKind kind: String, for indexPath: IndexPath) -> T {
//        guard let header = dequeueReusableSupplementaryView(ofKind: kind,
//                                                            withReuseIdentifier: T.identifier,
//                                                            for: indexPath) as? T
//            else {
//                fatalError("Could not find collection supplementary view with identifier \(T.identifier)")
//        }
//        return header
//    }
//    
//    func register<T: UICollectionViewCell>(cell: T.Type) {
//        register(T.nib, forCellWithReuseIdentifier: T.identifier)
//    }
//    
//    func scrollToFirst() {
//        if !visibleCells.isEmpty {
//            scrollToItem(at: IndexPath(row: 0, section: 0), at: .left, animated: true)
//        }
//    }
//    
//    func isFocused() -> Bool {
//        return visibleCells.first(where: { $0.isFocused })?.isFocused ?? false
//    }
//}

