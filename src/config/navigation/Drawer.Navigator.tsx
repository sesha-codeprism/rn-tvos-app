import { createDrawerNavigator } from "react-navigation-drawer";
import { SCREEN_WIDTH } from "../../utils/dimensions";
import { SettingsNavigator } from "./Drawer.Component";
import { AppNavigator } from "./MainStack.Navigator";
const width = SCREEN_WIDTH;

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppNavigator,
      path: "app",
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
  },
  //@ts-ignore
  {
    contentComponent: SettingsNavigator,
    drawerWidth: width * 0.59,
  }
);

export default DrawerNavigator;
