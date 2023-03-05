import { I18nManager, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
  },
  textInput: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
  },
  row: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  icon: {
    width: 20,
    height: 20,
  },
});
