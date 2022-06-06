//
//  NKSearchResultsViewController.m
//  TvTest-tvOS
//
//  Created by Sesha Singaraju on 10/11/2021.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "NKSearchResultsViewController.h"

@implementation NKSearchResultsViewController

- (instancetype)initWithReactViewController:(UIViewController *)reactViewController {
  if (self = [super init]) {
    _reactViewController = reactViewController;
    return self;
  }
  return nil;
}

- (void)viewDidLoad
{
  printf("View loaded.. setting frame");
  [super viewDidLoad];

  [self.view setFrame:CGRectMake(0, 0, 375, 44)];
  printf("SetFrame executed.. CGRect added");
  [self.view addSubview:self.reactViewController.view];
  printf("SubView also added");

}


@end
