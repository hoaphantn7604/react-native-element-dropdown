## react-native-element-dropdown
`react-native-element-dropdown` A react-native dropdown component easy to customize for both iOS and Android.
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
### IOS
```js
    cd ios && pod install
```

#### Demo
![](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/demo.png)
![](https://github.com/hoaphantn7604/file-upload/blob/master/document/dropdown/demo2.png)

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
| renderSelectedItem | (item, unSelect?: (item) => void) => JSX.Element      | No        |                  |

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

### Suggested Packages
- [react-native-utils-scale](https://www.npmjs.com/package/react-native-utils-scale) Provide solutions to make your app flexible for different screen sizes, different devices.
- [react-native-element-image](https://www.npmjs.com/package/react-native-element-image) Automatically calculate width or height based on input Image component for React Native.
- [react-native-element-textinput](https://www.npmjs.com/package/react-native-element-textinput) A react-native TextInput component easy to customize for both iOS and Android.
- [react-native-element-timer](https://www.npmjs.com/package/react-native-element-timer) React Native Timer Countdown.
- [react-native-vertical-swipe-view](https://www.npmjs.com/package/react-native-vertical-swipe-view) React Native Vertical Swipe View.
- [react-native-checkbox-tree](https://www.npmjs.com/package/react-native-checkbox-tree) A simple and elegant checkbox tree for React Native.
- [react-native-curved-bottom-bar](https://www.npmjs.com/package/react-native-curved-bottom-bar) A high performance, beautiful and fully customizable curved bottom navigation bar for React Native.
- [react-native-webrtc-simple](https://www.npmjs.com/package/react-native-webrtc-simple) A simple and easy to use module that help in making video call for React Native.