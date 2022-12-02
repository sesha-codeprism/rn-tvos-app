#import "SearchControllerView.h"
#import <React/UIView+React.h>

@implementation SearchControllerView
{
    UIViewController *uiViewController;
    UISearchController *uiSearchController;
    UISearchContainerViewController *uiSearchContainerController;
  
}



- (void)layoutSubviews
{
    if(uiSearchContainerController == nil) {
        [self embedSearchController];
    }
}

- (void)didMoveToSuperview
{
    if(self.superview == nil) {
        [self removeSearchController];
    }
}

- (void)embedSearchController
{
  NSLog(@"BackgroundColor: %@",self.backgroundColor);
  NSLog(@"width: %@",self.width);
  NSLog(@"height: %@",self.height);
  
  UIViewController *parentVC = self.reactViewController;
    
    if(parentVC == nil) {
        return;
    }
  uiViewController = [[UIViewController alloc] init];
  uiSearchController = [[UISearchController alloc] init ];
  uiSearchController.view.frame = CGRectMake(0, 0, [self.width doubleValue], [self.height doubleValue]);
  uiSearchContainerController = [[UISearchContainerViewController alloc] initWithSearchController:uiSearchController];
  uiSearchController.view.backgroundColor = self.backgroundColor;
  uiSearchController.searchBar.searchBarStyle = UISearchBarStyleProminent;
  [uiSearchController setObscuresBackgroundDuringPresentation:true];
  uiSearchController.hidesNavigationBarDuringPresentation = false;
  uiSearchController.obscuresBackgroundDuringPresentation = false;
  
//  [uiViewController setView:parentVC.view];


    
    [parentVC addChildViewController:uiSearchContainerController];
    [self addSubview:uiSearchContainerController.view];
    [uiSearchContainerController didMoveToParentViewController:parentVC];
    UIView *rootView = parentVC.view.window.rootViewController.view;
    for (UIGestureRecognizer *recognizer in rootView.gestureRecognizers) {
      if ([recognizer.allowedPressTypes containsObject:@(UIPressTypeSelect)] && [recognizer isKindOfClass:[UITapGestureRecognizer class]]) {
        [recognizer.view removeGestureRecognizer:recognizer];
      }
    }
}

-(void)removeSearchController
{
    if(uiSearchController == nil || uiSearchContainerController == nil) {
        return;
    }
    
    [uiSearchContainerController willMoveToParentViewController:nil];
    [uiSearchContainerController.view removeFromSuperview];
    [uiSearchContainerController removeFromParentViewController];
    uiSearchContainerController = nil;
    
    [uiSearchController willMoveToParentViewController:nil];
    [uiSearchController.view removeFromSuperview];
    [uiSearchController removeFromParentViewController];
    uiSearchController = nil;
}

- (void)updateSearchResultsForSearchController:(nonnull UISearchController *)searchController
{
  if (self.onChangeText) {
    self.onChangeText(@{@"text": searchController.searchBar.text});
  }
}


@end
