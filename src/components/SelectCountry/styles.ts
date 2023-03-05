import { I18nManager, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  dropdown: {
    width: 58,
    paddingHorizontal: 6,
    height: 26,
  },
  container: {
    width: 60,
  },
  item: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    padding: 6,
    alignItems: 'center',
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 3,
    marginVertical: 4,
  },
  selectedTextStyle: {
    flex: 1,
    fontSize: 12,
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  },
});
