import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  Text,
  Dimensions,
  Modal
} from 'react-native';
import { styles } from './styles';
import { MultiSelect } from './type';
import CInput from '../TextInput';
import { useScale, useDetectDevice } from '../utilsScale';
import { useDeviceOrientation } from '../useDeviceOrientation';

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
    label,
    value,
    style,
    labelField,
    valueField,
    textErrorStyle,
    selectedStyle,
    selectedTextStyle,
    activeColor,
    containerStyle,
    fontFamily,
    textStyle,
    textError,
    iconColor = "gray",
    labelStyle,
    inputSearchStyle,
    searchPlaceholder,
    placeholder,
    search = false,
    renderItem,
    renderLeftIcon,
  } = props;

  const ref = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<any[]>([]);
  const [textSearch, setTextSearch] = useState<string>('');
  const [listData, setListData] = useState<any[]>(data);
  const [key, setKey] = useState<number>(Math.random());
  const [position, setPosition] = useState<any>();
  const { width, height } = Dimensions.get('window');

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
    setCurrentValue(value);
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

  const showOrClose = () => {
    setVisible(!visible);
  }

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
  }

  const _renderTitle = () => {
    if (label) {
      return (
        <Text style={[styles.title, labelStyle, font()]}>
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
            {placeholder}
          </Text>
          <Image source={ic_down} style={[styles.icon, { tintColor: iconColor }]} />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const checkSelected = (item: any) => {
    const index = currentValue.findIndex(e => e === item[valueField]);
    return index > -1;
  }

  const _renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity key={index} onPress={() => onSelect(item)} style={[checkSelected(item) && { backgroundColor: activeColor, marginBottom: scale(0.5) }]}>
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
    return <SafeAreaView style={{ flex: 1 }}>
      {search && <CInput
        style={[styles.input, inputSearchStyle]}
        inputStyle={font()}
        placeholder={searchPlaceholder}
        onChangeText={onSearch}
        placeholderTextColor="gray"
        iconStyle={{ tintColor: 'gray' }}
      />}
      <FlatList
        ref={(e) => scrollToIndex(e)}
        data={listData}
        renderItem={_renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={key}
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  }

  const _renderModal = () => {
    if (visible && position && position?.px && position?.py && position?.fy) {
      const isFull = orientation === 'LANDSCAPE' && !useDetectDevice.isTablet;
      const top = isFull ? scale(20) : position?.py + position?.fy + scale(10);
      return <Modal transparent visible={visible} supportedOrientations={['landscape', 'portrait']}>
        <TouchableWithoutFeedback onPress={showOrClose}>
          <View style={[{ width: width, height: height, alignItems: 'center' }, isFull && { backgroundColor: 'rgba(0,0,0,0.4)' }]}>
            <View style={{ height: top }} />
            <View style={[{ width: position?.px }, styles.container, styles.shadow, isFull && { width: width / 2, maxHeight: '100%' }, containerStyle]}
            >
              {_renderList()}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    }
    return null
  }

  useEffect(() => {
    _measure();
  }, [visible, orientation])

  const _measure = () => {
    ref.current.measure((width, height, px, py, fx, fy) => {
      const location = {
        fx: fx,
        fy: fy,
        px: px,
        py: py,
        width: width,
        height: height,
      }
      setPosition(location);
    })
  }



  const unSelect = (item: any) => {
    const index = currentValue.indexOf(item[valueField]);
    currentValue.splice(index, 1);
    setKey(Math.random());
  }

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
        })}
      </View>)
  }

  return (
    <View>
      <View style={[style]} ref={ref}>
        {_renderTitle()}
        {_renderDropdown()}
        {_renderModal()}
      </View>
      {textError && <Text style={[styles.textError, textErrorStyle, font()]}>{textError}</Text>}
      {_renderItemSelected()}
    </View>
  );
};

MultiSelectComponent.defaultProps = defaultProps;

export default MultiSelectComponent;

