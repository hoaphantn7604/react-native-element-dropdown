import React, { useMemo } from 'react';
import { Image, View, Text, ImageStyle } from 'react-native';
import { Dropdown } from '../../index';
import { PropsDropdown } from '../Dropdown/type';
import { styles } from './styles';

interface Props extends PropsDropdown {
  imageField: string;
  imageStyle?: ImageStyle;
}

const CountrySelectConponent: React.FC<Props> = props => {
  const { data, value, valueField, labelField, imageField, selectedTextStyle, imageStyle } = props;
  const _renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Image source={item[imageField]} style={[styles.image, imageStyle]} />
        <Text style={[styles.selectedTextStyle ,selectedTextStyle]}>
          {item[labelField]}
        </Text>
      </View>
    );
  };

  const selectItem = useMemo(() => {
    const index = data.findIndex(e => e[valueField] === value);
    return data[index];
  }, [value, data]);

  return (
    <Dropdown
      {...props}
      renderItem={_renderItem}
      renderLeftIcon={() => {
        if (selectItem?.image) {
          return <Image source={selectItem.image} style={[styles.image, imageStyle]} />;
        } else {
          return null;
        }
      }}
    />
  );
};

export default CountrySelectConponent;
