import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const RenderEmpty = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text>List Empty!</Text>
    </View>
  );
};

const RenderFooter = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.footerContainer}>
      <ActivityIndicator color={'gray'} size={'large'} />
    </View>
  );
};

const DropdownComponent = () => {
  const [data, setData] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const ref: RefObject<any> = useRef(null);

  const fetchApi = async (url: string, isRefresh: boolean = false) => {
    try {
      const response = await fetch(url);
      const json = await response.json();

      if (json) {
        if (isRefresh) {
          setData([]);
        }

        setNextPage(json?.next);
        setData((pre: any) => [...pre, ...json?.results]);

        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const onRefresh = () => {
    fetchApi('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0', true);
  };

  const onLoadMore = () => {
    if (!isSearch) {
      setIsLoading(true);
      fetchApi(nextPage);
    }
  };

  useEffect(() => {
    fetchApi('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
  }, []);

  return (
    <Dropdown
      ref={ref}
      style={styles.dropdown}
      containerStyle={styles.container}
      backgroundColor={'rgba(0,0,0,0.2)'}
      data={data}
      value={value}
      labelField="name"
      valueField="url"
      placeholder="Lazy Load Dropdown"
      search
      maxHeight={250}
      searchPlaceholder="Search..."
      onChange={(item) => {
        setValue(item);
        setIsSearch(false);
      }}
      onChangeText={(keyword) => {
        setIsSearch(keyword.length > 0);
      }}
      flatListProps={{
        ListEmptyComponent: <RenderEmpty />,
        ListFooterComponent: <RenderFooter isLoading={isLoading} />,
        refreshControl: (
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        ),
        onEndReachedThreshold: 0.5,
        onEndReached: onLoadMore,
      }}
      confirmSelectItem
      onConfirmSelectItem={(item) => {
        Alert.alert('Confirm', 'Message', [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Ok',
            onPress: () => {
              setValue(item);
              setIsSearch(false);
              ref.current?.close();
            },
          },
        ]);
      }}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: '#DDDDDD',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  container: {
    marginTop: 4,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
  },
});

export default DropdownComponent;
