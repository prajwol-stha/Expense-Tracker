import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: '#25C120',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: 320,
    alignSelf: 'center',
  },
  btn: {
    backgroundColor: '#25C120',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 5,
    width: 180,
    alignSelf: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  btnOffline: {
    backgroundColor: 'red',
    borderColor: 'darkred',
  },
});