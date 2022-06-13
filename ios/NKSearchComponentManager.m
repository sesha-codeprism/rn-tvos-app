//
//  NKSearchBarManager.m
//  TvTest-tvOS
//
//  Created by Sesha Singaraju on 10/11/2021.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NKSearchComponentManager.h"
#import "NKSearchComponent.h"

@implementation NKSearchComponentManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)

- (UIView *)view
{
  NKSearchComponent *searchView = [[NKSearchComponent alloc] init];
//  return [[NKSearchComponenssst alloc] init];
  return  searchView;
}

@end
