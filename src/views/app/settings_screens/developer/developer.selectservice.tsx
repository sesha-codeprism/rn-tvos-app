import {
  DeviceEventEmitter,
  FlatList,
  Image,
  NativeModules,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppImages } from "../../../../assets/images";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppStrings } from "../../../../config/strings";
import { GLOBALS, resetAuthData } from "../../../../utils/globals";
import { updateStore } from "../../../../utils/helpers";
import { getUrlParts, parseUri } from "../../../../../backend/utils/url/urlUtil";
import { resetCaches } from "../../../../config/queries";
import { Routes } from "../../../../config/navigation/RouterOutlet";
interface Props {
  navigation: NativeStackNavigationProp<any>;
}
const list = AppStrings?.str_selectServices;

const SelectServiceScreen: React.FunctionComponent<Props> = (props: any) => {

  const [focussed, setFocussed] = useState<any>("");

  const [selectedService, setSelectedService] = useState<any>({});

  const onPress = (item: any) => {
    NativeModules.MKGuideBridgeManager.clearCacheData();
    setSelectedService(item);
    GLOBALS.store.MFGlobalsConfig.url = parseUri(item.path);
    GLOBALS.store.MFGlobalsConfig.stsUrl = "";
    updateStore(GLOBALS.store);
    // Refresh
    const resetStore = resetAuthData();
    /** Update the current Async NSUserDefaults store with resetStore */
    updateStore(resetStore);
    GLOBALS.bootstrapSelectors = null;
    /** Reset the Query cache to make sure no cached API data is returned by React-Query */
    resetCaches();
    DeviceEventEmitter.emit('closeSettings', undefined);
    GLOBALS.rootNavigation.replace(Routes.ShortCode);
  };

  const getCurrentEnv = () => {
    setSelectedService({ path: parseUri(GLOBALS.store?.MFGlobalsConfig?.url) });
  };

  useEffect(() => {
    if (GLOBALS) {
      getCurrentEnv();
    }
  }, []);

  return (
    <SideMenuLayout title={AppStrings?.developer_settings} subTitle={AppStrings?.developer_settings_select_service}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.path}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussed(index);
              }}
              onPress={() => {
                onPress(item);
              }}
              style={
                index === focussed
                  ? { ...MFSettingsStyles.containerActive, ...styles.container }
                  : styles.container
              }
              key={index}
            >
              <View style={styles.icContainer}>
                {selectedService.path && getUrlParts(item.path)?.host == getUrlParts(selectedService.path)?.host ? (
                  <Image
                    source={AppImages.checked_circle}
                    style={styles.icCircle}
                  />
                ) : (
                  <Image
                    source={AppImages.unchecked_circle}
                    style={styles.icCircle}
                  />
                )}
              </View>
              <View style={styles.listContent}>
                <Text
                  style={[
                    styles.listText,
                    { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default SelectServiceScreen;

const styles = StyleSheet.create({
  contentTitleContainer: {
    height: 38,
    marginBottom: 16,
  },
  contentTitle: {
    color: "#EEEEEE",
    lineHeight: 38,
    fontSize: 28,
    letterSpacing: 0,
  },
  listText: {
    fontSize: 29,
    letterSpacing: 0,
    lineHeight: 50,
  },
  icCircle: { width: 35, height: 35 },
  container: {
    width: "100%",
    height: 100,
    // justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
  },
  icContainer: {
    width: "15%",
    height: 83,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    width: "85%",
    height: 83,
    // alignContent: "center",
    // alignItems: "center",
    justifyContent: "center",
  },
});
