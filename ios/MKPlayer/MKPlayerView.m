//
//  MKPlayerView.m
//  RetailClient
//
//  Created by Priyank Saxena on 09/02/23.
//
#import "MKPlayerView.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(MKPlayerManager, RCTViewManager)
- (BOOL)requiresMainQueueSetup
{
    return NO;
}
RCT_EXPORT_VIEW_PROPERTY(playerConfig, NSDictionary*)
RCT_EXPORT_VIEW_PROPERTY(onExit, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSubtitlePressed, RCTBubblingEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBitratePressed, RCTBubblingEventBlock)


@end
