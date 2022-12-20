import {
    FlatList,
    Image,
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
  import { GLOBALS } from "../../../../utils/globals";
  import { updateStore } from "../../../../utils/helpers";
import { AppStrings } from "../../../../config/strings";
  interface Props {
    navigation: NativeStackNavigationProp<any>;
  }
  const list = AppStrings.str_selectLogginLevel;

  const DeveloperLoggingLevelScreen: React.FunctionComponent<Props> = (props: any) => {

    const [focussed, setFocussed] = useState<any>("");

    const [selectedLevel, setSelectedLevel] = useState<any>({});

    const onPress = (item: any) => {
        if(GLOBALS.store && item.value !== GLOBALS.store?.loggingLevel ){
            GLOBALS.store.loggingLevel = item.value;
            updateStore(GLOBALS.store);
        }
        setSelectedLevel(item);
    };

    const getCurrentLoggingLevel = () => {
        setSelectedLevel({value: GLOBALS.store?.loggingLevel || "none"});
    };

    useEffect(() => {
        if(GLOBALS){
            getCurrentLoggingLevel();
        }
    }, []);

    return (
      <SideMenuLayout title={AppStrings?.developer_settings} subTitle={AppStrings?.developer_settings_logging_level}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.value}
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
                  {selectedLevel.value && item.value == selectedLevel.value ? (
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
  
  export default DeveloperLoggingLevelScreen;
  
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
  