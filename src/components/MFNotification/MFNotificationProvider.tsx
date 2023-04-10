import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MFNotificationCard, { Notification } from "./MFNotificationCard";
import MFEventEmitter from "../../utils/MFEventEmitter";

import { config } from "../../config/config";
import { getUIdef, scaleAttributes } from "../../utils/uidefinition";

interface NotificationProviderProps {
  notifications?: Notification[];
  children?: React.ReactNode;
  setNotifications?: (notifications: Notification[]) => void;
  createNotification?: (notification: Notification) => void;
}

const MFNotificationProvider = (props: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState< Notification[]>([]);

  const createNotification = (notification: Notification) => {
    setNotifications([...notifications, notification])
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
    MFEventEmitter.on("createNotification", createNotification);
    MFEventEmitter.on("closeNotification", closeNotification);
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
