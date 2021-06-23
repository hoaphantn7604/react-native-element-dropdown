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
  labelStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  textErrorStyle?: StyleProp<TextStyle>;
  textError?: string;
  label?: string;
  showIcon?: boolean;
  currency?: boolean;
  numeric?: boolean;
  unitCurrency?: string;
  renderRightIcon?: () => JSX.Element | null | undefined;
  renderLeftIcon?: () => JSX.Element | null | undefined;
}

export type CTextInput = React.FC<Props>
