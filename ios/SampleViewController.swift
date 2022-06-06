//
//  SampleViewController.swift
//  RetailClient
//
//  Created by Deepak Pagadala on 13/12/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import UIKit

class SampleViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
  
  @IBOutlet var sampleView: UIView!
  @IBOutlet weak var tableView: UITableView!
  @IBOutlet weak var sampleLable: UILabel!
  override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
//    sampleLable.text = "Full guide UIKit"
    self.tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
    self.tableView.delegate = self
    self.tableView.dataSource = self
    }


    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
  func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
    return 10
  }
  
  
  func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
    // create a new cell if needed or reuse an old one
    let cell:UITableViewCell = self.tableView.dequeueReusableCell(withIdentifier: "cell")!
            
            // set the text from the data model
//            cell.textLabel?.text = self.animals[indexPath.row]
            
            return cell
  }
}
