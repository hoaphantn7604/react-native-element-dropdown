import type {
  FlatListProps,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface IMultiSelectRef {
  open: () => void;
  close: () => void;
}

export interface MultiSelectProps<T> {
  testID?: string;
  itemTestIDField?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  inputSearchStyle?: StyleProp<TextStyle>;
  selectedStyle?: StyleProp<ViewStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  itemContainerStyle?: StyleProp<ViewStyle>;
  itemTextStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  maxHeight?: number;
  maxSelect?: number;
  fontFamily?: string;
  iconColor?: string;
  activeColor?: string;
  data: T[];
  value?: string[] | null | undefined;
  placeholder?: string;
  labelField: string;
  valueField: string;
  search?: boolean;
  disable?: boolean;
  showsVerticalScrollIndicator?: boolean;
  searchPlaceholder?: string;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  flatListProps?: Omit<FlatListProps<any>, 'renderItem' | 'data'>;
  alwaysRenderSelectedItem?: boolean;
  visibleSelectedItem?: boolean;
  keyboardAvoiding?: boolean;
  inside?: boolean;
  statusBarIsTranslucent?: boolean;
  backgroundColor?: string;
  confirmSelectItem?: boolean;
  confirmUnSelectItem?: boolean;
  accessibilityLabel?: string;
  itemAccessibilityLabelField?: string;
  onChange: (value: string[]) => void;
  renderLeftIcon?: () => JSX.Element | null | undefined;
  renderRightIcon?: () => JSX.Element | null | undefined;
  renderItem?: (item: T, selected?: boolean) => JSX.Element | null | undefined;
  renderSelectedItem?: (
    item: T,
    unSelect?: (item: T) => void
  ) => JSX.Element | null | undefined;
  renderInputSearch?: (
    onSearch: (text: string) => void
  ) => JSX.Element | null | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
  onChangeText?: (search: string) => void;
  onConfirmSelectItem?: (item: any) => void;
}
