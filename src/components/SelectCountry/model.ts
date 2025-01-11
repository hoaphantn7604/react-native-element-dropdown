import type { ImageStyle } from 'react-native';
import type { DropdownProps } from '../Dropdown/model';

export type ISelectCountryRef = {
  open: () => void;
  close: () => void;
};

export interface SelectCountryProps<T> extends DropdownProps<T> {
  imageField: string;
  imageStyle?: ImageStyle;
}
