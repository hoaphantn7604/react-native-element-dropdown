import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  Text,
  SafeAreaView
} from 'react-native';
import { styles } from './styles';
import { Dropdown } from './type';
import CInput from './TextInput';
import { useRef } from 'react';
import { useScale } from '../utilsScale';

const { scale } = useScale;
const ic_down = require('./icon/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
}

const DropdownComponent: Dropdown = (props) => {
  const {
    onChange,
    style,
    containerStyle,
    textErrorStyle,
    labelStyle,
    textStyle,
    inputSearchStyle,
    data,
    labelField,
    valueField,
    label,
    value,
    activeColor,
    fontFamily,
    textError,
    iconColor,
    searchPlaceholder,
    placeholder,
    search = false,
    renderLeftIcon,
    renderItem
  } = props;

  const ref = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any>(null);
  const [textSearch, setTextSearch] = useState<string>('');
  const [listData, setListData] = useState<any[]>(data);
  const [position, setPosition] = useState<any>();

  useEffect(() => {
    getValue();
  }, []);

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      }
    } else {
      return {}
    }
  }

  const showOrClose = () => {
    setVisible(!visible);
  }

  const scrollToIndex = (ref: any) => {
    if (textSearch.length === 0) {
      const index = data.findIndex(e => value === e[valueField]);
      if (index !== -1 && ref) {
        setTimeout(() => {
          ref.scrollToIndex({ index: index, animated: true })
        }, 300);
      }
    }
  }

  const getValue = () => {
    const getItem = data.filter(e => value === e[valueField]);
    if (getItem.length > 0) {
      setCurrentValue((e: any) => e = getItem[0]);
    }
  }

  const onSelect = (item: any) => {
    onSearch('');
    setCurrentValue((e: any) => e = item);
    onChange(item[valueField]);
    setVisible(false);
  }

  const _renderTitle = () => {
    if (label) {
      return (
        <Text style={[styles.title, labelStyle]}>
          {label}
        </Text>
      )
    }
  }

  const _renderDropdown = () => {
    return (
      <TouchableWithoutFeedback onPress={showOrClose}>
        <View style={styles.dropdown}>
          {renderLeftIcon?.()}
          <Text style={[styles.textItem, textStyle, font()]}>
            {currentValue && currentValue[labelField] || placeholder}
          </Text>
          <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }]} />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity onPress={() => onSelect(item)} style={[item[valueField] === (currentValue && currentValue[valueField]) && { backgroundColor: activeColor }]}>
        {renderItem ? renderItem(item) : <View style={styles.item}>
          <Text style={[styles.textItem, textStyle, font()]}>{item[labelField]}</Text>
        </View>}
      </TouchableOpacity>
    );
  };

  const onSearch = (text: string) => {
    setTextSearch(text);
    if (text.length > 0) {
      const dataSearch = data.filter(e => {
        const item = e[labelField].toLowerCase().replace(' ', '');
        const key = text.toLowerCase().replace(' ', '');

        return item.indexOf(key) >= 0
      });
      setListData(dataSearch);
    } else {
      setListData(data);
    }
  }

  const _renderList = () => {
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
        ref={(e) => scrollToIndex(e)}
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  }

  const _renderModal = () => {
    if (visible && position) {
      return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
        <TouchableWithoutFeedback onPress={showOrClose}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={[{ backgroundColor: 'white' }, {
              borderWidth: scale(0.5),
              borderColor: '#EEEEEE',
              height: 400,
              width: position?.px,
              top: position?.py + position?.fy + scale(10)
            }, containerStyle]}
            >
              {_renderList()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    }
    return null
  }

  const _measure = () => {
    ref.current.measure((width, height, px, py, fx, fy) => {
      const location = {
        fx: fx,
        fy: fy,
        px: px,
        py: py,
        width: width,
        height: height
      }
      setPosition(location);
    })
  }

  return (
    <View >
      <SafeAreaView/>
      <View style={[style]} ref={ref} onLayout={_measure}>
        {_renderTitle()}
        {_renderDropdown()}
        {_renderModal()}
      </View>
      {textError && <Text style={[styles.textError, textErrorStyle, font()]}>{textError}</Text>}
    </View>
  );
};

DropdownComponent.defaultProps = defaultProps;

export default DropdownComponent;

