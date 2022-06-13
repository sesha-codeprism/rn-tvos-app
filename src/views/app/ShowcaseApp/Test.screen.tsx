import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import {MFButtonVariant} from '../../../components/MFButton/MFButton';
import MFButtonGroup from '../../../components/MFButtonGroup/MFButtonGroup';
import {MFTabBarStyles} from '../../../components/MFTabBar/MFTabBarStyles';
import MFText from '../../../components/MFText';
import {MFThemeObject} from '../../../@types/MFTheme';
import {
  FeedObject,
  OverlayComponent,
} from '../../../components/MFFilmStrip/MFFilmStrip';
import MFCard, {
  MFCardProps,
  TitlePlacement,
} from '../../../components/MFCard';
import MFButtonComponent from './MFButtonComponent';
import MFButtonGroupComponent from './MFButtonGroupComponent';
import MFFilmStripComponent from './MFFilmStripComponent';
import MFGridViewComponent from './MFGridViewComponent';
import MFSearchComponent from './MFSearchComponent';
import FastImage from 'react-native-fast-image';
import MFCardComponent from './MFCardComponent';

const {height} = Dimensions.get('window');

const dataSample: Array<FeedObject> = require('../../../data/SampleData.json');

interface TestScreenProps {}

const TestScreen: React.FunctionComponent<TestScreenProps> = () => {
  let cardArray: Array<MFCardProps> = [];

  dataSample.forEach((e, i) => {
    const mfcard = (
      <MFCard
        key={i}
        data={e}
        title={e.id}
        subTitle={e.author}
        layoutType={'LandScape'}
        shouldRenderText
        showTitleOnlyOnFocus
        titlePlacement={TitlePlacement.beneath}
        overlayComponent={
          i !== 0 ? <OverlayComponent displayString={e.author} /> : undefined
        }
        //   progressComponent={
        //     <ProgressBar progress={0.3} height={10} width={540} />
        //   }
        showProgress={false}
      />
    );
    cardArray.push(mfcard.props);
  });

  const [buttonVariant, setVariant] = useState(MFButtonVariant.Text);
  const [shouldRenderMFButton, setShouldRenderMFButton] = useState(true);
  const [shouldRenderMFButtonGroup, setShouldRenderMFButtonGroup] =
    useState(false);
  const [shouldRenderMFFilmStrip, setShouldRenderMFFilmStrip] = useState(false);
  const [shouldRenderMFGridView, setShouldRenderMFGridView] = useState(false);
  const [shouldRenderMFCard, setShouldRenderMFCard] = useState(false);
  const [shouldRenderMFSearch, setshouldRenderMFSearch] = useState(false);
  return (
    <View style={styles.root}>
      <View style={styles.scrollbarView}>
        <ScrollView contentContainerStyle={styles.scrollViewStyles}>
          <View style={styles.componentTitleView}>
            <MFText
              displayText={'Client Component Library'}
              textStyle={[
                MFTabBarStyles.tabBarItemText,
                {color: 'white', marginTop: 20, fontSize: 28},
              ]}
              shouldRenderText
            />
          </View>
          <View style={styles.buttonComponent}>
            <MFButtonGroup
              vertical
              onHubChanged={() => {}}
              focusedStyle={styles.focusedStyle}
              buttonsList={[
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFButton',
                  enableRTL: false,
                },
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFButtonGroup',
                  enableRTL: false,
                },
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFCard',
                  enableRTL: false,
                },
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFFilmStrip',
                  enableRTL: false,
                },
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFGridView',
                  enableRTL: false,
                },
                {
                  variant: MFButtonVariant.Text,
                  textLabel: 'MFSearch',
                  enableRTL: false,
                },
              ]}
              onPress={(event, index) => {
                switch (index) {
                  case 0:
                    setShouldRenderMFButtonGroup(false);
                    setShouldRenderMFCard(false);
                    setShouldRenderMFFilmStrip(false);
                    setShouldRenderMFGridView(false);
                    setshouldRenderMFSearch(false);
                    setShouldRenderMFButton(true);
                    break;
                  case 1:
                    setShouldRenderMFCard(false);
                    setShouldRenderMFFilmStrip(false);
                    setShouldRenderMFGridView(false);
                    setshouldRenderMFSearch(false);
                    setShouldRenderMFButton(false);
                    setShouldRenderMFButtonGroup(true);
                    break;
                  case 2:
                    setShouldRenderMFFilmStrip(false);
                    setShouldRenderMFGridView(false);
                    setshouldRenderMFSearch(false);
                    setShouldRenderMFButton(false);
                    setShouldRenderMFButtonGroup(false);
                    setShouldRenderMFCard(true);
                    break;
                  case 3:
                    setShouldRenderMFGridView(false);
                    setshouldRenderMFSearch(false);
                    setShouldRenderMFButton(false);
                    setShouldRenderMFButtonGroup(false);
                    setShouldRenderMFCard(false);
                    setShouldRenderMFFilmStrip(true);
                    break;
                  case 4:
                    setshouldRenderMFSearch(false);
                    setShouldRenderMFButton(false);
                    setShouldRenderMFButtonGroup(false);
                    setShouldRenderMFCard(false);
                    setShouldRenderMFFilmStrip(false);
                    setShouldRenderMFGridView(true);
                    break;
                  case 5:
                    setShouldRenderMFButton(false);
                    setShouldRenderMFButtonGroup(false);
                    setShouldRenderMFCard(false);
                    setShouldRenderMFFilmStrip(false);
                    setShouldRenderMFGridView(false);
                    setshouldRenderMFSearch(true);

                    break;
                  default:
                    console.log('No setting for this option');
                }
              }}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.componentView}>
        <View style={styles.logoView}>
          <FastImage
            source={require('../../../assets/images/logo.png')}
            style={styles.logoStyles}
          />
        </View>
        {shouldRenderMFButton ? (
          <MFButtonComponent />
        ) : shouldRenderMFButtonGroup ? (
          <MFButtonGroupComponent />
        ) : shouldRenderMFCard ? (
          <MFCardComponent data={dataSample[0]} />
        ) : shouldRenderMFFilmStrip ? (
          <MFFilmStripComponent cardArray={cardArray} dataSource={dataSample} />
        ) : shouldRenderMFGridView ? (
          <MFGridViewComponent />
        ) : (
          <MFSearchComponent />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
  },
  scrollbarView: {
    backgroundColor: '#001e3c',
    // backgroundColor: 'red',
    height: '100%',
    width: '20%',
    borderRightColor: '#132f4c',
    borderRightWidth: 5,
    // alignContent: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  componentTitleView: {
    height: 100,
    alignSelf: 'center',
  },
  scrollViewStyles: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentView: {
    backgroundColor: 'yellow',
    height: '100%',
    width: '80%',
  },
  logoView: {
    alignSelf: 'flex-end',
    height: 100,
    borderRadius: 5,
    margin: 10,
  },
  buttonComponent: {
    alignSelf: 'center',
    width: '100%',
    marginTop: height / 4,
  },
  componentView: {
    backgroundColor: '#001e3c',
    height: '100%',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'flex-end',
    flexShrink: 50,
    alignContent: 'flex-end',
    paddingLeft: 50,
  },
  focusedStyle: {
    transform: [{scale: 1}],
    backgroundColor: '#aab4be',
  },
  propsView: {
    backgroundColor: 'pink',
    height: '40%',
    flexWrap: 'wrap',
    padding: 20,
  },
  logoStyles: {height: 100, width: 300, borderRadius: 10},
});

export default TestScreen;
