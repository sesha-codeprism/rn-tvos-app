//
//  ChannelsListView.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 04/10/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import SwiftUI

struct ChannelsListView: View {
    @State var channelsData: [[String: AnyObject]]
    var body: some View {
        GeometryReader { geometry in
            LazyVStack(spacing: 5) {
                ForEach(0..<channelsData.count, id: \.self) { index in
                    let channel = channelsData[index]["channel"] as! [String: AnyObject]
                    ChannelView(channelNumber: channel["ChannelNumber"] as? Int ?? 0,
                                channelName: channel["CallLetters"] as? String ?? "Unknown")}
            }
//            .background(Color(UIColor.darkGray))
            .frame(width: 240, height: CGFloat(channelsData.count) * 95, alignment: .leading)
        }
    }
}

struct ChannelView: View {
    var channelNumber: Int
    var channelName: String
    
    var body: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [Color.black, Color(red: 64 / 255, green: 64 / 255, blue: 64 / 255)]), startPoint: .leading, endPoint: .trailing)
            Text("\(channelNumber) \(channelName)")
        }
        .foregroundColor(.white)
        .frame(width: 240, height: 90, alignment: .leading)
        .cornerRadius(10.0)
//        .background(Color(UIColor.darkGray))
    }
}

struct ChannelsListView_Previews: PreviewProvider {
    static var previews: some View {
        ChannelsListView(channelsData: [])
    }
}
