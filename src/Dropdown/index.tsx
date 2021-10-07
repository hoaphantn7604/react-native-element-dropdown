import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Modal,
  Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice, useScale } from '../utilsScale';
import { styles } from './styles';
import { Dropdown } from './type';
const { isTablet } = useDetectDevice;

const { scale } = useScale;
const ic_down = require('../assets/icon/down.png');

const deepEqual: any = (x: any, y: any) => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
    ok(x).every(key => deepEqual(x[key], y[key]))
    : x === y;
};


const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
  selectedTextProps: {}
}

const DropdownComponent: Dropdown = (props) => {
  const orientation = useDeviceOrientation();
  const {
    onChange,
    style,
    containerStyle,
    placeholderStyle,
    selectedTextStyle,
    inputSearchStyle,
    selectedTextProps,
    data,
    labelField,
    valueField,
    value,
    activeColor,
    fontFamily,
    iconColor = "gray",
    searchPlaceholder,
    placeholder,
    search = false,
    maxHeight = scale(340),
    disable = false,
    renderLeftIcon,
    renderRightIcon,
    renderItem
  } = props;

  const ref = useRef(null);
  const refList = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [listData, setListData] = useState<any[]>(data);
  const [position, setPosition] = useState<any>();
  const { width: W, height: H } = Dimensions.get('window');

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      }
    } else {
      return {}
    }
  };

  useEffect(() => {
    getValue();
  }, [value, data]);

  const getValue = () => {
    const getItem = data.filter(e => deepEqual(value, e[valueField]));
    if (getItem.length > 0) {
      setCurrentValue((e: any) => e = getItem[0]);
    } else {
      setCurrentValue(null);
    }
  };

  const showOrClose = () => {
    if (!disable) {
      _measure();
      setVisible(!visible);
      setListData(data);
    }
    scrollIndex();
  };

  const onSearch = (text: string) => {
    if (text.length > 0) {
      const dataSearch = data.filter(e => {
        const item = e[labelField]?.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return item.indexOf(key) >= 0
      });
      setListData(dataSearch);
    } else {
      setListData(data);
    }
  };

  const scrollIndex = () => {
    setTimeout(() => {
      if (refList) {
        const index = data.findIndex(e => value === e[valueField]);
        if (index !== -1) {
          refList?.current?.scrollToIndex({ index: index, animated: false });
        }
      }
    }, 200);
  };

  const onSelect = (item: any) => {
    onSearch('');
    setCurrentValue((e: any) => e = item);
    onChange(item);
    setVisible(false);
  };

  const _renderDropdown = () => {
    const isSelected = currentValue && currentValue[valueField];
    return (
      <TouchableWithoutFeedback onPress={showOrClose}>
        <View style={styles.dropdown}>
          {renderLeftIcon?.()}
          <Text style={[styles.textItem, isSelected ? selectedTextStyle : placeholderStyle, font()]} {...selectedTextProps}>
            {isSelected ? currentValue[labelField] : placeholder}
          </Text>
          {renderRightIcon ? renderRightIcon() : <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  };

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    const isSelected = currentValue && currentValue[valueField];
    return (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={[deepEqual(item[valueField], isSelected) && { backgroundColor: activeColor }]}>
        {renderItem ? renderItem(item) : <View style={styles.item}>
          <Text style={[styles.textItem, selectedTextStyle, font()]}>{item[labelField]}</Text>
        </View>}
      </TouchableOpacity>
    );
  };

  const _renderListTop = () => {
    return <View style={{ flex: 1 }}>
      <FlatList
        ref={refList}
        onScrollToIndexFailed={scrollIndex}
        data={listData}
        inverted
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
      />
      {search && <CInput
        style={[styles.input, inputSearchStyle]}
        inputStyle={font()}
        autoCorrect={false}
        placeholder={searchPlaceholder}
        onChangeText={onSearch}
        placeholderTextColor="gray"
        iconStyle={{ tintColor: iconColor }}
      />}
    </View>
  };

  const _renderListBottom = () => {
    return <View style={{ flex: 1 }}>
      {search && <CInput
        style={[styles.input, inputSearchStyle]}
        inputStyle={font()}
        autoCorrect={false}
        placeholder={searchPlaceholder}
        onChangeText={onSearch}
        placeholderTextColor="gray"
        iconStyle={{ tintColor: iconColor }}
      />}
      <FlatList
        ref={refList}
        onScrollToIndexFailed={scrollIndex}
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
      />
    </View>
  };

  const _renderModal = () => {
    if (visible && position) {
      const {
        isFull,
        w,
        top,
        bottom,
        left
      } = position
      if (w && top && bottom) {

        const styleContainerVertical: ViewStyle = { backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center' };
        const styleVertical: ViewStyle = { marginBottom: scale(20), width: W / 2, alignSelf: 'center' };
        const styleHorizontal: ViewStyle = { left: left, maxHeight: maxHeight };

        return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
          <TouchableWithoutFeedback onPress={showOrClose}>
            <View style={[{ width: W, height: H }, isFull && styleContainerVertical]}>
              <View style={{ height: top, width: w, justifyContent: 'flex-end' }}>
                {bottom < maxHeight && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleVertical : styleHorizontal]}>
                  {_renderListTop()}
                </View>}
              </View>
              <View style={{ height: bottom, width: w }}>
                {bottom > maxHeight && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleVertical : styleHorizontal]}>
                  {_renderListBottom()}
                </View>}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      }
      return null;

    }
    return null;
  };

  const _measure = () => {
    if (ref) {
      ref.current.measure((width, height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = px;
        const top = isFull ? scale(20) : py + fy + scale(2);
        const bottom = H - top;
        const left = fx;

        setPosition({
          isFull,
          w,
          top,
          bottom,
          left
        });
      })
    }
  };

  return (
    <View >
      <View style={[{ justifyContent: 'center' }, style]} ref={ref} onLayout={_measure}>
        {_renderDropdown()}
        {_renderModal()}
      </View>
    </View>
  );
};

DropdownComponent.defaultProps = defaultProps;

export default DropdownComponent;

