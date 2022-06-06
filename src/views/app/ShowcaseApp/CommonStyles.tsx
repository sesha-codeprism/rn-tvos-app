import {StyleSheet} from 'react-native';
export const CommonStyles = StyleSheet.create({
  titleStyle: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  descriptionStyle: {
    color: 'white',
    fontSize: 30,
    marginVertical: 10,
  },
  componentView: {
    flexDirection: 'row',
    borderWidth: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#293543',
    width: '90%',
    height: 200,
    borderRadius: 5,
    marginTop: 50,
  },
  codeBlock: {
    paddingTop: 20,
    height: 300,
    margin: 20,
  },
});
