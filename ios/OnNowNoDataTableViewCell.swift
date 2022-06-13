//
//  OnNowNoDataTableViewCell.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class OnNowNoDataTableViewCell: BaseTableViewCell {

    @IBOutlet weak var noResultFound: UILabelFontable!
  var dataSource: Int = 0
    override func awakeFromNib() {
        super.awakeFromNib()
        noResultFound.text = "No Channels Loaded"
    }

}
