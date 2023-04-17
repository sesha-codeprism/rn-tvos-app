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
const deleteIcon = getFontIcon("delete");

const DevicesScreen = () => {
  const [deviceList, setDevicelist] = useState<any[]>([]);
  const [focussedDevice, setFocussedDevice] = useState(0);

  useEffect(() => {
    setDevicelist([
      {
        id: 1,
        name: "Apple TV 1",
      },
      {
        id: 2,
        name: "Apple TV 2",
      },
      {
        id: 3,
        name: "Apple TV 3",
      },
    ]);
  }, []);
  const onPressDelete = (item: any) => {
    // To be implemented delete device by ID
  };
  const onPressDeleteAll = () => {
    // To be implemented delete all devices
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
        keyExtractor={(item) => item.id}
        style={{ marginTop: 50, height: "100%" }}
        renderItem={({ item, index }) => {
          return (
            <MFButton
              focusable
              iconSource={0}
              hasTVPreferredFocus={index === 0}
              imageSource={0}
              avatarSource={undefined}
              onFocus={() => {
                // setFocussedDevice(index);
              }}
              variant={MFButtonVariant.FontIcon}
              fontIconSource={deleteIcon}
              fontIconTextStyle={StyleSheet.flatten([
                styles.textStyle,
                {
                  fontSize: 90,
                  color: "white",
                },
              ])}
              onPress={() => {
                onPressDelete(item);
              }}
              textStyle={styles.listText}
              textLabel={item.name}
              style={styles.container}
              focusedStyle={{
                ...MFSettingsStyles.containerActive,
                ...styles.container,
              }}
              fontIconProps={{
                iconPlacement: "Right",
                shouldRenderImage: true,
              }}
            />
          );
        }}
        ListHeaderComponentStyle={{marginBottom: 50}}
        ListHeaderComponent={() => {
          return (
            <MFButton
              variant={MFButtonVariant.Contained}
            iconSource={0}
              imageSource={0}
              avatarSource={undefined}
              iconStyles={{
                height: 28,
                width: 28,
                marginRight: 20,
              }}
              textLabel="Sign out all other devices"
              textStyle={styles.listText}
              style={styles.deleteAllContainer}
              focusedStyle={{
                ...styles.deleteAllContainer,
                ...styles.deleteAllContainerActive,
              }}
              onFocus={() => {
                console.log("delete All focused");
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
    alignSelf:'center',
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
    color: "#EEEEEE",
    fontSize: 25,
    fontWeight: "600",
    // textAlign: "left",
    marginLeft: 21,
  },
  textStyle: {
    fontFamily: globalStyles.fontFamily.icons,
    color: globalStyles.fontColors.light,
  },
  focusedUnderLine: {
    backgroundColor: globalStyles.backgroundColors.primary1,
  },
});
