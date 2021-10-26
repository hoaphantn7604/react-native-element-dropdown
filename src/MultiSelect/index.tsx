import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    renderInputSearch,
    onFocus,
    onBlur,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto'
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
          bottom : parseInt(bottom),
          left,
          height: parseInt(py)
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

