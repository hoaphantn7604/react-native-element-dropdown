import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Keyboard, Modal,
  Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  KeyboardEvent,
  Alert,
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice, useScale } from '../utilsScale';
import { styles } from './styles';
import { DropdownProps } from './type';

const { isTablet, isIOS } = useDetectDevice;
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

const DropdownComponent: DropdownProps = (props) => {
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
    renderItem,
    renderInputSearch,
    onFocus,
    onBlur,
    autoScroll = true,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto'
  } = props;

  const ref = useRef(null);
  const refList = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [listData, setListData] = useState<any[]>(data);
  const [position, setPosition] = useState<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const { width: W, height: H } = Dimensions.get('window');
  const styleContainerVertical: ViewStyle = { backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center' };
  const styleHorizontal: ViewStyle = { marginBottom: scale(20), width: W / 2, alignSelf: 'center' };

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      }
    } else {
      return {}
    }
  };

  const onKeyboardDidShow = (e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height + (isIOS ? 0 : scale(50)));
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const susbcriptionKeyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      if (susbcriptionKeyboardDidShow?.remove) {
        susbcriptionKeyboardDidShow.remove();
      } else {
        Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      }

      if (susbcriptionKeyboardDidHide?.remove) {
        susbcriptionKeyboardDidHide.remove();
      } else {
        Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
      }
    }
  }, []);

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

      if (!visible) {
        if (onFocus) {
          onFocus();
        }
      } else {
        if (onBlur) {
          onBlur();
        }
      }
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
    if (autoScroll) {
      setTimeout(() => {
        if (refList) {
          const index = data.findIndex(e => value === e[valueField]);
          if (index !== -1) {
            refList?.current?.scrollToIndex({ index: index, animated: false });
          }
        }
      }, 200);
    }
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

  const renderSearch = () => {
    if (search) {
      if (renderInputSearch) {
        return renderInputSearch((text) => { onSearch(text) });
      } else {
        return <CInput
          style={[styles.input, inputSearchStyle]}
          inputStyle={font()}
          autoCorrect={false}
          keyboardType={isIOS ? 'default' : 'visible-password'}
          placeholder={searchPlaceholder}
          onChangeText={onSearch}
          placeholderTextColor="gray"
          iconStyle={{ tintColor: iconColor }}
          onFocus={() => setFocus(true)}
          onBlur={() => { setFocus(false) }}
        />
      }
    }
    return null;
  }

  const _renderListTop = () => {
    return <View style={{ flex: 1 }}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        ref={refList}
        onScrollToIndexFailed={scrollIndex}
        data={listData}
        inverted
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
      {renderSearch()}
    </View>
  };

  const _renderListBottom = () => {
    return <View style={{ flex: 1 }}>
      {renderSearch()}
      <FlatList
        keyboardShouldPersistTaps="handled"
        ref={refList}
        onScrollToIndexFailed={scrollIndex}
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
    </View>
  };

  const _renderModal = useCallback(() => {
    if (visible && position) {
      const {
        isFull,
        w,
        top,
        bottom,
        left,
        height
      } = position
      if (w && top && bottom) {
        const styleVertical: ViewStyle = { left: left, maxHeight: maxHeight };
        const isTopPosition = dropdownPosition === 'auto' ? bottom < scale(isIOS ? scale(200) : scale(300)) : dropdownPosition === 'top' ? true : false;
        let topHeight = isTopPosition ? top - height : top;

        let keyboardStyle: ViewStyle = {};
        if (renderInputSearch) {
          if (keyboardHeight > 0 && bottom < keyboardHeight + height) {
            if (isTopPosition) {
              topHeight = H - keyboardHeight;
            } else {
              keyboardStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
              topHeight = H - keyboardHeight - scale(55);
            }
          }
        } else {
          if (focus && keyboardHeight > 0 && bottom < keyboardHeight + height) {
            if (isTopPosition) {
              topHeight = H - keyboardHeight;
            } else {
              keyboardStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
              topHeight = H - keyboardHeight - scale(55);
            }
          }
        }

        return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
          <TouchableWithoutFeedback onPress={showOrClose}>
            <View style={[{ flex: 1 }, isFull && styleContainerVertical, keyboardStyle]}>
              <View style={{ height: topHeight, width: w, justifyContent: 'flex-end' }}>
                {isTopPosition && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]}>
                  {_renderListTop()}
                </View>}
              </View>
              <View style={{ flex: 1 }}>
                {!isTopPosition && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleHorizontal : styleVertical]}>
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
  }, [focus, position, visible, keyboardHeight, listData]);

  const _measure = () => {
    if (ref) {
      ref.current.measure((width, height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = parseInt(px);
        const top = isFull ? scale(20) : parseInt(py) + parseInt(fy) + scale(2);
        const bottom = H - top;
        const left = parseInt(fx);

        setPosition({
          isFull,
          w,
          top,
          bottom: parseInt(bottom),
          left,
          height: parseInt(py)
        });
      })
    }
  };

  return (
    <View style={[{ justifyContent: 'center' }, style]} ref={ref} onLayout={_measure}>
      {_renderDropdown()}
      {_renderModal()}
    </View>
  );
};

DropdownComponent.defaultProps = defaultProps;

export default DropdownComponent;

