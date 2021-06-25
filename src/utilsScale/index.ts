import { NativeModules, Platform } from 'react-native';
import { UseScale, UseDetectDevice } from './type';

const { ElementDropdown } = NativeModules;
const { 
    checkSmallDevice,
    checkTablet,
    deviceInch
} = ElementDropdown.getConstants();

const useScale: UseScale = {
    fontScale: (number: number = 1) => {
        const value = (deviceInch + (checkSmallDevice || checkTablet ? 2 : 3)) / 10;
        const scale = number * Number(value.toFixed(1));
        return scale;
    },
    scale: (number: number = 1) => {
        const value = (deviceInch + (checkSmallDevice || checkTablet ? 3 : 4)) / 10;
        const scale = number * Number(value.toFixed(1));
        return scale;
    },
};

const useDetectDevice: UseDetectDevice = {
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isTablet: checkTablet
}

export { useScale, useDetectDevice };
