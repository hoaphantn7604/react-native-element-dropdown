import { StyleSheet } from 'react-native';
import { useScale } from '../utilsScale';
const { scale, fontScale } = useScale;

export const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: scale(8),
      padding: scale(12),
      justifyContent: 'center',
    },
    textInput: {
      flexDirection: 'row',
      alignItems: 'center',
      flex:1
    },
    input: {
      fontSize: fontScale(16),
      flex:1
    },
    label: {
      marginBottom: scale(4),
      fontSize: fontScale(16)
    },
    row: {
      flexDirection: 'row',
    },
    icon: {
      width: scale(20),
      height: scale(20),
    },
    textError: {
      color: 'red',
      fontSize: fontScale(14),
      marginTop: scale(10)
    }
  });
  