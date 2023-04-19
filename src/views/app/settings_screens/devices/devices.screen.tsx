import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import MFText from "../../../../components/MFText";
import { FlatList } from "react-native";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { Pressable } from "react-native";
import { getFontIcon } from "../../../../config/strings";
import MFButton, {
  MFButtonVariant,
} from "../../../../components/MFButton/MFButton";
import { globalStyles } from "../../../../config/styles/GlobalStyles";
import { appUIDefinition } from "../../../../config/constants";
import { AppImages } from "../../../../assets/images";
import {
  deleteDevice,
  deleteDeviceById,
  getDevices,
} from "../../../../../backend/subscriber/subscriber";
const deleteIcon = getFontIcon("delete");
export interface Device {
  AccountId: string;
  CurrentDevice: boolean;
  DeviceBucket: string;
  DeviceType: string;
  Id: string;
  LastTokenRequestTime: string;
  Name: string;
  Realm: string;
  RegCode: string;
}

const DevicesScreen = () => {
  const [deviceList, setDevicelist] = useState<Device[]>([]);
  const [focussedDevice, setFocussedDevice] = useState(0);
  const getDeviceList = async () => {
    const deviceList: Device[] = await getDevices();
    const currentDevice = deviceList.find(
      (item, index) => item.CurrentDevice === true
    );
    const allOtherDevices = deviceList.filter(
      (i, x) => i.CurrentDevice === false
    );
    currentDevice ? allOtherDevices.unshift(currentDevice) : null;
    setDevicelist(allOtherDevices);
  };
  useEffect(() => {
    getDeviceList();
  }, []);
  const onPressDelete = async (Id: any) => {
    // To be implemented delete device by ID
    const delResponse = await deleteDeviceById(Id);
    if (delResponse.status >= 204 && delResponse.status <= 300) {
      getDeviceList();
    }
  };
  const onPressDeleteAll = () => {
    // To be implemented delete all devices
    const allOtherDevices = deviceList.filter(
      (i, x) => i.CurrentDevice === false
    );
    console.log("allOtherDevices", allOtherDevices);
    allOtherDevices.forEach((item, index) => {
      deleteDeviceById(item.Id);
    });
    getDeviceList();
  };
  return (
    <SideMenuLayout title="Device Settings" subTitle="My Devices">
      <MFText
        textStyle={styles.title}
        shouldRenderText={true}
        displayText="You are signed in on these devices"
      />
      <FlatList
        data={deviceList}
        keyExtractor={(item) => item.Id}
        style={{ marginTop: 50, height: "100%" }}
        renderItem={({ item, index }) => {
          return (
            <Pressable
              onFocus={() => {
                setFocussedDevice(index);
              }}
              style={
                focussedDevice === index
                  ? {
                      ...MFSettingsStyles.containerActive,
                      ...styles.container,
                    }
                  : styles.container
              }
              onPress={() => {
                onPressDelete(item.Id);
              }}
            >
              <MFText
                shouldRenderText
                displayText={item.Name}
                textStyle={
                  focussedDevice === index
                    ? {
                        ...styles.listText,
                        color: globalStyles.fontColors.light,
                      }
                    : styles.listText
                }
                adjustsFontSizeToFit={false}
                numberOfLines={1}
              />
              {item.CurrentDevice && (
                <MFText
                  shouldRenderText
                  displayText={"This device"}
                  textStyle={styles.thisDeviceText}
                  adjustsFontSizeToFit={false}
                  numberOfLines={1}
                />
              )}

              <MFText
                shouldRenderText
                displayText={deleteIcon}
                textStyle={StyleSheet.flatten([
                  styles.textStyle,
                  {
                    fontSize: 90,
                    color: "white",
                  },
                ])}
              />
            </Pressable>
          );
        }}
        ListHeaderComponentStyle={{ marginBottom: 50 }}
        ListHeaderComponent={() => {
          return (
            <MFButton
              variant={MFButtonVariant.Contained}
              iconSource={0}
              imageSource={0}
              hasTVPreferredFocus={true}
              avatarSource={undefined}
              iconStyles={{
                height: 28,
                width: 28,
                marginRight: 20,
              }}
              textLabel="Sign out all other devices"
              textStyle={styles.btnText}
              style={styles.deleteAllContainer}
              focusedStyle={{
                ...styles.deleteAllContainer,
                ...styles.deleteAllContainerActive,
              }}
              onFocus={() => {
                setFocussedDevice(-1);
              }}
              onPress={() => {
                onPressDeleteAll();
              }}
              iconButtonStyles={{
                shouldRenderImage: true,
                iconPlacement: "Left",
              }}
              containedButtonProps={{
                containedButtonStyle: {
                  unFocusedBackgroundColor:
                    globalStyles.backgroundColors.shade3,
                  elevation: 0,
                  enabled: true,
                  focusedBackgroundColor:
                    globalStyles.backgroundColors.primary1,
                  hoverColor: "red",
                  hasTVPreferredFocus: false,
                  unFocusedTextColor: globalStyles.fontColors.lightGrey,
                },
              }}
            />
          );
        }}
      />
    </SideMenuLayout>
  );
};

export default DevicesScreen;

const styles = StyleSheet.create({
  title: {
    color: "#A7A7A7",
    lineHeight: 38,
    fontSize: 28,
    letterSpacing: 0,
  },
  container: {
    width: "95%",
    height: 120,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    paddingRight: 21,
    paddingLeft: 21,
  },
  containerActive: {
    backgroundColor: "#053C69",
    borderRadius: 6,
  },
  deleteAllContainer: {
    width: "70%",
    height: 70,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    display: "flex",
  },
  deleteAllContainerActive: {
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
  listText: {
    color: globalStyles.fontColors.lightGrey,
    lineHeight: 38,
    fontSize: 28,
  },
  btnText: {
    color: globalStyles.fontColors.lightGrey,
    lineHeight: 38,
    fontSize: 22,
  },
  thisDeviceText: {
    color: globalStyles.fontColors.darkGrey,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 200,
  },
  textStyle: {
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
  },
  focusedUnderLine: {
    backgroundColor: globalStyles.backgroundColors.primary1,
  },
});
