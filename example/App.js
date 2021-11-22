import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import Example1 from './dropdown/example1';
import Example2 from './dropdown/example2';
import Example3 from './dropdown/example3';
import Example4 from './dropdown/example4';
import Example5 from './dropdown/example5';
import Example6 from './dropdown/example6';
import Example7 from './dropdown/example7';

const DropdownScreen = _props => {
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Example1 />
        <Example2 />
        <Example3 />
        <Example4 />
        <Example5 />
        <Example6 />
        <Example7 />
      </ScrollView>
    </View>
  );
};

export default DropdownScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
