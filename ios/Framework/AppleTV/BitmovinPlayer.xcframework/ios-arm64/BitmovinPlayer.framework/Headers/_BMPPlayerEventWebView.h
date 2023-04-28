//
// Bitmovin Player iOS SDK
// Copyright (C) 2017, Bitmovin GmbH, All Rights Reserved
//
// This source code and its use and distribution, is subject to the terms
// and conditions of the applicable license agreement.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// :nodoc:
NS_SWIFT_NAME(_PlayerEventWebView)
@protocol _BMPPlayerEventWebView <NSObject>
@optional
- (NSString *)toWebPlayerStateUpdateJS;
@end

NS_ASSUME_NONNULL_END
