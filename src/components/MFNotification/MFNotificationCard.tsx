import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import mkIcons from "../../config/MKIcons";
import { config } from "../../config/config";
import { getFontIcon } from "../../config/strings";
import { globalStyles } from "../../config/styles/GlobalStyles";
import { getUIdef, scaleAttributes } from "../../utils/uidefinition";

/**
 * Interface for UINotification
 */
export interface Notification {
  /** ID of the notification */
  id: string;
  /** Icon displayed in the notification */
  iconName: keyof typeof mkIcons;
  /** Text label displayed  */
  title?: string;
  /** Second message line displayed in UI Notification */
  subtitle?: string;
}
/** Props for NotificationCard */
interface NotificationCardProps {
  /** Id of the notification card */
  id: string;
  /** Text label displayed  */
  title?: string;
  /** Second message line displayed in UI Notification */
  subtitle?: string;
  /** Icon displayed in the notification */
  iconName: keyof typeof mkIcons;
  /** Style of the icon displayed */
  iconStyle?: { [key: string]: any };
  /** Function to trigger on notification closure */
  onCloseNotification: (arg0: Notification) => void;
  /** The duration of message display */
  duration: number;
  /** Styles of the container that displays the UINotification */
  containerStyle?: { [key: string]: any };
}

/**
 * A functional component that renders an a MFNotificationCard.
 * @param {NotificationCardProps} props - The props required for MFMenu.
 * @returns {JSX.Element} - The rendered MFNotificationCard.
 */
const MFNotificationCard = (props: NotificationCardProps) => {
  const [progress, setProgress] = useState(0);
  const [horizontalPosition, setHorizontalPosition] = useState(
    new Animated.Value(700)
  );
  const { iconStyle, iconName, title, subtitle, containerStyle } = props;
  const slideContainerStyle = {
    transform: [
      {
        translateX: horizontalPosition,
      },
    ],
  };
  const slideIn = () => {
    Animated.spring(horizontalPosition, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    // Will change horizontalPosition value to 0 in 5 seconds
    Animated.timing(horizontalPosition, {
      toValue: 700,
      useNativeDriver: true,
    }).start(() => {
      const { onCloseNotification } = props;
      const notification = {
        id: props.id,
        iconName: props.iconName,
        title: props.title,
        subtitle: props.subtitle,
      };
      onCloseNotification && onCloseNotification(notification);
    });
  };
  const clock = (progress: any) => {
    const { duration } = props;
    // Calculate how much each tick should increase the progress to allow for the duration.
    const increment = 100 / (duration / config.notificationsConfig.tick);

    if (progress < 100) {
      const newProgress = progress + increment;
      setProgress(newProgress);

      setTimeout(() => {
        clock(newProgress);
      }, config.notificationsConfig.tick);
    } else {
      slideOut();
    }
  };
  useEffect(() => {
    clock(progress);
    slideIn();
  }, []);

  return (
    <Animated.View style={[styles.root, containerStyle, slideContainerStyle]}>
      <View style={styles.content}>
        <Text style={[styles.iconStyle, iconStyle]}>
          {getFontIcon(iconName)}
        </Text>
        <View style={styles.flexOne}>
          {!!title && <Text style={styles.titleText}>{title}</Text>}
          {!!subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.progressBase}>
        <View
          // style={{ ...styles.progressBar, width: `%${progress}` }}
          style={{
            ...styles.progressBar,
            width: `${progress}%`,
          }}
        />
      </View>
    </Animated.View>
  );
};

export default MFNotificationCard;

// const styles = StyleSheet.create({});
const styles: any = StyleSheet.create(
  getUIdef("Notifications")?.style ||
    scaleAttributes({
      root: {
        backgroundColor: globalStyles.backgroundColors.shade2,
        width: 700,
      },
      content: {
        paddingVertical: 47,
        paddingHorizontal: 51,
        flexDirection: "row",
        alignItems: "center",
      },
      titleText: {
        fontSize: globalStyles.fontSizes.subTitle1,
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.light,
      },
      subtitleText: {
        fontSize: globalStyles.fontSizes.subTitle1,
        fontFamily: globalStyles.fontFamily.semiBold,
        color: globalStyles.fontColors.light,
      },
      iconStyle: {
        marginRight: 51,
        fontSize: 125,
        color: globalStyles.fontColors.light,
        fontFamily: globalStyles.fontFamily.icons,
      },
      progressBase: {
        height: 4,
        width: "25%",
        backgroundColor: globalStyles.backgroundColors.shade4,
      },
      progressBar: {
        height: "100%",
        backgroundColor: globalStyles.backgroundColors.shade3,
      },
      flexOne: {
        flex: 1,
      },
    })
);
