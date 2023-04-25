//
//  PlayerView.swift
//  MKPlayerRefAppTVOS
//
//  Created by Karthik K on 21/11/21.
//

import SwiftUI
import MKPlayer

/// PlayerViewController that currently is in PIP mode.
var activePlayerViewControllerWithPIP: PlayViewController?
struct PlayerView: View {
    // Hanle to source config
    var sourceConfig: SourceConfig?
    var body: some View {
        //PlayerController(sourceConfig: sourceConfig)
           // .ignoresSafeArea()
            //.navigationBarTitle(SpecialCharacter.Empty)
    }
}

struct PlayerController: UIViewControllerRepresentable {
    var sourceConfig: SourceConfig?
    
    func makeUIViewController(context: Context) -> some PlayViewController {
        AppDataManager.shared.currentSourceConfig = sourceConfig
        let storyboard = UIStoryboard(name: "Player", bundle: Bundle.main)
        if  let playerViewController = storyboard.instantiateViewController(withIdentifier: "PlayViewController") as? PlayViewController {
            return playerViewController
        }
        
        return PlayViewController()
    }
    
    func updateUIViewController(_ uiViewController: UIViewControllerType, context: Context) {
    }
}
