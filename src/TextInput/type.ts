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
  renderRightIcon?: () => JSX.Element | null | undefined;
  renderLeftIcon?: () => JSX.Element | null | undefined;
}

export type CTextInput = React.FC<Props>
