import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions, FlatList,
  Image, Modal, Text, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../useDeviceOrientation';
import { useDetectDevice, useScale } from '../utilsScale';
import { styles } from './styles';
import { MultiSelect } from './type';

const { scale, fontScale } = useScale;

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
    renderSelectedItem
  } = props;

  const ref = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [textSearch, setTextSearch] = useState<string>('');
  const [listData, setListData] = useState<any[]>(data);
  const [key, setKey] = useState<number>(Math.random());
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
  }, [value]);

  const getValue = () => {
    setCurrentValue(value ? value : []);
  };

  const showOrClose = () => {
    if (!disable) {
      _measure();
      setVisible(!visible);
      setListData(data);
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
    setTextSearch(text);
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

        const styleContainerVertical = { backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center' };
        const styleVertical = { marginBottom: scale(20), width: W / 2, alignSelf: 'center' };
        const styleHorizontal = { left: left, maxHeight: maxHeight };

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

        const isFull = orientation === 'LANDSCAPE' && !useDetectDevice.isTablet;
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

