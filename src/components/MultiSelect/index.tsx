import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Keyboard, Modal, Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  KeyboardEvent,
  I18nManager
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import { useDetectDevice } from '../../toolkits';
import { styles } from './styles';
import { MultiSelectProps } from './model';
import _ from 'lodash';

const { isTablet, isIOS } = useDetectDevice;
const ic_down = require('../../assets/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  backgroundColor: 'white',
  data: [],
  style: {},
}

const MultiSelectComponent = React.forwardRef<any, MultiSelectProps>((props, currentRef) => {
  const orientation = useDeviceOrientation();
  const {
    testID,
    onChange,
    data,
    value,
    style,
    labelField,
    valueField,
    selectedStyle,
    selectedTextStyle,
    iconStyle,
    activeColor,
    containerStyle,
    fontFamily,
    placeholderStyle,
    iconColor = "gray",
    inputSearchStyle,
    searchPlaceholder,
    placeholder,
    search = false,
    maxHeight = 340,
    maxSelect,
    disable = false,
    keyboardAvoiding = true,
    inside = false,
    renderItem,
    renderLeftIcon,
    renderRightIcon,
    renderSelectedItem,
    renderInputSearch,
    onFocus,
    onBlur,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto',
    flatListProps,
    alwaysRenderItemSelected = false,
    searchQuery
  } = props;

  const ref = useRef<View>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [listData, setListData] = useState<any[]>(data);
  const [key, setKey] = useState<number>(Math.random());
  const [position, setPosition] = useState<any>();
  const [focus, setFocus] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const { width: W, height: H } = Dimensions.get('window');
  const styleContainerVertical: ViewStyle = { backgroundColor: 'rgba(0,0,0,0.1)', alignItems: 'center' };
  const styleHorizontal: ViewStyle = { marginBottom: 20, width: W / 2, alignSelf: 'center' };

  useImperativeHandle(currentRef, () => {
    return { open: eventOpen, close: eventClose };
  });

  useEffect(() => {
    setListData([...data]);
  }, [data]);

  const eventOpen = () => {
    if (!disable) {
      setVisible(true);
      if (onFocus) {
        onFocus();
      }
    }
  }

  const eventClose = () => {
    if (!disable) {
      setVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  }

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
    _measure();
    setKeyboardHeight(e.endCoordinates.height + (isIOS ? 0 : 50));
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    const susbcriptionKeyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      if (typeof susbcriptionKeyboardDidShow?.remove === 'function') {
        susbcriptionKeyboardDidShow.remove();
      } else {
        Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      }

      if (typeof susbcriptionKeyboardDidHide?.remove === 'function') {
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
    setCurrentValue(value ? [...value] : []);
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

    const index = currentValue.findIndex(e => e === _.get(item, valueField));
    if (index > -1) {
      currentValue.splice(index, 1);
    } else {
      if (maxSelect) {
        if (currentValue.length < maxSelect) {
          currentValue.push(_.get(item, valueField));
        }
      } else {
        currentValue.push(_.get(item, valueField));
      }

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
          {renderRightIcon ? renderRightIcon() : <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }, iconStyle]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  };

  const checkSelected = (item: any) => {
    const index = currentValue.findIndex(e => e === _.get(item, valueField));
    return index > -1;
  };

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={[checkSelected(item) && { backgroundColor: activeColor, marginBottom: 0.5 }]}>
        {renderItem ? renderItem(item) : <View style={styles.item}>
          <Text style={[styles.textItem, placeholderStyle, font()]}>{_.get(item, labelField)}</Text>
        </View>}
      </TouchableOpacity>
    );
  };

  const onSearch = (text: string) => {
    if (text.length > 0) {
      const defaultFilterFunction = (e: any) => {
        const item = _.get(e, labelField)?.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(' ', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        return item.indexOf(key) >= 0
      }

      const propSearchFunction = (e: any) => {
        const labelText = _.get(e, labelField);

        return searchQuery?.(text, labelText);
      }

      const dataSearch = data.filter(searchQuery ? propSearchFunction : defaultFilterFunction);
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
          inputStyle={[inputSearchStyle, font()]}
          autoCorrect={false}
          keyboardType={isIOS ? 'default' : 'visible-password'}
          placeholder={searchPlaceholder}
          onChangeText={onSearch}
          placeholderTextColor="gray"
          iconStyle={[{ tintColor: iconColor }, iconStyle]}
          onFocus={() => setFocus(true)}
          onBlur={() => { setFocus(false) }}
        />
      }
    }
    return null;
  }

  const _renderListTop = () => {
    return <TouchableWithoutFeedback><View style={{ flexShrink: 1 }}>
      <FlatList
        {...flatListProps}
        keyboardShouldPersistTaps="handled"
        data={listData}
        inverted
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
      {renderSearch()}
    </View></TouchableWithoutFeedback>
  };


  const _renderListBottom = () => {
    return <TouchableWithoutFeedback><View style={{ flexShrink: 1 }}>
      {renderSearch()}
      <FlatList
        {...flatListProps}
        keyboardShouldPersistTaps="handled"
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      />
    </View></TouchableWithoutFeedback>
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
        const isTopPosition = dropdownPosition === 'auto' ? bottom < (isIOS ? 200 : 300) : dropdownPosition === 'top' ? true : false;
        let topHeight = isTopPosition ? top - height : top;

        let keyboardStyle: ViewStyle = {};
        if (keyboardAvoiding) {
          if (renderInputSearch) {
            if (keyboardHeight > 0 && bottom < keyboardHeight + height) {
              if (isTopPosition) {
                topHeight = H - keyboardHeight;
              } else {
                keyboardStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
                topHeight = H - keyboardHeight - 55;
              }
            }
          } else {
            if (focus && keyboardHeight > 0 && bottom < keyboardHeight + height) {
              if (isTopPosition) {
                topHeight = H - keyboardHeight;
              } else {
                keyboardStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
                topHeight = H - keyboardHeight - 55;
              }
            }
          }
        }

        return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']} onRequestClose={showOrClose}>
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
  }, [focus, position, visible, keyboardHeight, listData, currentValue]);

  const _measure = () => {
    if (ref && ref?.current) {
      ref.current.measure((width, height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = Math.floor(px);
        const top = isFull ? 20 : Math.floor(py) + Math.floor(fy) + 2;
        const bottom = H - top;
        const left = I18nManager.isRTL ? W - Math.floor(px) - Math.floor(fx) : Math.floor(fx);

        setPosition({
          isFull,
          w,
          top,
          bottom: Math.floor(bottom),
          left,
          height: Math.floor(py)
        });
      })
    }
  };

  const unSelect = (item: any) => {
    if (!disable) {
      onSelect(item);
    }
  };

  const _renderItemSelected = (inside: boolean) => {
    const list = data.filter((e: any) => {
      const check = value?.indexOf(_.get(e, valueField));
      if (check !== -1) {
        return e;
      }
    });

    return (
      <View style={[{ flexDirection: 'row', flexWrap: 'wrap' }, inside && { flex: 1 }]}>
        {list.map(e => {
          if (renderSelectedItem) {
            return <TouchableOpacity
              key={_.get(e, labelField)}
              onPress={() => unSelect(e)}
            >
              {renderSelectedItem(e, () => { unSelect(e) })}
            </TouchableOpacity>
          } else {
            return (
              <TouchableOpacity
                key={_.get(e, labelField)}
                style={[styles.selectedItem, selectedStyle]}
                onPress={() => unSelect(e)}
              >
                <Text style={[{ fontSize: 12, color: 'gray' }, selectedTextStyle, font()]}>{_.get(e, labelField)}</Text>
                <Text style={[styles.selectedTextItem, selectedTextStyle]}>ⓧ</Text>
              </TouchableOpacity>
            )
          }
        })}
      </View>)
  };


  const _renderInside = () => {
    return <View style={[{ justifyContent: 'center' }, style]} ref={ref} onLayout={_measure}>
      {_renderDropdownInside()}
      {_renderModal()}
    </View>
  }

  const _renderDropdownInside = () => {
    return (
      <TouchableWithoutFeedback onPress={showOrClose}>
        <View style={styles.dropdownInside}>
          {renderLeftIcon?.()}
          {value && value?.length > 0 ? _renderItemSelected(true) :
            <Text style={[styles.textItem, placeholderStyle, font()]}>
              {placeholder}
            </Text>}
          {renderRightIcon ? renderRightIcon() : <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }, iconStyle]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  };

  if (inside) {
    return _renderInside();
  }

  return (
    <>
      <View style={[{ justifyContent: 'center' }, style]} ref={ref} onLayout={_measure} testID={testID}>
        {_renderDropdown()}
        {_renderModal()}
      </View>
      {(!visible || alwaysRenderItemSelected) && _renderItemSelected(false)}
    </>
  );
});

MultiSelectComponent.defaultProps = defaultProps;

export default MultiSelectComponent;

