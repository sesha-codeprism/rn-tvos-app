import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MFButtonVariant} from '../../../components/MFButton/MFButton';
import MFButtonGroup from '../../../components/MFButtonGroup/MFButtonGroup';
import MFText from '../../../components/MFText';
import {CommonStyles} from './CommonStyles';
import {MFThemeObject} from '../../../@types/MFTheme';
import CodeBlock from '../../../components/CodeBlock';
import { appUIDefinition } from '../../../config/constants';
const MFTheme: MFThemeObject = require('../../../config/theme/theme.json');
const SyntaxHighlighter = require('react-native-syntax-highlighter').default;
const codeStyles =
  require('react-syntax-highlighter/dist/esm/styles/hljs/darcula').default;

const MFButtonGroupComponent: React.FunctionComponent = props => {
  return (
    <View>
      <MFText
        displayText={'MFButtonGroup'}
        textStyle={CommonStyles.titleStyle}
        shouldRenderText
      />
      <MFText
        displayText={
          'A component to render multiple MFButton components at once'
        }
        textStyle={CommonStyles.descriptionStyle}
        shouldRenderText
      />
      <View style={CommonStyles.componentView}>
        <MFButtonGroup
          onHubChanged={() => {}}
          buttonsList={[
            {
              variant: MFButtonVariant.Text,
              textLabel: 'You',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Text,
              textLabel: 'Movies',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Text,
              textLabel: 'EPG Guide',
              enableRTL: false,
            },
          ]}
        />
        <MFButtonGroup
          onHubChanged={() => {}}
          buttonsList={[
            {
              variant: MFButtonVariant.Contained,
              textLabel: 'You',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Contained,
              textLabel: 'Movies',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Contained,
              textLabel: 'EPG Guide',
              enableRTL: false,
            },
          ]}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: 'red',
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
              unFocusedTextColor: 'grey',
            },
          }}
        />
        <MFButtonGroup
          onHubChanged={() => {}}
          buttonsList={[
            {
              variant: MFButtonVariant.Outlined,
              textLabel: 'You',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Outlined,
              textLabel: 'Movies',
              enableRTL: false,
            },
            {
              variant: MFButtonVariant.Outlined,
              textLabel: 'EPG Guide',
              enableRTL: false,
            },
          ]}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
      </View>
      <View style={(CommonStyles.codeBlock, {height: 500})}>
        <SyntaxHighlighter
          code={
            "<MFButtonGroup\nonHubChanged={() => {}}\nbuttonsList={[\n{\nvariant: MFButtonVariant.Text,\ntextLabel: 'You',\nnableRTL: false,\n},\n{\nvariant: MFButtonVariant.Text,\ntextLabel: 'Movies',\nenableRTL: false,\n},\n{\nvariant: MFButtonVariant.Text,\ntextLabel: 'EPG Guide',\nenableRTL: false,\n},\n]}\n>\n"
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

export default MFButtonGroupComponent;
