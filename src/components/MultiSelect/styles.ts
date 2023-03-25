import { I18nManager, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainWrap: {
    justifyContent: 'center',
  },
  container: {
    flexShrink: 1,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  flex1: {
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  wrapTop: {
    justifyContent: 'flex-end',
  },
  dropdown: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 35,
  },
  dropdownInside: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 35,
  },
  title: {
    marginVertical: 5,
    fontSize: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  wrapItem: {
    marginBottom: 0.5,
  },
  item: {
    padding: 17,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  icon: {
    width: 20,
    height: 20,
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#DDDDDD',
    paddingHorizontal: 8,
    marginBottom: 8,
    margin: 6,
    height: 45,
  },
  rowSelectedItem: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 8,
    marginVertical: 6,
    marginRight: 8,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  selectedTextItem: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 16,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  selectedTextLeftItem: {
    fontSize: 12,
    color: 'gray',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
  fullScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
