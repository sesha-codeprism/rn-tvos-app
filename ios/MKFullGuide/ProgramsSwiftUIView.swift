//
//  ProgramsSwiftUIView.swift
//  ESR_AppleTV
//
//  Created by Deepak Pagadala on 05/10/21.
//  Copyright © 2021 MediaKind. All rights reserved.
//

import SwiftUI

struct ProgramsSwiftUIView: View {
    @State var channelsData: [[String: AnyObject]]
    @State var numberOfPrograms: Int = 15

    var body: some View {
        GeometryReader { geometry in
            LazyVStack(alignment: .leading, spacing: 5) {
                ForEach(0..<channelsData.count, id: \.self) { index in
                    let channel = channelsData[index]
                    if let schedule = channel["schedule"] as? [[String: AnyObject]] {
                        LazyHStack(spacing: 0){
                            ForEach(0..<schedule.count, id: \.self) { progIndex in
                                if let program = schedule[progIndex] as? [String: AnyObject] {
                                    ProgView(data: program)
                                }
                            }
                        }
                    }
                }
            }
            .opacity(0.8)
            .frame(height: 100 * 95, alignment: .leading)
            .cornerRadius(10)
        }
    }
}

struct ProgramsSwiftUIView_Previews: PreviewProvider {
    static var previews: some View {
        ProgramsSwiftUIView(channelsData: [[:]])
    }
}

struct DetailsView: View {
    var body: some View {
        Text("details View")
            .frame(width: 250, height: 250, alignment: .center)
    }
}

struct LazyHStackView: View {
    var array2D = [[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4], [1,2,3], [1,2,3,4,5],[1,2,3,4]];
    
    let channelData = Array(1...5)
    let programData = Array(1...20)

    var body: some View {
//        ScrollView([.vertical, .horizontal], showsIndicators: false) {
//            VStack(alignment: .leading, spacing: 5) {
                ForEach(array2D, id: \.self) { channel in
                    LazyHStack(spacing: 5) {
                        ForEach(channel, id: \.self) { prog in
//                            ProgramView(data: prog)
                            Text("Program \(prog)")
                        }
                    }
                    .frame(height: 60, alignment: .center)
                    .background(Color.black)
                }
//            }
        .frame(alignment: .leading)
    }
}

struct ProgramView: View {
    
    let data: Int
    var body: some View {
        Button(action: {
            print("Button for \(data) clicked")
        }) {
            Text("Channel \(data)")
                .frame(width: 200, height: 50, alignment: .leading)
                .foregroundColor(.white)
                .cornerRadius(10)
        }
        .background(RoundedRectangle(cornerRadius: 10)
                        .stroke(lineWidth: 5)
                        .background(Color.gray)
                        .foregroundColor(.blue)
                        )
    }
}

struct ProgView: View {
    @State var isFocused: Bool = false

    let data: [String: AnyObject]
    var body: some View {
        ZStack {
            Rectangle()
                .frame(width: getWidth(), height: 90)
            ZStack {
                Text("\(data["Name"] as? String ?? "Unknown")")
            }
            .frame(width: getWidth()-5, height: 90, alignment: .center)
//            .background(isFocused ? Color.blue : Color.gray)
            .focusable(true) { focused in
                self.isFocused = focused ? true : false
            }
            .background(isFocused ? Color(UIColor.systemBlue) : Color(red: 64 / 255, green: 64 / 255, blue: 64 / 255))
            .foregroundColor(isFocused ? .white : Color(UIColor.gray))
//            .overlay(Rectangle().frame(width: 5, height: nil, alignment: .trailing).foregroundColor(Color.black), alignment: .trailing)
            .cornerRadius(5.0)
        }
    }
    
    func getWidth() -> CGFloat {
        let startTime = self.getDate(dateString: data["StartUtc"] as? String ?? "")
        let endTime =  self.getDate(dateString: data["EndUtc"] as? String ?? "")
        
        let diffMin = minutesBetweenDates(startUTC: startTime, endUtc: endTime)
        return diffMin * 10
    }
    
    func getDate(dateString: String) -> Date{
        let dateFormatter = DateFormatter()
        dateFormatter.locale = Locale(identifier: "en_US_POSIX") // set locale to reliable US_POSIX
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZ"
        let date = dateFormatter.date(from:dateString)!
        return date
    }
    
    func minutesBetweenDates(startUTC: Date, endUtc: Date) -> CGFloat {

        //get both times sinces refrenced date and divide by 60 to get minutes
        let startMinutes = startUTC.timeIntervalSinceReferenceDate/60
        let endMinutes = endUtc.timeIntervalSinceReferenceDate/60

        //then return the difference
        return CGFloat(endMinutes - startMinutes)
    }
}
