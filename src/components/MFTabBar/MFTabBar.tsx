import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import MFButton, {
  MFButtonVariant,
} from '../MFButton/MFButton';
import {MFTabBarStyles} from './MFTabBarStyles';
import {MFThemeObject} from '../../@types/MFTheme';

const MFTheme: MFThemeObject = require('../../config/theme/theme.json');

interface MFTabBarProps {
  logoPlacement?: 'Left' | 'Right';
  logo: ImageSourcePropType;
  logoStyles?: StyleProp<ImageStyle>;
  style?: StyleProp<ViewStyle>;
  hubsList: string[];
  onHubChanged: (hubIndex: number) => void;
  showTabActions?: boolean;
  tabActionComponents?: React.ReactNode[];
}

const MFTabBar: React.FunctionComponent<MFTabBarProps> = props => {
  const [hubIndex, setHubIndex] = useState(0);

  const _onFocus = (index: number) => {
    setHubIndex(index);
    props.onHubChanged(index);
  };

  return (
    <View style={[props.style, MFTabBarStyles.tabBarContainer]}>
      {props.logoPlacement === 'Left' ? (
        <View style={{alignItems: 'center', flex: 1}}>
          <Image style={[props.logoStyles]} source={props.logo} />
        </View>
      ) : null}
      <View style={{flex: 9, flexDirection: 'row'}}>
        {props.hubsList.map((hub, x) => (
          <MFButton
            key={hub + x}
            variant={MFButtonVariant.Image}
            style={
              hubIndex === x
                ? StyleSheet.flatten([
                    MFTabBarStyles.tabBarItem,
                    MFTabBarStyles.tabBarItemFocused,
                  ])
                : MFTabBarStyles.tabBarItem
            }
            focusedStyle={MFTabBarStyles.tabBarItemFocused}
            textLabel={hub}
            iconSource={{
              uri: 'https://images.unsplash.com/photo-1494253109108-2e30c049369b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmFuZG9tJTIwZm9vZCUyMHN0b3JlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
            }}
            textStyle={MFTabBarStyles.tabBarItemText}

            onFocus={() => {
              _onFocus(x);
            }}
            imageSource={{}}
            avatarSource={{}}
          />
        ))}
      </View>
      {props.logoPlacement === 'Right' ? (
        <View style={{alignItems: 'flex-end', flex: 1}}>
          <Image style={[props.logoStyles]} source={props.logo} />
        </View>
      ) : null}
    </View>
  );
};

export default MFTabBar;
