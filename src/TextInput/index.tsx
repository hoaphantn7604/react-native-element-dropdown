import React, { useEffect, useState } from 'react';
import {
  Image, TextInput,
  TouchableOpacity, View,
  Text
} from 'react-native';
import { CTextInput } from './type';
import { useScale } from '../utilsScale';
import { styles } from './styles';

const { scale } = useScale;
const ic_close= require('./icon/close.png');

const defaultProps = {
  style: {},
  value: '',
  showIcon: true,
  currency: false,
  numeric: false,
};

const TextInputComponent: CTextInput = (props) => {
  const {
    fontFamily,
    style,
    value,
    label,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    currency,
    numeric,
    labelStyle,
    unitCurrency,
    textErrorStyle,
    textError,
    onChangeText = (value: string) => {},
    renderLeftIcon,
    renderRightIcon,
  } = props;

  const [text, setText] = useState<string>('');
  
  useEffect(() => {
    if (value) {
      if (currency || numeric) {
        setText(formatCurrency(value));
      } else {
        setText(value);
      }
    }
  }, []);

  const formatCurrency = (num: string) => {
    const values = num.toString().replace(/\D/g, '');
    return values.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const reConvertCurrency = (x: string) => {
    let s;
    s = x.split('.');
    s = s.join('');
    return s;
  };

  const onChange = (text: string) => {
    if (currency || numeric) {
      setText(formatCurrency(text));
      onChangeText(reConvertCurrency(text));
    } else {
      setText(text);
      onChangeText(text);
    }
  };

  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return (
          renderRightIcon()
        );
      }
      return (
        <TouchableOpacity onPress={() => onChange('')}>
          <Image source={ic_close} style={[styles.icon, iconStyle]} />
        </TouchableOpacity>)
      
    }
    return null;
  };

  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      }
    } else {
      return {}
    }
  }

  return (
    <View>
      <View style={[style]}>
        {label && (
          <Text style={[styles.label, labelStyle]}>
            {label}
          </Text>
        )}
        <View style={styles.textInput}>
          {renderLeftIcon?.()}
          {currency && unitCurrency && (
            <Text style={{ marginRight: scale(3) }}>
              {unitCurrency}
            </Text>
          )}
          <TextInput
            {...props}
            style={[styles.input, inputStyle, font()]}
            value={text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            onChangeText={onChange}
          />
          {_renderRightIcon()}
        </View>
      </View>
      {textError && <Text style={[styles.textError, textErrorStyle]}>{textError}</Text>}
    </View>
  );
};

TextInputComponent.defaultProps = defaultProps;

export default TextInputComponent;
