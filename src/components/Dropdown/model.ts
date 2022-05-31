import React from 'react';
import { StyleProp, TextStyle, ViewStyle, TextProps, ImageStyle } from 'react-native';

export interface IDropdownRef {
  open: () => void;
  close: () => void;
}

export interface IProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  selectedTextProps?: TextProps;
  inputSearchStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
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
  autoScroll?: boolean;
  showsVerticalScrollIndicator?: boolean;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  flatListProps?: any;
  keyboardAvoiding?: boolean;
  onChange: (item: any) => void;
  renderLeftIcon?: () => React.ReactNode | null | undefined;
  renderRightIcon?: () => React.ReactNode | null | undefined;
  renderItem?: (item: any) => React.ReactNode | null | undefined;
  renderInputSearch?: (onSearch: (text: string) => void) => React.ReactNode | null | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
};

export type DropdownProps = IProps;
