import {
    Image,
    Pressable,
    Text,
    FlatList,
  } from "react-native";
  import React, { useState } from "react";
  import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SideMenuLayout from "../../../../components/MFSideMenu/MFSideMenu";
import MFSettingsStyles from "../../../../config/styles/MFSettingsStyles";
import { AppImages } from "../../../../assets/images";


  const menu = [
    {
      title: "Stop Recording",
      action: "stop_recording",
      icon: "",
    },
  ];
  interface Props {
    navigation?: NativeStackNavigationProp<any>;
  }
  const DvrSettingsScreen: React.FunctionComponent<Props> = (props: any) => {
    const [focussed, setFocussed] = useState<any>(0);
  
    return (
      <SideMenuLayout title="Settings" subTitle="DVR Settings">
        <FlatList
          data={menu}
          keyExtractor={(item) => item.title}
          renderItem={({ item, index }) => {
            return (
              <Pressable
                hasTVPreferredFocus={index === 0 ? true : false}
                onFocus={() => {
                  setFocussed(index);
                }}
                onPress={() => {
                  if (item.action !== "") {
                    props.navigation.navigate(item.action);
                  } else {
                    null;
                  }
                }}
                style={
                  index === focussed
                    ? {
                        ...MFSettingsStyles.containerActive,
                        ...MFSettingsStyles.container,
                      }
                    : MFSettingsStyles.container
                }
                key={index}
                isTVSelectable={true}
              >
                <Text
                  style={[
                    MFSettingsStyles.listText,
                    { color: index === focussed ? "#EEEEEE" : "#A7A7A7" },
                  ]}
                >
                  {item.title}
                </Text>
                <Image
                  source={AppImages.arrow_right}
                  style={{ width: 15, height: 30 }}
                />
              </Pressable>
            );
          }}
        />
      </SideMenuLayout>
    );
  };
  
  export default DvrSettingsScreen;
  