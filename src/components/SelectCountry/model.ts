import { ImageStyle } from 'react-native';
import { IProps } from "../Dropdown/model";

export interface IMultiSelectRef {
    open: () => void;
    close: () => void;
  }

interface Props extends IProps {
    imageField: string;
    imageStyle?: ImageStyle;
}

export type SelectCountryProps = Props;