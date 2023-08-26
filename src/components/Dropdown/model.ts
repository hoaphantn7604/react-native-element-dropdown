import type {
  StyleProp,
  TextStyle,
  ViewStyle,
  TextProps,
  ImageStyle,
  FlatListProps,
} from 'react-native';

export type IDropdownRef = {
  open: () => void;
  close: () => void;
};

export interface DropdownProps<T> {
  ref?:
    | React.RefObject<IDropdownRef>
    | React.MutableRefObject<IDropdownRef>
    | null
    | undefined;
  testID?: string;
  itemTestIDField?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  selectedTextProps?: TextProps;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  inputSearchStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  maxHeight?: number;
  minHeight?: number;
  fontFamily?: string;
  iconColor?: string;
  activeColor?: string;
  data: T[];
  value?: T | string | null | undefined;
  placeholder?: string;
  labelField: keyof T;
  valueField: keyof T;
  searchField?: keyof T;
  search?: boolean;
  searchPlaceholder?: string;
  disable?: boolean;
  autoScroll?: boolean;
  showsVerticalScrollIndicator?: boolean;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  flatListProps?: Omit<FlatListProps<any>, 'renderItem' | 'data'>;
  keyboardAvoiding?: boolean;
  backgroundColor?: string;
  confirmSelectItem?: boolean;
  accessibilityLabel?: string;
  itemAccessibilityLabelField?: string;
  inverted?: boolean;
  mode?: 'default' | 'modal' | 'auto';
  onChange: (item: T) => void;
  renderLeftIcon?: (visible?: boolean) => JSX.Element | null | undefined;
  renderRightIcon?: (visible?: boolean) => JSX.Element | null | undefined;
  renderItem?: (item: T, selected?: boolean) => JSX.Element | null | undefined;
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => JSX.Element | null | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  onChangeText?: (search: string) => void;
  onConfirmSelectItem?: (item: T) => void;
}
