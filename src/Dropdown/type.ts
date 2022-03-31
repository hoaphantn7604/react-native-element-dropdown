import {
  StyleProp,
  TextStyle,
  ViewStyle,
  TextProps,
  ImageStyle,
} from "react-native";

export interface IProps {
  readonly style?: StyleProp<ViewStyle>;
  readonly containerStyle?: StyleProp<ViewStyle>;
  readonly placeholderStyle?: StyleProp<TextStyle>;
  readonly selectedTextStyle?: StyleProp<TextStyle>;
  readonly selectedTextProps?: TextProps;
  readonly inputSearchStyle?: StyleProp<TextStyle>;
  readonly iconStyle?: StyleProp<ImageStyle>;
  readonly maxHeight?: number;
  readonly fontFamily?: string;
  readonly iconColor?: string;
  readonly activeColor?: string;
  readonly data: any[];
  readonly value?: any | null;
  readonly placeholder?: string;
  readonly labelField: string;
  readonly valueField: string;
  readonly search?: boolean;
  readonly searchPlaceholder?: string;
  readonly disable?: boolean;
  readonly autoScroll?: boolean;
  readonly showsVerticalScrollIndicator?: boolean;
  readonly dropdownPosition?: "auto" | "top" | "bottom";
  readonly flatListProps?: any;
  readonly keyboardAvoiding?: boolean;
  readonly onChange: (item: any) => void;
  readonly renderLeftIcon?: () => JSX.Element | null | undefined;
  readonly renderRightIcon?: () => JSX.Element | null | undefined;
  readonly renderItem?: (item: any) => JSX.Element | null | undefined;
  readonly renderInputSearch?: (
    onSearch: (text: string) => void
  ) => JSX.Element | null | undefined;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly searchQuery?: (keyword: string, labelValue: string) => boolean;
}

export type DropdownProps = IProps;
