//
//  LogoViewController.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit
//import SnapKit

class LogoViewController: BaseScreenViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
//        addLogo()
    }
    
//    private func addLogo() {
//        let imageView = UIImageView()
//        imageView.contentMode = .scaleAspectFit
//        imageView.image = UIImage.logo
//        imageView.translatesAutoresizingMaskIntoConstraints = false
//        view.addSubview(imageView)
//
//        imageView.snp.makeConstraints { make in
//            //            make.width.equalTo(200)
//            //            make.height.equalTo(55)
//            make.top.equalTo(view.snp.top).inset(30)
//            make.right.equalTo(view.snp.right).inset(80)
//        }
//    }
}

extension LogoViewController {
    // this is added to hide the logo from any screen if its not needed
//    func hideLogo() {
//        self.view.subviews.forEach({view in
//            if view.isKind(of: UIImageView.self) {
//                view.isHidden = true
//            }
//        })
//    }
}
