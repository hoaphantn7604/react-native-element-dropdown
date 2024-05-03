import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
  { label: 'Item 5', value: '5' },
  { label: 'Item 6', value: '6' },
  { label: 'Item 7', value: '7' },
  { label: 'Item 8', value: '8' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState<string>();
  const ref = useRef<IDropdownRef>(null);

  return (
    <View style={styles.row}>
      <Dropdown
        ref={ref}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Dropdown 2"
        searchPlaceholder="Search..."
        value={value}
        closeModalWhenSelectedItem={false}
        onChange={(item) => {
          setValue(item.value);
        }}
        onChangeText={() => {}} // Keep search keyword
      />
      <View style={styles.button}>
        <Button
          title="Open"
          onPress={() => {
            ref.current?.open();
          }}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    flex: 1,
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    marginHorizontal: 16,
  },
});
