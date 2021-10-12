import React, {useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {
  Dropdown,
  MultiSelect,
  SelectCountry,
} from 'react-native-element-dropdown';

const data = [
  {value: '1', label: 'Item 1'},
  {value: '2', label: 'Item 2'},
  {value: '3', label: 'Item 3'},
  {value: '4', label: 'Item 4'},
  {value: '5', label: 'Item 5'},
  {value: '6', label: 'Item 6'},
  {value: '7', label: 'Item 7'},
  {value: '8', label: 'Item 8'},
];

const local_data = [
  {
    value: '1',
    lable: 'Country 1',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '2',
    lable: 'Country 2',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '3',
    lable: 'Country 3',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '4',
    lable: 'Country 4',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '5',
    lable: 'Country 5',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '6',
    lable: 'Country 6',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '7',
    lable: 'Country 7',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '8',
    lable: 'Country 8',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
  {
    value: '9',
    lable: 'Country 9',
    image: {
      uri: 'https://www.atlantawatershed.org/wp-content/uploads/2017/06/default-placeholder.png',
    },
  },
];

const DropdownScreen = _props => {
  const [dropdown, setDropdown] = useState(null);
  const [selected, setSelected] = useState(null);
  const [country, setCountry] = useState(null);

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
        style={styles.dropdown}
        data={data}
        search
        searchPlaceholder="Search"
        labelField="label"
        valueField="value"
        placeholder="Select item"
        value={dropdown}
        onChange={item => {
          setDropdown(item.value);
          console.log('selected', item);
        }}
        renderLeftIcon={() => (
          <Image style={styles.icon} source={require('./assets/account.png')} />
        )}
        renderItem={item => _renderItem(item)}
      />

      <SelectCountry
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        search
        value={country}
        data={local_data}
        valueField="value"
        labelField="lable"
        imageField="image"
        placeholder="Select item"
        searchPlaceholder="Search..."
        onChange={e => {
          setCountry(e.value);
        }}
      />

      <MultiSelect
        style={styles.dropdown2}
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        search
        searchPlaceholder="Search"
        value={selected}
        onChange={item => {
          setSelected(item);
          console.log('selected', item);
        }}
        renderItem={item => _renderItem(item)}
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
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 20,
  },
  dropdown2: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginTop: 20,
    padding: 8,
  },
  icon: {
    marginRight: 5,
    width: 18,
    height: 18,
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
  selectedText: {
    marginLeft: 8,
  },
});
