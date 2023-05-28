import { DeviceEventEmitter, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MFNotificationCard, { Notification } from "./MFNotificationCard";

import { config } from "../../config/config";
import { getUIdef, scaleAttributes } from "../../utils/uidefinition";

/** Props of NotificationProvider */
interface NotificationProviderProps {
  /** List of notifications to be displayed */
  notifications?: Notification[];
  /** List of elements to be rendered */
  children?: React.ReactNode;
  /** Trigger function to display notification */
  setNotifications?: (notifications: Notification[]) => void;
  /** Function to create a UINotifcation from anywhere in the app */
  createNotification?: (notification: Notification) => void;
}

/**
 * A functional component that renders an a NotificationProvider.
 * Holds all the UINotifications and renders them at once
 * @param {NotificationProviderProps} props - The props required for MFMenu.
 * @returns {JSX.Element} - The rendered MFMenu.
 */
const MFNotificationProvider = (props: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const createNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
    // setTimeout(() => {
    //   closeNotification(notification);
    // }, 3000);
  };
  const closeNotification = (notification: Notification) => {
    setNotifications(
      notifications?.filter(
        (_notification) => notification.id !== _notification.id
      ) || []
    );
  };

  useEffect(() => {
    const createNotificationSubscription = DeviceEventEmitter.addListener(
      "createNotification",
      createNotification
    );
    const closeNotificationSubscription = DeviceEventEmitter.addListener(
      "closeNotification",
      closeNotification
    );
    return () => {
      createNotificationSubscription.remove();
      closeNotificationSubscription.remove();
    };
  }, []);

  return (
    <>
      {props.children}
      <View style={styles.notificationsRoot}>
        {notifications?.map((notification) => (
          <MFNotificationCard
            id={notification.id}
            key={notification.id}
            iconName={notification.iconName}
            onCloseNotification={closeNotification}
            duration={config.notificationsConfig.duration}
            title={notification.title}
            subtitle={notification.subtitle}
            containerStyle={styles.notificationElement}
          />
        ))}
      </View>
    </>
  );
};

export default MFNotificationProvider;

const styles: any = StyleSheet.create(
  getUIdef("NotificationProvider")?.style ||
    scaleAttributes({
      notificationsRoot: {
        position: "absolute",
        right: 0,
        top: 30,
      },
      notificationElement: {
        marginVertical: 20,
      },
    })
);
