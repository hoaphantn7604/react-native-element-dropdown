import React, {useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Dropdown from 'react-native-element-dropdown';

const data = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

const DropdownScreen = _props => {
  const [dropdown, setDropdown] = useState(null);
  const [dropdown1, setDropdown1] = useState(null);

  const _renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        <Image style={styles.icon} source={require('./assets/tick.png')} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Dropdown
        data={data}
        containerStyle={styles.shadow}
        labelField="label"
        valueField="value"
        label="Title"
        placeholder="Select item"
        value={dropdown}
        onChange={item => {
          setDropdown(item.value);
          console.log('selected', item);
        }}
      />

      <Dropdown
        style={styles.dropdown2}
        containerStyle={styles.shadow}
        data={data}
        search
        searchPlaceholder="Search"
        labelField="label"
        valueField="value"
        label="Title"
        placeholder="Select item"
        value={dropdown1}
        onChange={item => {
          setDropdown1(item.value);
          console.log('selected', item);
        }}
        renderLeftIcon={() => (
          <Image style={styles.icon} source={require('./assets/account.png')} />
        )}
        renderItem={item => _renderItem(item)}
        textError="Error"
      />
    </View>
  );
};

export default DropdownScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 40,
  },
  dropdown: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
  },
  dropdown2: {
    backgroundColor: 'transparent',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 20,
  },
  icon: {
    marginRight: 5,
    width: 24,
    height: 24,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
