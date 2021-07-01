import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Modal,
  Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice, useScale } from '../utilsScale';
import { styles } from './styles';
import { Dropdown } from './type';
const { isTablet } = useDetectDevice;

const { scale } = useScale;
const ic_down = require('../assets/icon/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
}

const DropdownComponent: Dropdown = (props) => {
  const orientation = useDeviceOrientation();
  const {
    onChange,
    style,
    containerStyle,
    placeholderStyle,
    inputSearchStyle,
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
    maxHeight = 340,
    disable = false,
    renderLeftIcon,
    renderRightIcon,
    renderItem
  } = props;

  const ref = useRef(null);
  const refList = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [textSearch, setTextSearch] = useState<string>('');
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
  }

  useEffect(() => {
    getValue();
  }, []);

  const getValue = () => {
    const getItem = data.filter(e => value === e[valueField]);
    if (getItem.length > 0) {
      setCurrentValue((e: any) => e = getItem[0]);
    }
  }

  const scrollToIndex = useMemo(() => {
    if (textSearch.length === 0) {
      const index = data.findIndex(e => value === e[valueField]);
      if (index !== -1) {
        return index;
      }
      return 0;
    }
  }, [value])

  const showOrClose = () => {
    if (!disable) {
      _measure();
      setVisible(!visible);
      setListData(data);
    }
  }

  const onSelect = (item: any) => {
    onSearch('');
    setCurrentValue((e: any) => e = item);
    onChange(item);
    setVisible(false);
  }

  const _renderDropdown = () => {
    return (
      <TouchableWithoutFeedback onPress={showOrClose}>
        <View style={styles.dropdown}>
          {renderLeftIcon?.()}
          <Text style={[styles.textItem, placeholderStyle, font()]}>
            {currentValue && currentValue[labelField] || placeholder}
          </Text>
          {renderRightIcon ? renderRightIcon() : <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }]} />}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={[item[valueField] === (currentValue && currentValue[valueField]) && { backgroundColor: activeColor }]}>
        {renderItem ? renderItem(item) : <View style={styles.item}>
          <Text style={[styles.textItem, placeholderStyle, font()]}>{item[labelField]}</Text>
        </View>}
      </TouchableOpacity>
    );
  };

  const onSearch = (text: string) => {
    setTextSearch(text);
    if (text.length > 0) {
      const dataSearch = data.filter(e => {
        const item = e[labelField]?.toLowerCase().replace(' ', '');
        const key = text.toLowerCase().replace(' ', '');

        return item.indexOf(key) >= 0
      });
      setListData(dataSearch);
    } else {
      setListData(data);
    }
  }

  const scrollIndex = () => {
    refList.current.scrollToIndex({ index: scrollToIndex, animated: false });
  }

  const _renderListTop = () => {
    return <View style={{ flex: 1 }}>
      <FlatList
        ref={refList}
        initialScrollIndex={scrollToIndex}
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
        placeholder={searchPlaceholder}
        onChangeText={onSearch}
        placeholderTextColor="gray"
        iconStyle={{ tintColor: iconColor }}
      />}
    </View>
  }

  const _renderListBottom = () => {
    return <View style={{ flex: 1 }}>
      {search && <CInput
        style={[styles.input, inputSearchStyle]}
        inputStyle={font()}
        placeholder={searchPlaceholder}
        onChangeText={onSearch}
        placeholderTextColor="gray"
        iconStyle={{ tintColor: iconColor }}
      />}
      <FlatList
        ref={refList}
        initialScrollIndex={scrollToIndex}
        onScrollToIndexFailed={scrollIndex}
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
      />
    </View>
  }

  const _renderModal = () => {
    if (visible && position) {
      const {
        isFull,
        w,
        top,
        bottom
      } = position
      return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
        <TouchableWithoutFeedback onPress={showOrClose}>
          <View style={[{ width: W, height: H, alignItems: 'center' }, isFull && { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <View style={{ height: top, width: w, justifyContent: 'flex-end' }}>
              {bottom < maxHeight && <View style={[{ width: w }, styles.container, containerStyle, isFull ? { marginBottom: scale(20), width: W / 2, alignSelf: 'center' } : { maxHeight: maxHeight }]}>
                {_renderListTop()}
              </View>}
            </View>
            <View style={{ height: bottom, width: w }}>
              {bottom > maxHeight && <View style={[{ width: w }, styles.container, containerStyle, isFull ? { marginBottom: scale(20), width: W / 2, alignSelf: 'center' } : { maxHeight: maxHeight }]}>
                {_renderListBottom()}
              </View>}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    }
    return null
  }

  const _measure = () => {
    if (ref) {
      ref.current.measure((width, height, px, py, fx, fy) => {
        const isFull = orientation === 'LANDSCAPE' && !isTablet;
        const w = px;
        const top = isFull ? scale(20) : py + fy + scale(5);
        const bottom = H - top;

        setPosition({
          isFull,
          w,
          top,
          bottom
        });
      })
    }
  }

  return (
    <View >
      <View style={[style]} ref={ref} onLayout={_measure}>
        {_renderDropdown()}
        {_renderModal()}
      </View>
    </View>
  );
};

DropdownComponent.defaultProps = defaultProps;

export default DropdownComponent;

