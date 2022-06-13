
#import "RNSearchControllerViewManager.h"
#import "SearchControllerView.h"

@implementation RNSearchControllerViewManager

RCT_EXPORT_VIEW_PROPERTY(backgroundColor, UIColor);
RCT_EXPORT_VIEW_PROPERTY(width, NSNumber);
RCT_EXPORT_VIEW_PROPERTY(height, NSNumber);

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTBubblingEventBlock)


- (UIView *)view
{
    SearchControllerView *searchView = [[SearchControllerView alloc] init];
    return searchView;
}

@end

