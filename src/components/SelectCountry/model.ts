import type { ImageStyle } from 'react-native';
import type { DropdownProps } from '../Dropdown/model';

export interface SelectCountryProps<T> extends DropdownProps<T> {
  imageField: string;
  imageStyle?: ImageStyle;
}
