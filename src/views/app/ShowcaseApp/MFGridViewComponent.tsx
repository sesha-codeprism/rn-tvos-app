import React from 'react';
import {StyleSheet, View} from 'react-native';
import CodeBlock from '../../../components/CodeBlock';
import {FeedObject} from '../../../components/MFFilmStrip/MFFilmStrip';
import MFGridView from '../../../components/MFGridView';
import MFText from '../../../components/MFText';
import {CommonStyles} from './CommonStyles';
const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

const dataSample: Array<FeedObject> = require('../../../data/SampleData.json');

const MFGridViewComponent: React.FunctionComponent = props => {
  return (
    <View>
      <MFText
        displayText={'MFGridView'}
        textStyle={CommonStyles.titleStyle}
        shouldRenderText
      />
      <MFText
        displayText={
          'A component to render items from a swimlane in a grid fashion'
        }
        textStyle={CommonStyles.descriptionStyle}
        shouldRenderText
      />

      <View
        style={[
          CommonStyles.componentView,
          {
            height: 600,
          },
        ]}>
        <MFGridView
          dataSource={dataSample}
          focusedStyle={styles.focusedStyle}
          cardStyle={styles.cardStyles}
          imageStyle={styles.cardStyles}
        />
      </View>
      <View style={CommonStyles.codeBlock}>
        <SyntaxHighlighter
          code={
            "<MFGridView\ndataSource={dataSample}\ncontentContainerStyle={{\nflex: 1,\n flexDirection: 'row',\nflexWrap: 'wrap',\n}}\nstyle={{flexDirection: 'row', flexWrap: 'wrap', flexShrink: 10}}\n/>"
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

const styles = StyleSheet.create({
  cardStyles: {
    height: 150,
    width: 150,
    aspectRatio: 16 / 9,
  },
  focusedStyle: {
    transform: [
      {
        scale: 1.1,
      },
    ],
  },
});

export default MFGridViewComponent;
