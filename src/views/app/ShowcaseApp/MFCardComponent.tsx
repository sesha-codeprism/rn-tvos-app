import React from 'react';
import {View, StyleSheet} from 'react-native';
import MFCard from '../../../components/MFCard';
import MFText from '../../../components/MFText';
import {CommonStyles} from './CommonStyles';
import {FeedObject} from '../../../components/MFFilmStrip/MFFilmStrip';
import {TitlePlacement, AspectRatios} from '../../../components/MFCard';
const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

interface MFCardComponentProps {
  data: FeedObject;
}

const MFCardComponent: React.FunctionComponent<MFCardComponentProps> =
  props => {
    return (
      <View
        style={{
          paddingHorizontal: '14%',
        }}>
        <MFText
          displayText={'MFCard'}
          textStyle={CommonStyles.titleStyle}
          shouldRenderText
        />
        <MFText
          displayText={'A generic component to render buttons'}
          textStyle={CommonStyles.descriptionStyle}
          shouldRenderText
        />
        <View style={CommonStyles.componentView}>
          <MFCard
            style={styles.cardStyles}
            focusedStyle={styles.focusedStyle}
            imageStyle={styles.cardStyles}
            title={props.data.id}
            subTitle={props.data.author}
            data={props.data}
            layoutType="LandScape"
            titlePlacement={TitlePlacement.beneath}
            showTitleOnlyOnFocus
            shouldRenderText
          />
        </View>
        <View style={(CommonStyles.codeBlock, {height: 500})}>
          <SyntaxHighlighter
            code={
              "<MFButton variant={MFButtonVariant.Text} \n textLabel='Text Button'\ntextStyle={[MFTabBarStyles.tabBarItemText, {color: 'white'}]}\navatarSource={{uri: 'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png',}}\nimageSource={require('../../../assets/images/message.png')}\niconSource={require('../../../assets/images/search.png')}\ncontainedButtonProps={{containedButtonStyle: {enabled: true,focusedBackgroundColor: MFTheme.colors.primary,elevation: 5,hoverColor: 'red',unFocusedBackgroundColor: '#222222',},}}\noutlinedButtonProps={{outlinedButtonStyle: {focusedBorderColor: MFTheme.colors.primary,unFocusedBorderColor: MFTheme.colors.secondary,focusedBorderWidth: 4,unFocusedBorderWidth: 2,isDisabled: false,},}}\n/>"
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

export default MFCardComponent;
