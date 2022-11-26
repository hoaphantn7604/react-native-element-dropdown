import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import DropdownExample1 from './dropdown/example1';
import DropdownExample2 from './dropdown/example2';
import DropdownWithConfirm from './dropdown/example3';
import CountrySelect1 from './dropdown/example4';
import CountrySelect2 from './dropdown/example5';
import MultiSelect1 from './dropdown/example6';
import MultiSelectWithConfirm from './dropdown/example7';
import DropdownLazyLoad from './dropdown/example8';

const DropdownScreen = (_props: any) => {
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <DropdownExample1 />
        <DropdownExample2 />
        <DropdownWithConfirm />
        <CountrySelect1 />
        <CountrySelect2 />
        <MultiSelect1 />
        <MultiSelectWithConfirm />
        <DropdownLazyLoad />
      </ScrollView>
    </View>
  );
};

export default DropdownScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
  },
});
