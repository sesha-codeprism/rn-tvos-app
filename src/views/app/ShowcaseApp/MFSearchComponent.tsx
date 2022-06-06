import React from 'react';
import {View} from 'react-native';
import MFText from '../../../components/MFText';
import {CommonStyles} from './CommonStyles';
import MFSearch from '../../../components/MFSearch';
const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

const MFSearchComponent: React.FunctionComponent = props => {
  const onChangeText = (event: {
    nativeEvent: {text: React.SetStateAction<string>};
  }) => {};

  return (
    <View>
      <MFText
        displayText={'MFSearch'}
        textStyle={CommonStyles.titleStyle}
        shouldRenderText
      />
      <MFText
        displayText={'A native component to provide search functionality'}
        textStyle={CommonStyles.descriptionStyle}
        shouldRenderText
      />

      <View
        style={{
          width: 1400,
          height: 400,
          backgroundColor: '#f5f5f5',
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#293543',
        }}>
        <MFSearch onChangeText={onChangeText} />
      </View>
      <View style={CommonStyles.codeBlock}>
        <SyntaxHighlighter
          code={
            "<Search\nonChangeText={onChangeText}\nstyle={{height: 150, backgroundColor: 'black'}}\n/>"
          }
          style={{...codeStyles}}
          customStyle={{padding: 20, margin: 0}}
          fontSize={18}
          highlighter={'hljs'}
        />
      </View>
    </View>
  );
};

export default MFSearchComponent;
