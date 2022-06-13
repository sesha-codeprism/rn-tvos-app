//
//  NKSearchResultsViewController.h
//  TvTest-tvOS
//
//  Created by Sesha Singaraju on 10/11/2021.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface NKSearchResultsViewController : UIViewController

- (instancetype)initWithReactViewController:(UIViewController *)reactViewController;

@property UIViewController *reactViewController;

@end
