import { Platform, PixelRatio, Dimensions } from 'react-native';
import { UseScale, UseDetectDevice } from './type';

const { width, height } = Dimensions.get('window');

const useScale: UseScale = {
    fontScale: (number: number = 1) => {
       return number;
    },
    scale: (number: number = 1) => {
      return number;
    },
};

const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
  }
};

const useDetectDevice: UseDetectDevice = {
    isAndroid: Platform.OS === 'android',
    isIOS: Platform.OS === 'ios',
    isTablet: isTablet()
}

export { useScale, useDetectDevice };
