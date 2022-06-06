import React from 'react';
import {
  StyleSheet,
  ScrollView,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import MFCard, {AspectRatios, TitlePlacement} from './MFCard';
import {FeedObject} from './MFFilmStrip/MFFilmStrip';

interface MFGridProps {
  dataSource?: Array<FeedObject>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  titlePlacement?: TitlePlacement;
}

const MFGridView: React.FunctionComponent<MFGridProps> = props => {
  return (
    <ScrollView
      horizontal
      contentContainerStyle={props.contentContainerStyle}
      style={props.style}>
      <FlatList
        data={props.dataSource}
        numColumns={4}
        renderItem={({item, index}) => (
          <MFCard
            style={props.cardStyle}
            focusedStyle={props.focusedStyle}
            imageStyle={props.imageStyle}
            title={item.id}
            subTitle={item.author}
            data={item}
            layoutType="LandScape"
            titlePlacement={props.titlePlacement}
            showTitleOnlyOnFocus
            shouldRenderText
          />
        )}
      />
      {/* {props.dataSource?.map((item, index) => {
        return (
          <MFCard
            key={`Index${index}`}
            data={item}
            cardHeight={150}
            cardWidth={150}
            shouldRenderText={false}
            layoutType={'Circular'}
            showTitleOnlyOnFocus
            aspectRatio={AspectRatios['16:9']}
            titlePlacement={TitlePlacement.beneath}
            showProgress={false}
          />
        );
      })} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    paddingHorizontal: 50,
    backgroundColor: 'black',
  },
});

export default MFGridView;
