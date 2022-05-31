import React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface IMultiSelectRef {
  open: () => void;
  close: () => void;
}

interface IProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>
  inputSearchStyle?: StyleProp<TextStyle>;
  selectedStyle?: StyleProp<ViewStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  maxHeight?: number;
  maxSelect?: number;
  fontFamily?: string;
  iconColor?: string
  activeColor?: string;
  data: any[];
  value?: any[] | null;
  placeholder?: string;
  labelField: string;
  valueField: string;
  search?: boolean;
  disable?: boolean;
  showsVerticalScrollIndicator?: boolean;
  searchPlaceholder?: string
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  flatListProps?: any;
  alwaysRenderItemSelected?: boolean;
  keyboardAvoiding?: boolean;
  inside?: boolean;
  onChange: (item: any) => void;
  renderLeftIcon?: () => React.ReactNode | null | undefined;
  renderRightIcon?: () => React.ReactNode | null | undefined;
  renderItem?: (item: any) => React.ReactNode | null | undefined;
  renderSelectedItem?: (item: any, unSelect?: (item: any) => void) => React.ReactNode | null | undefined;
  renderInputSearch?: (onSearch: (text:string) => void) => React.ReactNode | null | undefined;
  onFocus?:() => void;
  onBlur?:() => void;
  searchQuery?: (keyword: string, labelValue: string) => boolean;
};

export type MultiSelectProps = IProps;
