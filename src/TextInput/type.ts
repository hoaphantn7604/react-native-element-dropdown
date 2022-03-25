import React from "react";
import {
  ImageStyle,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

interface Props extends TextInputProps {
  readonly fontFamily?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly inputStyle?: StyleProp<TextStyle>;
  readonly iconStyle?: StyleProp<ImageStyle>;
  readonly showIcon?: boolean;
  readonly renderRightIcon?: () => JSX.Element | null | undefined;
  readonly renderLeftIcon?: () => JSX.Element | null | undefined;
}

export type CTextInput = React.FC<Props>;
