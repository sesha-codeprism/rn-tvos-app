import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Notification } from './MFNotificationCard';

interface NotificationProviderProps {
    notifications: Notification[];
    children: React.ReactNode;
    setNotifications: (notifications: Notification[]) => void;
    createNotification: (notification: Notification) => void;
}

const MFNotificationProvider = (props: NotificationProviderProps) => {
  const  handleNotificationClose = (notification: Notification) => {
         props.setNotifications(
             props.notifications?.filter(
                (_notification) => notification.id !== _notification.id
            ) || []
        );
    };
  
    return (
    <View>
      <Text>MFNotificationProvider</Text>
    </View>
  )
}

export default MFNotificationProvider

const styles = StyleSheet.create({})