//
//  MKGuideBridgeManager.m
//  RetailClient
//
//  Created by Prathibha Sundresh on 04/01/23.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MKGuideBridgeManager, NSObject)
RCT_EXTERN_METHOD(getCurrentSlots: (BOOL)useCache callback:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(updateSlotsOnTime)
RCT_EXTERN_METHOD(setChannelmapId:(int)value)
RCT_EXTERN_METHOD(getChannelMapInfo:(RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(setEnvironment:(NSString)value)
RCT_EXTERN_METHOD(setToken:(NSString)value)
RCT_EXTERN_METHOD(setRefreshToken:(NSString)value)
@end
