//
//  NKSearchBar.h
//  TvTest-tvOS
//
//  Created by Sesha Singaraju on 10/11/2021.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>

@interface NKSearchComponent : UIView

@property UISearchContainerViewController *containerVC;

@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;


@end
