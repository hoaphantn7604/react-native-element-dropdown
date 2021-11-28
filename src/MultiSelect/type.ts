import React from 'react';
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface IProps {
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholderStyle?: StyleProp<TextStyle>
  inputSearchStyle?: StyleProp<TextStyle>;
  selectedStyle?: StyleProp<ViewStyle>;
  selectedTextStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  maxHeight?: number;
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
  onChange: (item: any) => void;
  renderLeftIcon?: () => JSX.Element | null | undefined;
  renderRightIcon?: () => JSX.Element | null | undefined;
  renderItem?: (item: any) => JSX.Element | null | undefined;
  renderSelectedItem?: (item: any, unSelect?: () => void) => JSX.Element | null | undefined;
  renderInputSearch?: (onSearch: (text:string) => void) => JSX.Element | null | undefined;
  onFocus?:() => void;
  onBlur?:() => void;
};

export type MultiSelectProps = IProps;
