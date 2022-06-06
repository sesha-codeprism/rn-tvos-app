import React from "react";
import { View } from "react-native";
import MFButton, {
  MFButtonVariant,
} from "../../../components/MFButton/MFButton";
import { MFTabBarStyles } from "../../../components/MFTabBar/MFTabBarStyles";
import MFText from "../../../components/MFText";
import { appUIDefinition } from "../../../config/constants";
import { CommonStyles } from "./CommonStyles";
const SyntaxHighlighter = require("react-native-syntax-highlighter").default;

const BULLET = "\u2022";

const codeStyles =
  require("react-syntax-highlighter/dist/esm/styles/hljs/darcula").default;

const MFButtonComponent: React.FunctionComponent = (props) => {
  return (
    <View>
      <MFText
        displayText={"MFButton"}
        textStyle={CommonStyles.titleStyle}
        shouldRenderText
      />
      <MFText
        displayText={"A generic component to render buttons"}
        textStyle={CommonStyles.descriptionStyle}
        shouldRenderText
      />
      <MFText
        displayText={`There are six variants of MFButton.\n\t${BULLET} Text\n\t${BULLET} Contained\n\t${BULLET} Outlined\n\t${BULLET} Avatar\n\t${BULLET} Image\n\t${BULLET} Icon\n\t`}
        textStyle={CommonStyles.descriptionStyle}
        shouldRenderText
      />
      <View style={CommonStyles.componentView}>
        <MFButton
          variant={MFButtonVariant.Text}
          textLabel="Text Button"
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: "#222222",
            },
          }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
        <MFButton
          variant={MFButtonVariant.Contained}
          textLabel="Contained Button"
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
              unFocusedTextColor: "grey",
            },
          }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
        <MFButton
          variant={MFButtonVariant.Outlined}
          textLabel="Outlined Button"
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
            },
          }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
        <MFButton
          variant={MFButtonVariant.Avatar}
          textLabel="Avatar Button"
          avatarStyles={{
            overflow: "hidden",
            alignSelf: "center",
            width: 50,
            height: 50,
            aspectRatio: 1,
          }}
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
            },
          }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
        <MFButton
          variant={MFButtonVariant.Icon}
          textLabel="Icon Button"
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
            },
          }}
          iconStyles={{ height: 35, width: 35 }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
        <MFButton
          variant={MFButtonVariant.Image}
          textLabel="Image Button"
          textStyle={[MFTabBarStyles.tabBarItemText, { color: "white" }]}
          avatarSource={{
            uri: "https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png",
          }}
          imageSource={require("../../../assets/images/message.png")}
          iconSource={require("../../../assets/images/search.png")}
          containedButtonProps={{
            containedButtonStyle: {
              enabled: true,
              focusedBackgroundColor: appUIDefinition.theme.colors.primary,
              elevation: 5,
              hoverColor: "red",
              unFocusedBackgroundColor: appUIDefinition.theme.colors.secondary,
            },
          }}
          imageStyles={{ height: 40, width: 40, marginTop: 10 }}
          outlinedButtonProps={{
            outlinedButtonStyle: {
              focusedBorderColor: appUIDefinition.theme.colors.primary,
              unFocusedBorderColor: appUIDefinition.theme.colors.secondary,
              focusedBorderWidth: 4,
              unFocusedBorderWidth: 2,
              isDisabled: false,
            },
          }}
        />
      </View>
      <View style={CommonStyles.codeBlock}>
        <SyntaxHighlighter
          code={
            "<MFButton variant={MFButtonVariant.Text} \n textLabel='Text Button'\ntextStyle={[MFTabBarStyles.tabBarItemText, {color: 'white'}]}\navatarSource={{uri: 'https://www.kindpng.com/picc/m/495-4952535_create-digital-profile-icon-blue-user-profile-icon.png',}}\nimageSource={require('../../../assets/images/message.png')}\niconSource={require('../../../assets/images/search.png')}\ncontainedButtonProps={{containedButtonStyle: {enabled: true,focusedBackgroundColor: appUIDefinition.theme.colors.primary,elevation: 5,hoverColor: 'red',unFocusedBackgroundColor: '#222222',},}}\noutlinedButtonProps={{outlinedButtonStyle: {focusedBorderColor: appUIDefinition.theme.colors.primary,unFocusedBorderColor: appUIDefinition.theme.colors.secondary,focusedBorderWidth: 4,unFocusedBorderWidth: 2,isDisabled: false,},}}\n/>"
          }
          style={{ ...codeStyles }}
          customStyle={{ padding: 20, margin: 0 }}
          fontSize={18}
          highlighter={"hljs"}
        />
      </View>
    </View>
  );
};

export default MFButtonComponent;
