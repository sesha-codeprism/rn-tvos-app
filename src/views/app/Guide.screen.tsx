import React, {useEffect} from 'react';
import {Text, View, NativeModules, requireNativeComponent} from 'react-native';

const MKGuide = requireNativeComponent('MKGuide');

interface GuideScreenProps {}

const GuideScreen: React.FunctionComponent<GuideScreenProps> = props => {
  return (
    <View style={{alignContent: 'center', alignItems: 'center', padding: 5}}>
      <MKGuide style={{width: '100%', height: '100%'}} />
    </View>
  );
};

export default GuideScreen;
