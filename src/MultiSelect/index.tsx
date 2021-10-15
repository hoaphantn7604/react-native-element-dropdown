import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Keyboard, Modal, Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  KeyboardEvent,
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice, useScale } from '../utilsScale';
import { styles } from './styles';
import { MultiSelect } from './type';

const { scale, fontScale } = useScale;
const { isTablet, isIOS } = useDetectDevice;
const ic_down = require('../assets/icon/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  backgroundColor: 'white',
  data: [],
  style: {},
}

const MultiSelectComponent: MultiSelect = (props) => {
  const orientation = useDeviceOrientation();
  const {
    onChange,
    data,
    value,
    style,
    labelField,
    valueField,
    selectedStyle,
    selectedTextStyle,
    activeColor,
    containerStyle,
    fontFamily,
    placeholderStyle,
    iconColor = "gray",
    inputSearchStyle,
    searchPlaceholder,
    placeholder,
    search = false,
    maxHeight = scale(340),
    disable = false,
    renderItem,
    renderLeftIcon,
    renderRightIcon,
    renderSelectedItem,
    onFocus,
    onBlur,
    showsVerticalScrollIndicator = true
  } = props;

  const ref = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>(data);
  const [key, setKey] = useState<number>(Math.random());
  const [position, setPosition] = useState<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
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

  const onKeyboardDidShow = (e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height + (isIOS ? 0 : 30));
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const susbcriptionKeyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    
    return ()=>{
      susbcriptionKeyboardDidShow.remove();
      susbcriptionKeyboardDidHide.remove();
    }
  }, []);

  useEffect(() => {
    getValue();
  }, [value]);

  const getValue = () => {
    setCurrentValue(value ? value : []);
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
  };

  const onSelect = (item: any) => {
    onSearch('');

    const index = currentValue.findIndex(e => e === item[valueField]);
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      currentValue.push(item[valueField]);
    }
    onChange(currentValue);
    setKey(Math.random());
  };

  const _renderDropdown = () => {
    return (
      <TouchableWithoutFeedback onPress={showOrClose}>
        <View style={styles.dropdown}>
          {renderLeftIcon?.()}
          <Text style={[styles.textItem, placeholderStyle, font()]}>
            {placeholder}
          </Text>
          {renderRightIcon ? renderRightIcon() : <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  };

  const checkSelected = (item: any) => {
    const index = currentValue.findIndex(e => e === item[valueField]);
    return index > -1;
  };

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={[checkSelected(item) && { backgroundColor: activeColor, marginBottom: scale(0.5) }]}>
        {renderItem ? renderItem(item) : <View style={styles.item}>
          <Text style={[styles.textItem, placeholderStyle, font()]}>{item[labelField]}</Text>
        </View>}
      </TouchableOpacity>
    );
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

  const _renderListTop = () => {
    return <View style={{ flex: 1 }}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={listData}
        inverted
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
      {search && <CInput
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
      />}
    </View>
  };


  const _renderListBottom = () => {
    return <View style={{ flex: 1 }}>
      {search && <CInput
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
      />}
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
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
        const isTopPosition = bottom < maxHeight;
        const keyboadPosition = keyboardHeight - bottom;
        const marginTop = isTopPosition ? (focus && keyboardHeight > 0 && keyboardHeight > bottom ? top - keyboadPosition : top) : focus && bottom < keyboardHeight + scale(50) ? top - (keyboardHeight - bottom + scale(50)) : top;

        return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
          <TouchableWithoutFeedback onPress={showOrClose}>
            <View style={[{ width: W, height: H }, isFull && styleContainerVertical]}>
              <View style={{ height: marginTop, width: w, justifyContent: 'flex-end' }}>
                {isTopPosition && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleVertical : styleHorizontal]}>
                  {_renderListTop()}
                </View>}
              </View>
              <View style={{ height: bottom, width: w }}>
                {!isTopPosition && <View style={[{ width: w }, styles.container, containerStyle, isFull ? styleVertical : styleHorizontal]}>
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

  const unSelect = (item: any) => {
    if (!disable) {
      onSelect(item);
    }
  };

  const _renderItemSelected = () => {
    const list = data.filter((e: any) => {
      const check = currentValue.indexOf(e[valueField]);
      if (check !== -1) {
        return e;
      }
    });

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {list.map(e => {
          if (renderSelectedItem) {
            return <TouchableOpacity
              key={e[labelField]}
              onPress={() => unSelect(e)}
            >
              {renderSelectedItem(e, (e) => { unSelect(e) })}
            </TouchableOpacity>
          } else {
            return (
              <TouchableOpacity
                key={e[labelField]}
                style={[styles.selectedItem, selectedStyle]}
                onPress={() => unSelect(e)}
              >
                <Text style={[{ fontSize: fontScale(12), color: 'gray' }, selectedTextStyle, font()]}>{e[labelField]}</Text>
                <Text style={[styles.selectedTextItem, selectedTextStyle]}>ⓧ</Text>
              </TouchableOpacity>
            )
          }
        })}
      </View>)
  };

  return (
    <View>
      <View style={[{ justifyContent: 'center' }, style]} ref={ref} onLayout={_measure}>
        {_renderDropdown()}
        {_renderModal()}
      </View>
      {!visible && _renderItemSelected()}
    </View>
  );
};

MultiSelectComponent.defaultProps = defaultProps;

export default MultiSelectComponent;

