// ElementDropdown.m

#import "ElementDropdown.h"


@implementation ElementDropdown

RCT_EXPORT_MODULE()

- (NSDictionary *)constantsToExport
{
    return @{ 
        @"checkTablet": @([self isTablet]),
        @"checkSmallDevice": @([self isSmallDevice]),
        @"deviceInch": @([self deviceInch]),
    };
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (BOOL) isTablet
{
    // TODO: Implement some actually useful functionality
    if ( UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad )
    {
        return YES; /* Device is iPad */
    }else{
        return NO;
    }
    
}

- (BOOL) isSmallDevice
{
    float diagonal = [self deviceInch];

    if(diagonal < 4.8){
        return YES;
    }else{
        return NO;
    }
}

- (float) deviceInch
{
    float scale = [[UIScreen mainScreen] scale];
    
    NSInteger width = [[UIScreen mainScreen] bounds].size.width;
    NSInteger height = [[UIScreen mainScreen] bounds].size.height;

    NSInteger screenHeight = MAX(width, height);

    switch (screenHeight) {
        case 240:
            return 3.5;
        case 480:
            return 3.5;
        case 568:
            return 4;
        case 667:
            return scale == 3.0 ? 5.5 : 4.7;
        case 736:
            return 5.5;
        case 812:
            return 5.4;
        case 844:
            return 6.1;
        case 896:
            return 6.5;
        case 926:
            return 6.7;
        case 1024:
            return 9.7;
        case 1080:
            return 10.2;
        case 1112:
            return 10.5;
        case 1180:
            return 10.9;
        case 1194:
            return 11;
        case 1366:
            return 12.9;
        default:
            return 0;
    }
}

@end
