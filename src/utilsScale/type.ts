export interface UseScale {
    fontScale: (number: number) => number;
    scale:  (number: number) => number;
}

export interface UseDetectDevice {  
    isAndroid: boolean;
    isIOS: boolean;
    isTablet: boolean;
}