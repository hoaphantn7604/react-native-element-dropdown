/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import type { CTextInput } from './model';
import { styles } from './styles';

const ic_close = require('../../assets/close.png');

const TextInputComponent: CTextInput = (props) => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = (_value: string) => {},
    renderLeftIcon,
    renderRightIcon,
  } = props;

  const [text, setText] = useState<string>('');

  useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);

  const onChange = (text: string) => {
    setText(text);
    onChangeText(text);
  };

  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon();
      }
      if (text.length > 0) {
        return (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onChange('')}
          >
            <Image
              source={ic_close}
              style={StyleSheet.flatten([styles.icon, iconStyle])}
            />
          </TouchableOpacity>
        );
      }
      return null;
    }
    return null;
  };

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily,
      };
    } else {
      return {};
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={[style]}>
        <View style={styles.textInput}>
          {renderLeftIcon?.()}
          <TextInput
            {...props}
            style={StyleSheet.flatten([styles.input, inputStyle, font()])}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
          />
          {_renderRightIcon()}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TextInputComponent;
