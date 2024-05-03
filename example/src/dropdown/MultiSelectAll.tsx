import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

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

const excludeItem = [
  { label: 'Item 7', value: '7', search: 'Item 7' },
  { label: 'Item 8', value: '8', search: 'Item 8' },
];

const MultiSelectComponent = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const ref = useRef(null);

  const onSelectAll = (isSelectAll = true) => {
    const selectItem: string[] = [];
    if (isSelectAll) {
      data.map((item) => {
        selectItem.push(item.value);
      });
    }
    setSelected(selectItem);
  };

  const renderSelectAllIcon = () => {
    const isSelectAll = selected.length === data.length;
    return (
      <TouchableOpacity
        style={styles.wrapSelectAll}
        onPress={() => onSelectAll(!isSelectAll)}
      >
        <Text style={styles.txtSelectAll}>
          {isSelectAll ? `UnSelect All` : 'Select All'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        inside
        ref={ref}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        backgroundColor={'rgba(0,0,0,0.2)'}
        search
        data={data}
        excludeItems={excludeItem}
        labelField="label"
        valueField="value"
        placeholder="Multiselect All"
        searchPlaceholder="Search..."
        value={selected}
        onChange={(item) => {
          setSelected(item);
        }}
        selectedStyle={styles.selectedStyle}
        flatListProps={{ ListHeaderComponent: renderSelectAllIcon }}
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  wrapSelectAll: {
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  txtSelectAll: {
    color: 'blue',
  },
});
