/* eslint-disable @typescript-eslint/no-shadow */
import _ from 'lodash';
import React, {
  JSXElementConstructor,
  ReactElement,
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
  I18nManager,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { useDetectDevice } from '../../toolkits';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import CInput from '../TextInput';
import { MultiSelectProps } from './model';
import { styles } from './styles';

const { isTablet } = useDetectDevice;
const ic_down = require('../../assets/down.png');
const statusBarHeight: number = StatusBar.currentHeight || 0;

const MultiSelectComponent: <T>(
  props: MultiSelectProps<T>
) => ReactElement<any, string | JSXElementConstructor<any>> | null =
  React.forwardRef((props, currentRef) => {
    const orientation = useDeviceOrientation();
    const {
      testID,
      itemTestIDField,
      onChange,
      data = [],
      value,
      style = {},
      labelField,
      valueField,
      searchField,
      selectedStyle,
      selectedTextStyle,
      itemContainerStyle,
      itemTextStyle,
      iconStyle,
      activeColor = '#F6F7F8',
      containerStyle,
      fontFamily,
      placeholderStyle,
      iconColor = 'gray',
      inputSearchStyle,
      searchPlaceholder,
      placeholder = 'Select item',
      search = false,
      maxHeight = 340,
      minHeight = 0,
      maxSelect,
      disable = false,
      keyboardAvoiding = true,
      inside = false,
      inverted = true,
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
      alwaysRenderSelectedItem = false,
      searchQuery,
      backgroundColor,
      onChangeText,
      confirmSelectItem,
      confirmUnSelectItem,
      onConfirmSelectItem,
      accessibilityLabel,
      itemAccessibilityLabelField,
      visibleSelectedItem = true,
      mode = 'default',
    } = props;

    const ref = useRef<View>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [currentValue, setCurrentValue] = useState<any[]>([]);
    const [listData, setListData] = useState<any[]>(data);
    const [, setKey] = useState<number>(Math.random());
    const [position, setPosition] = useState<any>();
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
        width: orientation === 'LANDSCAPE' ? W / 2 : '100%',
        alignSelf: 'center',
      };
    }, [W, orientation]);

    useImperativeHandle(currentRef, () => {
      return { open: eventOpen, close: eventClose };
    });

    useEffect(() => {
      return eventClose;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        if (searchText.length > 0) {
          onSearch(searchText);
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
        ref.current.measureInWindow((pageX, pageY, width, height) => {
          let isFull = isTablet
            ? false
            : mode === 'modal' || orientation === 'LANDSCAPE';

          if (mode === 'auto') {
            isFull = false;
          }

          const top = isFull ? 20 : height + pageY + 2;
          const bottom = H - top + height;
          const left = I18nManager.isRTL ? W - width - pageX : pageX;

          setPosition({
            isFull,
            width: Math.floor(width),
            top: Math.floor(top + statusBarHeight),
            bottom: Math.floor(bottom - statusBarHeight),
            left: Math.floor(left),
            height: Math.floor(height),
          });
        });
      }
    }, [H, W, orientation, mode]);

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
        }

        if (typeof susbcriptionKeyboardDidHide?.remove === 'function') {
          susbcriptionKeyboardDidHide.remove();
        }
      };
    }, [onKeyboardDidHide, onKeyboardDidShow]);

    useEffect(() => {
      getValue();
    }, [getValue, value]);

    const showOrClose = useCallback(() => {
      if (!disable) {
        if (keyboardHeight > 0 && visible) {
          return Keyboard.dismiss();
        }

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

        if (searchText.length > 0) {
          onSearch(searchText);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      disable,
      keyboardHeight,
      visible,
      _measure,
      data,
      searchText,
      onFocus,
      onBlur,
    ]);

    const onSearch = useCallback(
      (text: string) => {
        if (text.length > 0) {
          const defaultFilterFunction = (e: any) => {
            const item = _.get(e, searchField || labelField)
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
            const labelText = _.get(e, searchField || labelField);

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
      [data, searchField, labelField, searchQuery]
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
        <TouchableWithoutFeedback
          testID={testID}
          accessible={!!accessibilityLabel}
          accessibilityLabel={accessibilityLabel}
          onPress={showOrClose}
        >
          <View style={styles.dropdown}>
            {renderLeftIcon?.(visible)}
            <Text
              style={StyleSheet.flatten([
                styles.textItem,
                placeholderStyle,
                font(),
              ])}
            >
              {placeholder}
            </Text>
            {renderRightIcon ? (
              renderRightIcon(visible)
            ) : (
              <Image
                source={ic_down}
                style={StyleSheet.flatten([
                  styles.icon,
                  { tintColor: iconColor },
                  iconStyle,
                ])}
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
        _.assign(item, { _index: index });
        return (
          <TouchableHighlight
            key={index.toString()}
            testID={_.get(item, itemTestIDField || labelField)}
            accessible={!!accessibilityLabel}
            accessibilityLabel={_.get(
              item,
              itemAccessibilityLabelField || labelField
            )}
            underlayColor={activeColor}
            onPress={() => onSelect(item)}
          >
            <View
              style={StyleSheet.flatten([
                itemContainerStyle,
                selected && {
                  backgroundColor: activeColor,
                  ...styles.wrapItem,
                },
              ])}
            >
              {renderItem ? (
                renderItem(item, selected)
              ) : (
                <View style={styles.item}>
                  <Text
                    style={StyleSheet.flatten([
                      styles.textItem,
                      itemTextStyle,
                      font(),
                    ])}
                  >
                    {_.get(item, labelField)}
                  </Text>
                </View>
              )}
            </View>
          </TouchableHighlight>
        );
      },
      [
        accessibilityLabel,
        activeColor,
        checkSelected,
        font,
        itemAccessibilityLabelField,
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
              accessibilityLabel={accessibilityLabel + ' input'}
              style={[styles.input, inputSearchStyle]}
              inputStyle={[inputSearchStyle, font()]}
              autoCorrect={false}
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
            />
          );
        }
      }
      return null;
    }, [
      accessibilityLabel,
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

    const _renderList = useCallback(
      (isTopPosition: boolean) => {
        const isInverted = !inverted ? false : isTopPosition;

        const _renderListHelper = () => {
          return (
            <FlatList
              testID={testID + ' flatlist'}
              accessibilityLabel={accessibilityLabel + ' flatlist'}
              {...flatListProps}
              keyboardShouldPersistTaps="handled"
              data={listData}
              inverted={isTopPosition ? inverted : false}
              renderItem={_renderItem}
              keyExtractor={(_item, index) => index.toString()}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            />
          );
        };

        return (
          <TouchableWithoutFeedback>
            <View style={styles.flexShrink}>
              {isInverted && _renderListHelper()}
              {renderSearch()}
              {!isInverted && _renderListHelper()}
            </View>
          </TouchableWithoutFeedback>
        );
      },
      [
        _renderItem,
        accessibilityLabel,
        flatListProps,
        listData,
        inverted,
        renderSearch,
        showsVerticalScrollIndicator,
        testID,
      ]
    );

    const _renderModal = useCallback(() => {
      if (visible && position) {
        const { isFull, width, height, top, bottom, left } = position;

        const onAutoPosition = () => {
          if (keyboardHeight > 0) {
            return bottom < keyboardHeight + height;
          }

          return bottom < (search ? 150 : 100);
        };

        if (width && top && bottom) {
          const styleVertical: ViewStyle = {
            left: left,
            maxHeight: maxHeight,
            minHeight: minHeight,
          };
          const isTopPosition =
            dropdownPosition === 'auto'
              ? onAutoPosition()
              : dropdownPosition === 'top';

          let keyboardStyle: ViewStyle = {};

          let extendHeight = !isTopPosition ? top : bottom;
          if (
            keyboardAvoiding &&
            keyboardHeight > 0 &&
            isTopPosition &&
            dropdownPosition === 'auto'
          ) {
            extendHeight = keyboardHeight;
          }

          return (
            <Modal
              transparent
              statusBarTranslucent
              visible={visible}
              supportedOrientations={['landscape', 'portrait']}
              onRequestClose={showOrClose}
            >
              <TouchableWithoutFeedback onPress={showOrClose}>
                <View
                  style={StyleSheet.flatten([
                    styles.flex1,
                    isFull && styleContainerVertical,
                    backgroundColor && { backgroundColor: backgroundColor },
                    keyboardStyle,
                  ])}
                >
                  <View
                    style={StyleSheet.flatten([
                      styles.flex1,
                      {
                        width,
                      },
                      !isTopPosition
                        ? { paddingTop: extendHeight }
                        : {
                            justifyContent: 'flex-end',
                            paddingBottom: extendHeight,
                          },
                      isFull && styles.fullScreen,
                    ])}
                  >
                    <View
                      style={StyleSheet.flatten([
                        styles.container,
                        isFull ? styleHorizontal : styleVertical,
                        containerStyle,
                      ])}
                    >
                      {_renderList(isTopPosition)}
                    </View>
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
      search,
      position,
      keyboardHeight,
      maxHeight,
      minHeight,
      dropdownPosition,
      keyboardAvoiding,
      showOrClose,
      styleContainerVertical,
      backgroundColor,
      containerStyle,
      styleHorizontal,
      _renderList,
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
        <View
          style={StyleSheet.flatten([
            styles.rowSelectedItem,
            inside && styles.flex1,
          ])}
        >
          {list.map((e) => {
            if (renderSelectedItem) {
              return (
                <TouchableWithoutFeedback
                  testID={_.get(e, itemTestIDField || labelField)}
                  accessible={!!accessibilityLabel}
                  accessibilityLabel={_.get(
                    e,
                    itemAccessibilityLabelField || labelField
                  )}
                  key={_.get(e, labelField)}
                  onPress={() => unSelect(e)}
                >
                  {renderSelectedItem(e, () => {
                    unSelect(e);
                  })}
                </TouchableWithoutFeedback>
              );
            } else {
              return (
                <TouchableWithoutFeedback
                  testID={_.get(e, itemTestIDField || labelField)}
                  accessible={!!accessibilityLabel}
                  accessibilityLabel={_.get(
                    e,
                    itemAccessibilityLabelField || labelField
                  )}
                  key={_.get(e, labelField)}
                  onPress={() => unSelect(e)}
                >
                  <View
                    style={StyleSheet.flatten([
                      styles.selectedItem,
                      selectedStyle,
                    ])}
                  >
                    <Text
                      style={StyleSheet.flatten([
                        styles.selectedTextLeftItem,
                        selectedTextStyle,
                        font(),
                      ])}
                    >
                      {_.get(e, labelField)}
                    </Text>
                    <Text
                      style={StyleSheet.flatten([
                        styles.selectedTextItem,
                        selectedTextStyle,
                      ])}
                    >
                      ⓧ
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            }
          })}
        </View>
      );
    };

    const _renderInside = () => {
      return (
        <View
          style={StyleSheet.flatten([styles.mainWrap, style])}
          ref={ref}
          onLayout={_measure}
        >
          {_renderDropdownInside()}
          {_renderModal()}
        </View>
      );
    };

    const _renderDropdownInside = () => {
      return (
        <TouchableWithoutFeedback
          testID={testID}
          accessible={!!accessibilityLabel}
          accessibilityLabel={accessibilityLabel}
          onPress={showOrClose}
        >
          <View style={styles.dropdownInside}>
            {renderLeftIcon?.()}
            {value && value?.length > 0 ? (
              _renderItemSelected(true)
            ) : (
              <Text
                style={StyleSheet.flatten([
                  styles.textItem,
                  placeholderStyle,
                  font(),
                ])}
              >
                {placeholder}
              </Text>
            )}
            {renderRightIcon ? (
              renderRightIcon()
            ) : (
              <Image
                source={ic_down}
                style={StyleSheet.flatten([
                  styles.icon,
                  { tintColor: iconColor },
                  iconStyle,
                ])}
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
        <View
          style={StyleSheet.flatten([styles.mainWrap, style])}
          ref={ref}
          onLayout={_measure}
        >
          {_renderDropdown()}
          {_renderModal()}
        </View>
        {(!visible || alwaysRenderSelectedItem) &&
          visibleSelectedItem &&
          _renderItemSelected(false)}
      </>
    );
  });

export default MultiSelectComponent;
