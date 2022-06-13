//
//  MKFullGuideViewController.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 04/10/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit
import SwiftUI

class MKFullGuideViewController: UIViewController, UIScrollViewDelegate {

    @IBOutlet weak var channelsContainerView: UIView!
    @IBOutlet weak var programsContainerView: UIView!
    @IBOutlet weak var channelsScrollView: UIScrollView!
    @IBOutlet weak var programsScrollView: UIScrollView!
    @IBOutlet weak var programsScrollViewWidth: NSLayoutConstraint!
    
    @IBOutlet weak var channelsScrollViewHeight: NSLayoutConstraint!
    @IBOutlet weak var programsScrollViewHeight: NSLayoutConstraint!
    
//    @IBSegueAction func loadChannelView(_ coder: NSCoder) -> UIViewController? {
//        return UIHostingController(coder: coder, rootView: ChannelsListView(numberOfChannels: 100))
//    }
//    @IBSegueAction func loadProgramsView(_ coder: NSCoder) -> UIViewController? {
//        return UIHostingController(coder: coder, rootView: ProgramsSwiftUIView(numberOfPrograms: 15, numberOfChannels: 100))
//    }
    
    var lastChannelFromOnNow: LiveChannel?

    override func viewDidLoad() {
        print("Time 2: \(Date())")
        super.viewDidLoad()
        self.programsScrollView.delegate = self
        self.channelsScrollView.delegate = self
        self.programsScrollViewWidth.constant = CGFloat(405 * 100)
        self.programsScrollView
        self.channelsScrollViewHeight.constant = CGFloat(95 * 100)
//        self.programsScrollViewHeight.constant = CGFloat(95 * 100)
        self.view.updateConstraints()
        
        if let url = Bundle.main.url(forResource: "EditedData", withExtension: "json") {
            do {
                let data = try Data(contentsOf: url)
                    if let jsonArray = try JSONSerialization
                        .jsonObject(with: data, options: []) as? [[String: AnyObject]] {
                        
                        // Do any additional setup after loading the view.
                        let swiftChannelsView = UIHostingController(rootView: ChannelsListView(channelsData: jsonArray))
                        addChild(swiftChannelsView)
                        swiftChannelsView.view.frame = self.channelsScrollView.bounds
                        self.channelsScrollView.addSubview(swiftChannelsView.view)
                        swiftChannelsView.didMove(toParent: self)

                        let swiftProgramsView = UIHostingController(rootView: ProgramsSwiftUIView(channelsData: jsonArray))
                        addChild(swiftProgramsView)
                        swiftProgramsView.view.frame = self.programsContainerView.bounds
                        self.programsContainerView.addSubview(swiftProgramsView.view)
                        swiftProgramsView.didMove(toParent: self)
                        
                        for ch in jsonArray {
                            let schedule = ch["schedule"] as! [[String: AnyObject]]
                            print("DPCount: \(schedule.count)")
                        }
                    } else {
                        /* ... */
                    }
            }
            catch let error as NSError {
                print(error)
            }
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

    func scrollViewDidScroll(_ scrollView: UIScrollView) {
//        print("Scrolling in progress")
        if scrollView == self.programsScrollView {
                    self.syncScrollView(self.channelsScrollView, toScrollView: self.programsScrollView)
                } else if scrollView == self.channelsScrollView {
                    self.syncScrollView(self.programsScrollView, toScrollView: self.channelsScrollView)
                }
    }
    
    func synchronizeScrollView(_ scrollViewToScroll: UIScrollView, toScrollView scrolledView: UIScrollView) {
            var offset = scrollViewToScroll.contentOffset
            offset.y = scrolledView.contentOffset.y

            scrollViewToScroll.setContentOffset(offset, animated: false)
    }
    
    func syncScrollView(_ scrollViewToScroll: UIScrollView, toScrollView scrolledView: UIScrollView) {
            var scrollBounds = scrollViewToScroll.bounds
            scrollBounds.origin.y = scrolledView.contentOffset.y
            scrollViewToScroll.bounds = scrollBounds
    }
}
