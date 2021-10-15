## react-native-element-dropdown
A React Native dropdown component easy to customize for both iOS and Android.

## Getting started
```js
    npm install react-native-element-dropdown --save
```
or

```js
    yarn add react-native-element-dropdown
```

### RN Version < 0.60
```js
    react-native link react-native-element-dropdown
```
### Build IOS
```js
    - pod install
    - react-native run-ios
```
### Build Android
```js
    - react-native run-android
```


#### Source code demo
- [react-native-template-components](https://github.com/hoaphantn7604/react-native-template-components) A beautiful template for React Native.
#### Demo
![](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/demo.gif)

#### Dropdown Props
| Props              | Params               | isRequire | Description      |
| ------------------ | -------------------- | --------- | ---------------- |
| data               | Array                | Yes       |                  |
| labelField         | String               | Yes       |                  |
| valueField         | String               | Yes       |                  |
| onChange           | (item) => void       | Yes       |                  |
| value              | Item                 | No        |                  |
| placeholder        | String               | No        |                  |
| placeholderStyle   | TextStyle            | No        |                  |
| selectedTextStyle  | TextStyle            | No        |                  |
| selectedTextProps  | TextProps            | No        |                  |
| style              | ViewStyle            | No        |                  |
| containerStyle     | ViewStyle            | No        |                  |
| fontFamily         | String               | No        |                  |
| iconColor          | String               | No        |                  |
| activeColor        | String               | No        |                  |
| search             | Boolean              | No        |                  |
| inputSearchStyle   | ViewStyle            | No        |                  |
| searchPlaceholder  | String               | No        |                  |
| maxHeight          | Number               | No        |                  |
| disable            | Boolean              | No        |                  |
| renderLeftIcon     | () => JSX.Element    | No        |                  |
| renderRightIcon    | () => JSX.Element    | No        |                  |
| renderItem         | (item) => JSX.Element| No        |                  |
| onFocus            | () => void           | No        |                  |
| onBlur             | () => void           | No        |                  |

#### MultiSelect Props
| Props              | Params                                               | isRequire | Description      |
| ------------------ | -----------------------------------------------------| --------- | ---------------- |
| data               | Array                                                | Yes       |                  |
| labelField         | String                                               | Yes       |                  |
| valueField         | String                                               | Yes       |                  |
| onChange           | (value[]) => void                                    | Yes       |                  |
| value              | Item[]                                               | No        |                  |
| placeholder        | String                                               | No        |                  |
| placeholderStyle   | TextStyle                                            | No        |                  |
| style              | ViewStyle                                            | No        |                  |
| containerStyle     | ViewStyle                                            | No        |                  |
| fontFamily         | String                                               | No        |                  |
| iconColor          | String                                               | No        |                  |
| activeColor        | String                                               | No        |                  |
| selectedStyle      | ViewStyle                                            | No        |                  |
| selectedTextStyle  | TextStyle                                            | No        |                  |
| search             | Boolean                                              | No        |                  |
| inputSearchStyle   | ViewStyle                                            | No        |                  |
| searchPlaceholder  | String                                               | No        |                  |
| maxHeight          | Number                                               | No        |                  |
| disable            | Boolean                                              | No        |                  |
| renderLeftIcon     | () => JSX.Element                                    | No        |                  |
| renderRightIcon    | () => JSX.Element                                    | No        |                  |
| renderItem         | (item) => JSX.Element                                | No        |                  |
| renderSelectedItem | (item, unSelect?: (item) => void) => JSX.Element     | No        |                  |
| onFocus            | () => void                                           | No        |                  |
| onBlur             | () => void                                           | No        |                  |


#### SelectCountry extends Dropdown 
| Props              | Params               | isRequire | Description      |
| ------------------ | -------------------- | --------- | ---------------- |
| imageField         | String               | Yes       |                  |
| imageStyle         | ImageStyle           | No        |                  |


## Usage
```javascript
    import React, {useState} from 'react';
    import {StyleSheet, View, Text, Image} from 'react-native';
    import {Dropdown, MultiSelect} from 'react-native-element-dropdown';

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
        const [selected, setSelected] = useState([]);

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
    });
```