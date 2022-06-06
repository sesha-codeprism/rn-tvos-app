#import <UIKit/UIKit.h>
#import <React/RCTComponent.h>


@interface SearchControllerView : UIView

@property UISearchContainerViewController *containerVC;

@property (nonatomic, copy) RCTBubblingEventBlock onChangeText;
@property (nonatomic, copy) UIColor *backgroundColor;
@property (nonatomic, copy) NSNumber *width;
@property (nonatomic, copy) NSNumber *height;

@end
