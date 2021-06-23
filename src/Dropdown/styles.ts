import { StyleSheet } from 'react-native';
import { useScale } from '../utilsScale';

const { scale, fontScale } = useScale;

export const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: scale(8),
      padding: scale(12),
      justifyContent: 'center'
    },
    main: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
      backgroundColor: 'white',
      width: '100%',
      borderTopLeftRadius: scale(16),
      borderTopRightRadius: scale(16),
    },
    header: {
      height: scale(40),
      width: '100%',
      borderTopLeftRadius: scale(16),
      borderTopRightRadius: scale(16),
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: scale(0.3),
      borderBottomColor: '#DDDDDD',
      backgroundColor: 'white'
    },
    pan:{
      width: scale(40),
      height: scale(6),
      borderRadius: scale(6),
      backgroundColor: '#DDDDDD'
    },
    closeIcon: {
      width: scale(45),
      height: scale(45),
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdown: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: scale(35),
    },
    title: {
      marginVertical: scale(5),
      fontSize: fontScale(16)
    },
    list: {
      maxHeight: scale(300)
    },
    item: {
      padding: scale(17),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    textItem: {
      flex: 1,
      fontSize: fontScale(16)
    },
    icon: {
      width: scale(24),
      height: scale(24),
    },
    textError: {
      color: 'red',
      fontSize: fontScale(14),
      marginTop: scale(10)
    },
    input: {
      borderWidth: scale(1),
      borderColor: '#DDDDDD',
      borderRadius: scale(12),
      paddingHorizontal: scale(8),
      marginBottom: scale(8)
    },
  });
  