#import "MKGuide.h"
#import <React/RCTLog.h>


@interface RCT_EXTERN_MODULE(MKGuideManager, RCTViewManager)
- (BOOL)requiresMainQueueSetup
{
    return NO;
}
RCT_EXPORT_VIEW_PROPERTY(guideParams, NSDictionary*)
RCT_EXTERN_METHOD(initiateFullGuideWith:(NSString *)Token)
RCT_EXPORT_VIEW_PROPERTY(onUpdate, RCTBubblingEventBlock)

@end
