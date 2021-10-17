import { StyleSheet } from 'react-native';
import { useScale } from '../utilsScale';

const { scale, fontScale } = useScale;

export const styles = StyleSheet.create({
  dropdown: {
    width: scale(58),
    paddingHorizontal: scale(6),
    height: scale(26),
  },
  container: {
    width: scale(60),
  },
  item: {
    flexDirection: 'row',
    padding: scale(6),
    height: scale(50),
    alignItems: 'center',
  },
  image: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(3),
  },
  selectedTextStyle: {
    flex:1,
    fontSize: fontScale(12),
  },
});
