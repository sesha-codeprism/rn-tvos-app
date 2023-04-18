import { Settings as SettingsRN } from "react-native";

export const setNotification = (data: any) => {
  SettingsRN.set({ NOTIFICATION: JSON.stringify(data) });
};
export const getNotification = () => {
  const notification = SettingsRN.get("NOTIFICATION");
  return notification && notification.length
    ? JSON.parse(notification)
    : undefined;
};
