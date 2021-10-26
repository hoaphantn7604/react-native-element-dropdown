import React from 'react';
import { StyleProp, TextStyle, ViewStyle, TextProps } from 'react-native';

export interface PropsDropdown {
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
  autoScroll?: boolean;
  showsVerticalScrollIndicator?: boolean;
  dropdownPosition?: 'auto' | 'top' | 'bottom';
  onChange: (item: any) => void;
  renderLeftIcon?: () => JSX.Element | null | undefined;
  renderRightIcon?: () => JSX.Element | null | undefined;
  renderItem?: (item: any) => JSX.Element | null | undefined;
  renderInputSearch?: (onSearch: (text:string) => void) => JSX.Element | null | undefined;
  onFocus?: () => void;
  onBlur?: () => void;

};

export type DropdownProps = React.FC<PropsDropdown>;
