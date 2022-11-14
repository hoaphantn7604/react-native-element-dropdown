import { Platform, PixelRatio, Dimensions } from 'react-native';
import type { IUseDetectDevice } from './model';

const { width, height } = Dimensions.get('window');

const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1824 || adjustedHeight >= 1824)
    );
  }
};

const useDetectDevice: IUseDetectDevice = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  isTablet: isTablet(),
};

export { useDetectDevice };
