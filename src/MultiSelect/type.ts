import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface Props {
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    placeholderStyle?: StyleProp<TextStyle>
    textErrorStyle?: StyleProp<TextStyle>;
    inputSearchStyle?: StyleProp<TextStyle>; 
    selectedStyle?: StyleProp<ViewStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
    maxHeight?: number;
    fontFamily?: string; 
    iconColor?: string
    activeColor?: string
    data: any[];
    value?: any | null;
    textError?: string;
    label?: string;
    placeholder?: string;
    labelField: string;
    valueField: string;
    search?: boolean;
    searchPlaceholder?: string
    onChange: (item: any) => void;
    renderLeftIcon?: () => JSX.Element | null | undefined;
    renderRightIcon?: () => JSX.Element | null | undefined;
    renderItem?: (item: any) => JSX.Element | null | undefined;
  }

  export type MultiSelect = React.FC<Props>
