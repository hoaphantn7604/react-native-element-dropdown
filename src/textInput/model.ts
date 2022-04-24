import React from 'react';
import {
  ImageStyle,
  StyleProp,
  TextInputProps, 
  TextStyle,
  ViewStyle
} from 'react-native';

interface Props extends TextInputProps {
  fontFamily?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  showIcon?: boolean;
  renderRightIcon?: () => React.ReactNode | null | undefined;
  renderLeftIcon?: () => React.ReactNode | null | undefined;
}

export type CTextInput = React.FC<Props>
