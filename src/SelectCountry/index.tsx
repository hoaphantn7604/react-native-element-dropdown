import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { Image, View, Text, ImageStyle } from 'react-native';
import Dropdown from '../Dropdown';
import { IProps } from '../Dropdown/type';
import { styles } from './styles';

interface Props extends IProps {
  imageField: string;
  imageStyle?: ImageStyle;
}

const CountrySelectConponent = React.forwardRef((props: Props, currentRef) => {
  const { data, value, valueField, labelField, imageField, selectedTextStyle, imageStyle } = props;
  const ref: any = useRef(null);

  useImperativeHandle(currentRef, () => {
    return { open: eventOpen, close: eventClose };
  });

  const eventOpen = () => {
    ref.current.open();
  }

  const eventClose = () => {
    ref.current.close();
  }


  const _renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Image source={item[imageField]} style={[styles.image, imageStyle]} />
        <Text style={[styles.selectedTextStyle, selectedTextStyle]}>
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
      ref={ref}
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
});

export default CountrySelectConponent;
