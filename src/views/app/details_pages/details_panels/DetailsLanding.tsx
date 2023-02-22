import { NavigationContext, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { MFTabBarStyles } from "../../../../components/MFTabBar/MFTabBarStyles";
import MFText from "../../../../components/MFText";

interface Props {
  navigation?: NativeStackNavigationProp<any>;
  route?: any;
}

const DetailsLanding: React.FunctionComponent<Props> = (props: Props) => {
  const navigation = React.useContext(NavigationContext);
  console.log("navigation is", navigation?.getState());
  //   navigation?.setParams("")
  //   useEffect(() => {
  //     navigation.navigate("SettingsNavigator", {
  //       screen: "foss_license",
  //       params: { user: "jane" },
  //     });
  //   }, []);
  return (
    <SideMenuLayout title="Details Landing">
      <MFText
        displayText={
          "Sample landing screen.. isn't supposed to be seen outside dev builds"
        }
        shouldRenderText
        numberOfLines={3}
        textStyle={MFTabBarStyles.tabBarItemText}
      />
    </SideMenuLayout>
  );
};

export default DetailsLanding;
