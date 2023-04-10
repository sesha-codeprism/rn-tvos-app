import * as React from 'react';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Video from "./Video";

interface PlayerTestProps {
    navigation: NativeStackNavigationProp<any>;
    route: any;
  }

const PlayerTest: React.FunctionComponent<PlayerTestProps> = (
    props: PlayerTestProps
) => {
  const videoProps = props.route.params.playerProps;
  console.log('******* Player Test ******* props => ', JSON.stringify(videoProps));
  return (
    <Video {...videoProps}/>
  )
}

export default PlayerTest;