import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  KeyboardEvent,
  I18nManager,
} from 'react-native';
import CInput from '../TextInput';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import { useDetectDevice } from '../../toolkits';
import { styles } from './styles';
import type { DropdownProps } from './model';
import _ from 'lodash';

const { isTablet, isIOS } = useDetectDevice;
const ic_down = require('../../assets/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
  selectedTextProps: {},
};

const DropdownComponent = React.forwardRef<any, DropdownProps>(
  (props, currentRef) => {
    const orientation = useDeviceOrientation();
    const {
      testID,
      itemTestIDField,
      onChange,
      style,
      containerStyle,
      placeholderStyle,
      selectedTextStyle,
      itemContainerStyle,
      itemTextStyle,
      inputSearchStyle,
      iconStyle,
      selectedTextProps,
      data,
      labelField,
      valueField,
      value,
      activeColor,
      fontFamily,
      iconColor = 'gray',
      searchPlaceholder,
      placeholder,
      search = false,
      maxHeight = 340,
      disable = false,
      keyboardAvoiding = true,
      renderLeftIcon,
      renderRightIcon,
      renderItem,
      renderInputSearch,
      onFocus,
      onBlur,
      autoScroll = true,
      showsVerticalScrollIndicator = true,
      dropdownPosition = 'auto',
      flatListProps,
      searchQuery,
      statusBarIsTranslucent,
      backgroundColor,
      onChangeText,
      confirmSelectItem,
      onConfirmSelectItem,
    } = props;

    const ref = useRef<View>(null);
    const refList = useRef<FlatList>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<any>(null);
    const [listData, setListData] = useState<any[]>(data);
    const [position, setPosition] = useState<any>();
    const [focus, setFocus] = useState<boolean>(false);
    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    const [searchText, setSearchText] = useState('');

    const { width: W, height: H } = Dimensions.get('window');
    const styleContainerVertical: ViewStyle = useMemo(() => {
      return {
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
      };
    }, []);
    const styleHorizontal: ViewStyle = useMemo(() => {
      return {
        marginBottom: 20,
        width: W / 2,
        alignSelf: 'center',
      };
    }, [W]);

    useImperativeHandle(currentRef, () => {
      return { open: eventOpen, close: eventClose };
    });

    useEffect(() => {
      setListData([...data]);
      if (searchText) {
        onSearch(searchText);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, searchText]);

    const eventOpen = () => {
      if (!disable) {
        setVisible(true);
        if (onFocus) {
          onFocus();
        }
      }
    };

    const eventClose = useCallback(() => {
      if (!disable) {
        setVisible(false);
        if (onBlur) {
          onBlur();
        }
      }
    }, [disable, onBlur]);

    const font = useCallback(() => {
      if (fontFamily) {
        return {
          fontFamily: fontFamily,
        };
      } else {
        return {};
      }
    }, [fontFamily]);

    const _measure = useCallback(() => {
      if (ref && ref?.current) {
        ref.current.measure((_width, _height, px, py, fx, fy) => {
          const isFull = orientation === 'LANDSCAPE' && !isTablet;
          const w = Math.floor(px);
          const top = isFull ? 20 : Math.floor(py) + Math.floor(fy) + 2;
          const bottom = H - top;
          const left = I18nManager.isRTL
            ? W - Math.floor(px) - Math.floor(fx)
            : Math.floor(fx);

          setPosition({
            isFull,
            w,
            top,
            bottom: Math.floor(bottom),
            left,
            height: Math.floor(py),
          });
        });
      }
    }, [H, W, orientation]);

    const onKeyboardDidShow = useCallback(
      (e: KeyboardEvent) => {
        _measure();
        setKeyboardHeight(e.endCoordinates.height);
      },
      [_measure]
    );

    const onKeyboardDidHide = useCallback(() => {
      setKeyboardHeight(0);
      _measure();
    }, [_measure]);

    useEffect(() => {
      const susbcriptionKeyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        onKeyboardDidShow
      );
      const susbcriptionKeyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        onKeyboardDidHide
      );

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
      };
    }, [onKeyboardDidHide, onKeyboardDidShow]);

    const getValue = useCallback(() => {
      const defaultValue =
        typeof value === 'object' ? _.get(value, valueField) : value;

      const getItem = data.filter((e) =>
        _.isEqual(defaultValue, _.get(e, valueField))
      );

      if (getItem.length > 0) {
        setCurrentValue(getItem[0]);
      } else {
        setCurrentValue(null);
      }
    }, [data, value, valueField]);

    useEffect(() => {
      getValue();
    }, [value, data, getValue]);

    const scrollIndex = useCallback(() => {
      if (autoScroll && data.length > 0 && listData.length === data.length) {
        setTimeout(() => {
          if (refList && refList?.current) {
            const defaultValue =
              typeof value === 'object' ? _.get(value, valueField) : value;

            const index = _.findIndex(listData, (e: any) =>
              _.isEqual(defaultValue, _.get(e, valueField))
            );
            if (index > -1 && index <= listData.length - 1) {
              refList?.current?.scrollToIndex({
                index: index,
                animated: false,
              });
            }
          }
        }, 200);
      }
    }, [autoScroll, data.length, listData, value, valueField]);

    const showOrClose = useCallback(() => {
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
    }, [_measure, data, disable, onBlur, onFocus, scrollIndex, visible]);

    const onSearch = useCallback(
      (text: string) => {
        if (text.length > 0) {
          const defaultFilterFunction = (e: any) => {
            const item = _.get(e, labelField)
              ?.toLowerCase()
              .replace(' ', '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');
            const key = text
              .toLowerCase()
              .replace(' ', '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '');

            return item.indexOf(key) >= 0;
          };

          const propSearchFunction = (e: any) => {
            const labelText = _.get(e, labelField);

            return searchQuery?.(text, labelText);
          };

          const dataSearch = data.filter(
            searchQuery ? propSearchFunction : defaultFilterFunction
          );
          setListData(dataSearch);
        } else {
          setListData(data);
        }
      },
      [data, labelField, searchQuery]
    );

    const onSelect = useCallback(
      (item: any) => {
        if (confirmSelectItem && onConfirmSelectItem) {
          return onConfirmSelectItem(item);
        }

        if (onChangeText) {
          setSearchText('');
        }
        onSearch('');
        setCurrentValue(item);
        onChange(item);
        eventClose();
      },
      [
        confirmSelectItem,
        eventClose,
        onChange,
        onChangeText,
        onConfirmSelectItem,
        onSearch,
      ]
    );

    const _renderDropdown = () => {
      const isSelected = currentValue && _.get(currentValue, valueField);
      return (
        <TouchableWithoutFeedback testID={testID} onPress={showOrClose}>
          <View style={styles.dropdown}>
            {renderLeftIcon?.()}
            <Text
              style={[
                styles.textItem,
                isSelected !== null ? selectedTextStyle : placeholderStyle,
                font(),
              ]}
              {...selectedTextProps}
            >
              {isSelected !== null
                ? _.get(currentValue, labelField)
                : placeholder}
            </Text>
            {renderRightIcon ? (
              renderRightIcon()
            ) : (
              <Image
                source={ic_down}
                style={[styles.icon, { tintColor: iconColor }, iconStyle]}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      );
    };

    const _renderItem = useCallback(
      ({ item, index }: { item: any; index: number }) => {
        const isSelected = currentValue && _.get(currentValue, valueField);
        const selected = _.isEqual(_.get(item, valueField), isSelected);
        return (
          <TouchableOpacity
            testID={_.get(item, itemTestIDField || labelField)}
            key={index.toString()}
            onPress={() => onSelect(item)}
            style={[
              itemContainerStyle,
              selected && {
                backgroundColor: activeColor,
              },
            ]}
          >
            {renderItem ? (
              renderItem(item, selected)
            ) : (
              <View style={styles.item}>
                <Text style={[styles.textItem, itemTextStyle, font()]}>
                  {_.get(item, labelField)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      },
      [
        activeColor,
        currentValue,
        font,
        itemContainerStyle,
        itemTestIDField,
        itemTextStyle,
        labelField,
        onSelect,
        renderItem,
        valueField,
      ]
    );

    const renderSearch = useCallback(() => {
      if (search) {
        if (renderInputSearch) {
          return renderInputSearch((text) => {
            if (onChangeText) {
              setSearchText(text);
              onChangeText(text);
            }
            onSearch(text);
          });
        } else {
          return (
            <CInput
              testID={testID + ' input'}
              style={[styles.input, inputSearchStyle]}
              inputStyle={[inputSearchStyle, font()]}
              autoCorrect={false}
              keyboardType={isIOS ? 'default' : 'visible-password'}
              placeholder={searchPlaceholder}
              onChangeText={(e) => {
                if (onChangeText) {
                  setSearchText(e);
                  onChangeText(e);
                }
                onSearch(e);
              }}
              placeholderTextColor="gray"
              iconStyle={[{ tintColor: iconColor }, iconStyle]}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                setFocus(false);
              }}
            />
          );
        }
      }
      return null;
    }, [
      font,
      iconColor,
      iconStyle,
      inputSearchStyle,
      onChangeText,
      onSearch,
      renderInputSearch,
      search,
      searchPlaceholder,
      testID,
    ]);

    const _renderListTop = useCallback(() => {
      return (
        <TouchableWithoutFeedback>
          <View style={styles.flexShrink}>
            <FlatList
              testID={testID + ' flatlist'}
              {...flatListProps}
              keyboardShouldPersistTaps="handled"
              ref={refList}
              onScrollToIndexFailed={scrollIndex}
              data={listData}
              inverted
              renderItem={_renderItem}
              keyExtractor={(_item, index) => index.toString()}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            />
            {renderSearch()}
          </View>
        </TouchableWithoutFeedback>
      );
    }, [
      _renderItem,
      flatListProps,
      listData,
      renderSearch,
      scrollIndex,
      showsVerticalScrollIndicator,
      testID,
    ]);

    const _renderListBottom = useCallback(() => {
      return (
        <TouchableWithoutFeedback>
          <View style={styles.flexShrink}>
            {renderSearch()}
            <FlatList
              testID={testID + ' flatlist'}
              {...flatListProps}
              keyboardShouldPersistTaps="handled"
              ref={refList}
              onScrollToIndexFailed={scrollIndex}
              data={listData}
              renderItem={_renderItem}
              keyExtractor={(_item, index) => index.toString()}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }, [
      _renderItem,
      flatListProps,
      listData,
      renderSearch,
      scrollIndex,
      showsVerticalScrollIndicator,
      testID,
    ]);

    const _renderModal = useCallback(() => {
      if (visible && position) {
        const { isFull, w, top, bottom, left, height } = position;
        if (w && top && bottom) {
          const styleVertical: ViewStyle = { left: left, maxHeight: maxHeight };
          const isTopPosition =
            dropdownPosition === 'auto'
              ? bottom < (isIOS ? 200 : search ? 310 : 300)
              : dropdownPosition === 'top'
              ? true
              : false;
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
              if (
                focus &&
                keyboardHeight > 0 &&
                bottom < keyboardHeight + height
              ) {
                if (isTopPosition) {
                  topHeight = H - keyboardHeight;
                } else {
                  keyboardStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
                  topHeight = H - keyboardHeight - 55;
                }
              }
            }
          }

          return (
            <Modal
              transparent
              statusBarTranslucent={statusBarIsTranslucent}
              visible={visible}
              supportedOrientations={['landscape', 'portrait']}
              onRequestClose={showOrClose}
            >
              <TouchableWithoutFeedback onPress={showOrClose}>
                <View
                  style={[
                    styles.flex1,
                    isFull && styleContainerVertical,
                    backgroundColor && { backgroundColor: backgroundColor },
                    keyboardStyle,
                  ]}
                >
                  <View
                    style={[
                      styles.wrapTop,
                      {
                        height: topHeight,
                        width: w,
                      },
                    ]}
                  >
                    {isTopPosition && (
                      <View
                        style={[
                          { width: w },
                          styles.container,
                          containerStyle,
                          isFull ? styleHorizontal : styleVertical,
                        ]}
                      >
                        {_renderListTop()}
                      </View>
                    )}
                  </View>
                  <View style={styles.flex1}>
                    {!isTopPosition && (
                      <View
                        style={[
                          { width: w },
                          styles.container,
                          containerStyle,
                          isFull ? styleHorizontal : styleVertical,
                        ]}
                      >
                        {_renderListBottom()}
                      </View>
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          );
        }
        return null;
      }
      return null;
    }, [
      visible,
      position,
      maxHeight,
      dropdownPosition,
      search,
      keyboardAvoiding,
      statusBarIsTranslucent,
      showOrClose,
      styleContainerVertical,
      backgroundColor,
      containerStyle,
      styleHorizontal,
      _renderListTop,
      _renderListBottom,
      renderInputSearch,
      keyboardHeight,
      H,
      focus,
    ]);

    return (
      <View style={[styles.mainWrap, style]} ref={ref} onLayout={_measure}>
        {_renderDropdown()}
        {_renderModal()}
      </View>
    );
  }
);

DropdownComponent.defaultProps = defaultProps;

export default DropdownComponent;
