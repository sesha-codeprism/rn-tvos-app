import React from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {API} from '../../api';

interface LoginScreenProps {}

const LoginScreen: React.FunctionComponent<LoginScreenProps> = props => {
  return (
    <View>
      <WebView source={{uri: API.login}} />
    </View>
  );
};

export default LoginScreen;
