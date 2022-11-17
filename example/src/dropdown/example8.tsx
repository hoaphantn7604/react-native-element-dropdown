import React, { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = () => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState(null);
  const [nextApi, setNextApi] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  const fetchApi = async (apiUrl: string) => {
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();

      setData((pre: any) => [...pre, ...json.results]);
      setNextApi(json.next);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchApi(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`);
  }, []);

  const reFreshData = () => {
    setData([]);
    fetchApi(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`);
  };

  return (
    <Dropdown
      statusBarIsTranslucent={true}
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="name"
      valueField="url"
      placeholder="Select item"
      searchPlaceholder="Search..."
      value={value}
      autoScroll={false}
      onChange={(item) => {
        setValue(item);
      }}
      flatListProps={{
        refreshControl: (
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              reFreshData();
            }}
          />
        ),
        onEndReachedThreshold: 0.5,
        onEndReached: () => {
          if (!isSearch) {
            fetchApi(nextApi);
          }
        },
      }}
      onChangeText={(keyword: string) => {
        setIsSearch(keyword.length > 0);
      }}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
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
});
