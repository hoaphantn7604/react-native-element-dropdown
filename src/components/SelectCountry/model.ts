import type { ImageStyle } from 'react-native';
import type { DropdownProps } from '../Dropdown/model';

export interface SelectCountryProps extends DropdownProps {
  testID?: string;
  itemTestIDField?: string;
  imageField: string;
  imageStyle?: ImageStyle;
}
