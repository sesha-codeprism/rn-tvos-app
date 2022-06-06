import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MFThemeObject} from '../../../@types/MFTheme';
import CodeBlock from '../../../components/CodeBlock';
import MFCard, {MFCardProps, TitlePlacement} from '../../../components/MFCard';
import MFFilmStrip, {
  FeedObject,
  OverlayComponent,
} from '../../../components/MFFilmStrip/MFFilmStrip';
import MFText from '../../../components/MFText';
import {CommonStyles} from './CommonStyles';
const MFTheme: MFThemeObject = require('../../../config/theme/theme.json');
const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

interface MFFilmStripComponentProps {
  cardArray: Array<MFCardProps>;
  dataSource: Array<FeedObject>;
}

const MFFilmStripComponent: React.FunctionComponent<MFFilmStripComponentProps> =
  props => {
    return (
      <View>
        <MFText
          displayText={'MFFilmStrip'}
          textStyle={CommonStyles.titleStyle}
          shouldRenderText
        />
        <MFText
          displayText={'A component to render multiple items in a swimlane'}
          textStyle={CommonStyles.descriptionStyle}
          shouldRenderText
        />
        <View
          style={[
            CommonStyles.componentView,
            {
              height: 400,
              marginTop: 100,
              paddingTop: 110,
            },
          ]}>
          <MFFilmStrip
            dataSource={props.dataSource}
            style={styles.cardStyles}
            imageStyle={styles.cardStyles}
            focusedStyle={styles.focusedStyle}
            titlePlacement={TitlePlacement.overlayCenter}
            overlayComponent={
              <OverlayComponent displayString={'New Episode'} />
            }
          />
        </View>
        <View style={CommonStyles.codeBlock}>
          <SyntaxHighlighter
            code={
              "<MFFilmStrip\nmfCardArray={props.cardArray}\nrenderMFCard={(i, x) => (\n<MFCard\nkey={`Index${i}`}\ncardHeight={100}\ncardWidth={100}\nlayoutType={'LandScape'}\nshowTitleOnlyOnFocus\ntitlePlacement={TitlePlacement.beneath}\naspectRatio={'1:1'}\noverlayComponent={<OverlayComponent displayString={i.author} />}howProgress={false}\nshouldRenderText\n/>"
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
    // borderRadius: 5,
    // borderWidth: 1,
    // borderColor: 'red',
  },
});

export default MFFilmStripComponent;
