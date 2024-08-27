import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import DropdownExample1 from './dropdown/Dropdown1';
import DropdownExample2 from './dropdown/Dropdown2';
import Menu from './dropdown/Menu';
import DropdownWithConfirm from './dropdown/DropdownWithConfirm';
import CountrySelect1 from './dropdown/CountrySelect1';
import CountrySelect2 from './dropdown/CountrySelect2';
import MultiSelectAll from './dropdown/MultiSelectAll';
import MultiSelectWithConfirm from './dropdown/MultiSelectWithConfirm';
import DropdownLazyLoad from './dropdown/DropdownLazyLoad';
import DropDowCustomValue from './dropdown/DropDowCustomValue.';
const DropdownScreen = (_props: any) => {
  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Menu />
        <DropDowCustomValue />
        <DropdownExample1 />
        <DropdownExample2 />
        <DropdownWithConfirm />
        <DropdownLazyLoad />
        <CountrySelect1 />
        <CountrySelect2 />
        <MultiSelectAll />
        <MultiSelectWithConfirm />
      </ScrollView>
    </View>
  );
};

export default DropdownScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 50,
  },
});
