//
//  GuideViewBridge.m
//  RetailClient
//
//  Created by Prathibha Sundresh on 01/12/22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MKGuideBridgeManager, NSObject)
RCT_EXTERN_METHOD(getCurrentSlots: (BOOL)useCache callback:(RCTResponseSenderBlock)callback)
@end
