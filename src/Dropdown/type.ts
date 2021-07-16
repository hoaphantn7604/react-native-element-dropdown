import { StyleProp, TextStyle, ViewStyle, TextProps } from 'react-native';

interface Props {
    style?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    placeholderStyle?: StyleProp<TextStyle>;
    selectedTextStyle?: StyleProp<TextStyle>;
    selectedTextProps?: TextProps;
    inputSearchStyle?: StyleProp<TextStyle>;
    maxHeight?: number;
    fontFamily?: string;
    iconColor?: string;
    activeColor?: string;
    data: any[];
    value?: any | null;
    placeholder?: string;
    labelField: string;
    valueField: string;
    search?: boolean;
    searchPlaceholder?: string;
    disable?: boolean;
    onChange: (item: any) => void;
    renderLeftIcon?: () => JSX.Element | null | undefined;
    renderRightIcon?: () => JSX.Element | null | undefined;
    renderItem?: (item: any) => JSX.Element | null | undefined;
  }

  export type Dropdown = React.FC<Props>
