# react-native-element-dropdown

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
| style              | ViewStyle            | No        |                  |
| containerStyle     | ViewStyle            | No        |                  |
| fontFamily         | String               | No        |                  |
| labelStyle         | TextStyle            | No        |                  |
| iconColor          | String               | No        |                  |
| activeColor        | String               | No        |                  |
| value              | Item[]               | No        |                  |
| label              | String               | No        |                  |
| placeholder        | String               | No        |                  |
| placeholderStyle   | TextStyle            | No        |                  |
| search             | Boolean              | No        |                  |
| inputSearchStyle   | ViewStyle            | No        |                  |
| searchPlaceholder  | String               | No        |                  |
| textError          | String               | No        |                  |
| textErrorStyle     | TextStyle            | No        |                  |
| maxHeight          | Number               | No        |                  |
| renderLeftIcon     | () => JSX.Element    | No        |                  |
| renderRightIcon    | () => JSX.Element    | No        |                  |
| renderItem         | (item) => JSX.Element| No        |                  |

#### MultiSelect Props
| Props              | Params               | isRequire | Description      |
| ------------------ | -------------------- | --------- | ---------------- |
| data               | Array                | Yes       |                  |
| labelField         | String               | Yes       |                  |
| valueField         | String               | Yes       |                  |
| onChange           | (value[]) => void    | Yes       |                  |
| style              | ViewStyle            | No        |                  |
| containerStyle     | ViewStyle            | No        |                  |
| fontFamily         | String               | No        |                  |
| labelStyle         | TextStyle            | No        |                  |
| iconColor          | String               | No        |                  |
| activeColor        | String               | No        |                  |
| value              | Item[]               | No        |                  |
| label              | String               | No        |                  |
| placeholder        | String               | No        |                  |
| placeholderStyle   | TextStyle            | No        |                  |
| selectedStyle      | ViewStyle            | No        |                  |
| selectedTextStyle  | TextStyle            | No        |                  |
| search             | Boolean              | No        |                  |
| inputSearchStyle   | ViewStyle            | No        |                  |
| searchPlaceholder  | String               | No        |                  |
| textError          | String               | No        |                  |
| textErrorStyle     | TextStyle            | No        |                  |
| maxHeight          | Number               | No        |                  |
| renderLeftIcon     | () => JSX.Element    | No        |                  |
| renderRightIcon    | () => JSX.Element    | No        |                  |
| renderItem         | (item) => JSX.Element| No        |                  |

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
                    containerStyle={styles.shadow}
                    data={data}
                    search
                    searchPlaceholder="Search"
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
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
                    textError="Error"
                />

                <MultiSelect
                    style={styles.dropdown}
                    data={data}
                    labelField="label"
                    valueField="value"
                    label="Multi Select"
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
```
