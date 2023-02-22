import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DetailsLanding from "../../views/app/details_pages/details_panels/DetailsLanding";
import EpisodeRecordOptions from "../../views/app/details_pages/details_panels/EpsiodeRecordOptions";
import MoreInfoPanel from "../../views/app/details_pages/details_panels/MoreInfoPanel";
import RecordingOptions from "../../views/app/details_pages/details_panels/RecordingOptions";

const Stack = createNativeStackNavigator();

interface DetailsNavigatorProps {
  initialScreen?: any;
  props?: any;
}

export const DetailRoutes = {
  DetailsLanding: "DetailsLanding",
  MoreInfo: "MoreInfo",
  EpisodeRecordOptions: "EpisodeRecordOptions",
  RecordingOptions: "RecordingOptions",
};

export const DetailsNavigator: React.FunctionComponent<
  DetailsNavigatorProps
> = (props) => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName={props.initialScreen}
        screenOptions={{
          headerShown: false,
          animation: "slide_from_left",
          animationTypeForReplace: "push",
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name={DetailRoutes.DetailsLanding}
          component={DetailsLanding}
          initialParams={props.props}
        />

        <Stack.Screen
          name={DetailRoutes.MoreInfo}
          //@ts-ignore
          component={MoreInfoPanel}
          initialParams={props.props}
        />
        <Stack.Screen
          name={DetailRoutes.RecordingOptions}
          component={RecordingOptions}
          initialParams={props.props}
        />
        <Stack.Screen
          name={DetailRoutes.EpisodeRecordOptions}
          //@ts-ignore
          component={EpisodeRecordOptions}
          initialParams={props.props}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

DetailsNavigator.defaultProps = { initialScreen: DetailRoutes.DetailsLanding };
export default DetailsNavigator;
