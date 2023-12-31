//
// Bitmovin Player iOS SDK
// Copyright (C) 2019, Bitmovin GmbH, All Rights Reserved
//
// This source code and its use and distribution, is subject to the terms
// and conditions of the applicable license agreement.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVPlayerItem.h>

@class _BMPAVPlayerItem;

NS_ASSUME_NONNULL_BEGIN

NS_SWIFT_NAME(_AVPlayerItemListener)
@protocol _BMPAVPlayerItemListener <NSObject>
@optional
- (void)playerItem:(_BMPAVPlayerItem *)playerItem willChangeMediaOptionFrom:(nullable AVMediaSelectionOption *)from to:(nullable AVMediaSelectionOption *)to inMediaSelectionGroup:(AVMediaSelectionGroup *)mediaSelectionGroup;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeMediaOptionFrom:(nullable AVMediaSelectionOption *)from to:(nullable AVMediaSelectionOption *)to inMediaSelectionGroup:(AVMediaSelectionGroup *)mediaSelectionGroup;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeStatus:(AVPlayerItemStatus)oldStatus newStatus:(AVPlayerItemStatus)newStatus;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeDuration:(CMTime)oldDuration newDuration:(CMTime)newDuration;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangePlaybackBufferEmpty:(BOOL)playbackBufferEmpty;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangePlaybackLikelyToKeepUp:(BOOL)playbackLikelyToKeepUp;
- (void)playerItemDidPlayToEnd:(_BMPAVPlayerItem *)playerItem NS_SWIFT_NAME(playerItemDidPlayToEnd(playerItem:));
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didFailToPlayToEnd:(nullable NSError *)error;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeTimedMetadata:(NSArray<AVMetadataItem *> *)timedMetadata;
- (void)playerItemDidReceiveNewAccessLogEntry:(_BMPAVPlayerItem *)playerItem;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem willSeekToTargetTime:(CMTime)seekTarget;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem willSeekToTargetDate:(NSDate *)seekTarget;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didSeekWithSuccess:(BOOL)finished;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeLoadedTimeRanges:(NSArray<NSValue *> *)loadedTimeRanges;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangeSeekableTimeRanges:(NSArray<NSValue *> *)seekableTimeRanges;
- (void)playerItem:(_BMPAVPlayerItem *)playerItem didChangePresentationSize:(CGSize)oldPresentationSize newPresentationSize:(CGSize)newPresentationSize;
@end

NS_ASSUME_NONNULL_END
