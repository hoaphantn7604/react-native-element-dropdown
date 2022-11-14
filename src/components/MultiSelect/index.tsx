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
import type { MultiSelectProps } from './model';
import _ from 'lodash';

const { isTablet, isIOS } = useDetectDevice;
const ic_down = require('../../assets/down.png');

const defaultProps = {
  placeholder: 'Select item',
  activeColor: '#F6F7F8',
  data: [],
  style: {},
};

const MultiSelectComponent = React.forwardRef<any, MultiSelectProps>(
  (props, currentRef) => {
    const orientation = useDeviceOrientation();
    const {
      testID,
      itemTestIDField,
      onChange,
      data,
      value,
      style,
      labelField,
      valueField,
      selectedStyle,
      selectedTextStyle,
      itemContainerStyle,
      itemTextStyle,
      iconStyle,
      activeColor,
      containerStyle,
      fontFamily,
      placeholderStyle,
      iconColor = 'gray',
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
      searchQuery,
      statusBarIsTranslucent,
      backgroundColor,
      onChangeText,
      confirmSelectItem,
      confirmUnSelectItem,
      onConfirmSelectItem,
    } = props;

    const ref = useRef<View>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<any[]>([]);
    const [listData, setListData] = useState<any[]>(data);
    const [, setKey] = useState<number>(Math.random());
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
      return { marginBottom: 20, width: W / 2, alignSelf: 'center' };
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

    const eventClose = () => {
      if (!disable) {
        setVisible(false);
        if (onBlur) {
          onBlur();
        }
      }
    };

    const font = useCallback(() => {
      if (fontFamily) {
        return {
          fontFamily: fontFamily,
        };
      } else {
        return {};
      }
    }, [fontFamily]);

    const getValue = useCallback(() => {
      setCurrentValue(value ? [...value] : []);
    }, [value]);

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

    useEffect(() => {
      getValue();
    }, [getValue, value]);

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
    }, [_measure, data, disable, onBlur, onFocus, visible]);

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
        const newCurrentValue = [...currentValue];
        const index = newCurrentValue.findIndex(
          (e) => e === _.get(item, valueField)
        );
        if (index > -1) {
          newCurrentValue.splice(index, 1);
        } else {
          if (maxSelect) {
            if (newCurrentValue.length < maxSelect) {
              newCurrentValue.push(_.get(item, valueField));
            }
          } else {
            newCurrentValue.push(_.get(item, valueField));
          }
        }

        if (onConfirmSelectItem) {
          if (index > -1) {
            if (confirmUnSelectItem) {
              onConfirmSelectItem(newCurrentValue);
            } else {
              onChange(newCurrentValue);
            }
          } else {
            if (confirmSelectItem) {
              onConfirmSelectItem(newCurrentValue);
            } else {
              onChange(newCurrentValue);
            }
          }
        } else {
          onChange(newCurrentValue);
        }

        setKey(Math.random());
      },
      [
        confirmSelectItem,
        confirmUnSelectItem,
        currentValue,
        maxSelect,
        onChange,
        onConfirmSelectItem,
        valueField,
      ]
    );

    const _renderDropdown = () => {
      return (
        <TouchableWithoutFeedback testID={testID} onPress={showOrClose}>
          <View style={styles.dropdown}>
            {renderLeftIcon?.()}
            <Text style={[styles.textItem, placeholderStyle, font()]}>
              {placeholder}
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

    const checkSelected = useCallback(
      (item: any) => {
        const index = currentValue.findIndex(
          (e) => e === _.get(item, valueField)
        );
        return index > -1;
      },
      [currentValue, valueField]
    );

    const _renderItem = useCallback(
      ({ item, index }: { item: any; index: number }) => {
        const selected = checkSelected(item);
        return (
          <TouchableOpacity
            testID={_.get(item, itemTestIDField || labelField)}
            key={index.toString()}
            onPress={() => onSelect(item)}
            style={[
              itemContainerStyle,
              selected && {
                backgroundColor: activeColor,
                ...styles.wrapItem,
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
        checkSelected,
        font,
        itemContainerStyle,
        itemTestIDField,
        itemTextStyle,
        labelField,
        onSelect,
        renderItem,
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
        <View style={[styles.rowSelectedItem, inside && styles.flex1]}>
          {list.map((e) => {
            if (renderSelectedItem) {
              return (
                <TouchableOpacity
                  testID={_.get(e, itemTestIDField || labelField)}
                  key={_.get(e, labelField)}
                  onPress={() => unSelect(e)}
                >
                  {renderSelectedItem(e, () => {
                    unSelect(e);
                  })}
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  testID={_.get(e, itemTestIDField || labelField)}
                  key={_.get(e, labelField)}
                  style={[styles.selectedItem, selectedStyle]}
                  onPress={() => unSelect(e)}
                >
                  <Text
                    style={[
                      styles.selectedTextLeftItem,
                      selectedTextStyle,
                      font(),
                    ]}
                  >
                    {_.get(e, labelField)}
                  </Text>
                  <Text style={[styles.selectedTextItem, selectedTextStyle]}>
                    ⓧ
                  </Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      );
    };

    const _renderInside = () => {
      return (
        <View style={[styles.mainWrap, style]} ref={ref} onLayout={_measure}>
          {_renderDropdownInside()}
          {_renderModal()}
        </View>
      );
    };

    const _renderDropdownInside = () => {
      return (
        <TouchableWithoutFeedback testID={testID} onPress={showOrClose}>
          <View style={styles.dropdownInside}>
            {renderLeftIcon?.()}
            {value && value?.length > 0 ? (
              _renderItemSelected(true)
            ) : (
              <Text style={[styles.textItem, placeholderStyle, font()]}>
                {placeholder}
              </Text>
            )}
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

    if (inside) {
      return _renderInside();
    }

    return (
      <>
        <View style={[styles.mainWrap, style]} ref={ref} onLayout={_measure}>
          {_renderDropdown()}
          {_renderModal()}
        </View>
        {(!visible || alwaysRenderItemSelected) && _renderItemSelected(false)}
      </>
    );
  }
);

MultiSelectComponent.defaultProps = defaultProps;

export default MultiSelectComponent;
